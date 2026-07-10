#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Smoke test — בדיקת עשן מקצה-לקצה ל-API של "מדריך תוכניות"
# מריץ בקשות אמיתיות מול השרת הרץ ומוודא שהזרימות הקריטיות עובדות.
#
# שימוש:
#   1. ודאי שהשרת רץ:  npm run dev
#   2. ודאי שיש נתוני seed:  npx tsx prisma/seed.ts
#   3. הריצי:  npm run smoke   (או: bash scripts/smoke-test.sh)
#
# משתני סביבה אופציונליים:
#   BASE_URL      כתובת השרת (ברירת מחדל http://localhost:3000)
#   SEED_EMAIL    אימייל המפיקה מה-seed (ברירת מחדל hana@example.com)
#   SEED_PASSWORD סיסמת ה-seed (ברירת מחדל 123456)
# ---------------------------------------------------------------------------
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
SEED_EMAIL="${SEED_EMAIL:-hana@example.com}"
SEED_PASSWORD="${SEED_PASSWORD:-123456}"

PASS=0
FAIL=0
GREEN=$'\e[32m'; RED=$'\e[31m'; DIM=$'\e[2m'; RESET=$'\e[0m'

# check <שם-בדיקה> <ערך-בפועל> <ערך-מצופה>
check() {
  local name="$1" actual="$2" expected="$3"
  if [[ "$actual" == "$expected" ]]; then
    printf "  ${GREEN}✓${RESET} %s\n" "$name"
    PASS=$((PASS+1))
  else
    printf "  ${RED}✗${RESET} %s  ${DIM}(expected: %s, got: %s)${RESET}\n" "$name" "$expected" "$actual"
    FAIL=$((FAIL+1))
  fi
}

# מחזיר קוד HTTP של בקשת GET
http_get() { curl -s -o /dev/null -w "%{http_code}" "$1"; }
# מחזיר גוף התשובה של בקשת GET
body_get() { curl -s "$1"; }
# ספירת פריטים במערך JSON שמגיע ב-stdin
json_len() { node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).length)}catch{console.log('ERR')}})"; }
# חילוץ שדה מ-JSON שמגיע ב-stdin
json_field() { node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const v=JSON.parse(d);console.log($1??'')}catch{console.log('ERR')}})"; }

echo "──────────────────────────────────────────────"
echo " Smoke test → $BASE_URL"
echo "──────────────────────────────────────────────"

# 0. השרת חי -----------------------------------------------------------------
echo "▸ זמינות השרת"
if [[ "$(http_get "$BASE_URL/")" != "200" ]]; then
  printf "  ${RED}✗ השרת לא מגיב ב-%s — הריצי 'npm run dev' תחילה${RESET}\n" "$BASE_URL"
  exit 1
fi
check "עמוד הבית מחזיר 200" "$(http_get "$BASE_URL/")" "200"
check "עמוד /programs מחזיר 200" "$(http_get "$BASE_URL/programs")" "200"

# 1. רשימת תוכניות -----------------------------------------------------------
echo "▸ שליפת תוכניות"
COUNT=$(body_get "$BASE_URL/api/programs" | json_len)
if [[ "$COUNT" == "ERR" || "$COUNT" -lt 1 ]]; then
  printf "  ${RED}✗ אין תוכניות מאושרות. הריצי seed ואשרי תוכנית (status=approved).${RESET}\n"
  FAIL=$((FAIL+1))
else
  check "הרשימה מכילה לפחות תוכנית אחת" "true" "true"
fi
# כל התוכניות שמוחזרות חייבות להיות approved
ALL_APPROVED=$(body_get "$BASE_URL/api/programs" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const a=JSON.parse(d);console.log(a.every(p=>p.status==='approved'))})")
check "כל התוכניות ברשימה בסטטוס approved" "$ALL_APPROVED" "true"
# ה-JOIN עם המפיקה מחזיר פרטי קשר
HAS_PRODUCER=$(body_get "$BASE_URL/api/programs" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const a=JSON.parse(d);console.log(a.length>0 && !!a[0].producer && !!a[0].producer.name)})")
check "כל תוכנית כוללת פרטי מפיקה (JOIN)" "$HAS_PRODUCER" "true"

# 2. סינון --------------------------------------------------------------------
echo "▸ סינון וחיפוש"
CAT_COUNT=$(body_get "$BASE_URL/api/programs?category=%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%95%D7%AA" | json_len)
check "סינון לפי קטגוריה 'תוכניות' מחזיר תוצאות" "$([[ $CAT_COUNT -ge 1 ]] && echo true || echo false)" "true"
LOW_PRICE=$(body_get "$BASE_URL/api/programs?maxPrice=1" | json_len)
check "סינון maxPrice=1 מסנן החוצה תוכניות יקרות" "$LOW_PRICE" "0"
SEARCH_COUNT=$(body_get "$BASE_URL/api/programs?search=%D7%A2%D7%A8%D7%9B%D7%99%D7%9D" | json_len)
check "חיפוש טקסט 'ערכים' מוצא תוצאה" "$([[ $SEARCH_COUNT -ge 1 ]] && echo true || echo false)" "true"

# 3. התחברות ------------------------------------------------------------------
echo "▸ אימות (Auth)"
LOGIN_OK=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SEED_EMAIL\",\"password\":\"$SEED_PASSWORD\"}")
check "התחברות עם פרטים נכונים → 200" "$LOGIN_OK" "200"
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth" -H "Content-Type: application/json" \
  -d "{\"email\":\"$SEED_EMAIL\",\"password\":\"$SEED_PASSWORD\"}" | json_field "v.token")
check "ההתחברות מחזירה JWT token" "$([[ -n "$TOKEN" && "$TOKEN" != "ERR" ]] && echo true || echo false)" "true"
WRONG=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SEED_EMAIL\",\"password\":\"wrongpass\"}")
check "סיסמה שגויה (באורך תקין) → 401" "$WRONG" "401"
SHORT=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SEED_EMAIL\",\"password\":\"x\"}")
check "סיסמה קצרה מדי → 400 (ולידציה)" "$SHORT" "400"

# 4. הרשמה --------------------------------------------------------------------
echo "▸ הרשמה (Register)"
DUP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"בדיקה\",\"email\":\"$SEED_EMAIL\",\"phone\":\"0500000000\",\"password\":\"123456\"}")
check "הרשמה עם אימייל קיים → 400" "$DUP" "400"

# סיכום -----------------------------------------------------------------------
echo "──────────────────────────────────────────────"
printf " תוצאה: ${GREEN}%d עברו${RESET}, ${RED}%d נכשלו${RESET}\n" "$PASS" "$FAIL"
echo "──────────────────────────────────────────────"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
