# 📋 רשימת משימות - מדריך תוכניות (Producers Directory)

> **תאריך:** 19 באפריל 2026  
> **מצב:** פיתוח פעיל  
> **רמת קושי:** מותאם למפתחת ג'וניורית

---

## 📖 תוכן עניינים

- [הבנת הפרויקט](#-הבנת-הפרויקט)
- [מצב נוכחי](#-מצב-נוכחי---מה-יש-ומה-חסר)
- [P0 - משימות קריטיות](#-p0---קריטי-חסימה-פונקציונלית--אבטחה)
- [P1 - משימות חשובות](#-p1---חשוב-יציבות--תקינות)
- [P2 - שיפורי קוד](#-p2---שיפור-איכות-קוד--תחזוקתיות)
- [P3 - המלצות לעתיד](#-p3---המלצות-לעתיד)
- [מילון מושגים](#-מילון-מושגים)

---

## 🧩 הבנת הפרויקט

### מה הפרויקט עושה?

הפרויקט הוא **אתר קטלוג** לתוכניות ואירועים. יש בו שלושה "צדדים" (סוגי משתמשים):

```
┌─────────────────────────────────────────────────────────┐
│                    1. מנהלת (Admin)                      │
│                                                         │
│  • מנהלת אחת שרואה הכל                                  │
│  • מאשרת תוכניות ע"י לחיצה על "שולם"                    │
│  • מנהלת מפיקות ותוכניות                                │
└────────────────────────┬────────────────────────────────┘
                         │ מאשרת
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   2. מפיקות (Producers)                  │
│                                                         │
│  • נרשמות עם שם משתמש וסיסמה                            │
│  • יש להן פרטים אישיים (שם, טלפון, אימייל)             │
│  • יוצרות ועורכות תוכניות                               │
│  • תוכנית חדשה = סטטוס "נוצר" (לא ציבורית!)            │
└────────────────────────┬────────────────────────────────┘
                         │ אחרי אישור
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  3. קטלוג ציבורי (Public)                │
│                                                         │
│  • כל אחד יכול לגלוש                                    │
│  • רואים רק תוכניות ששולם עליהן                         │
│  • בכל תוכנית - פרטי המפיקה ליצירת קשר                 │
└─────────────────────────────────────────────────────────┘
```

### הטכנולוגיות שבשימוש

| טכנולוגיה | תפקיד | הסבר פשוט |
|-----------|--------|-----------|
| **Next.js 16** | פריימוורק | "השלד" של האתר - מנהל דפים, ניתוב, ושרת |
| **React 19** | UI | בונה את מה שהמשתמש רואה על המסך |
| **TypeScript** | שפה | JavaScript עם בדיקת טיפוסים - עוזר למנוע באגים |
| **MongoDB** | מסד נתונים | שומר את כל המידע (מפיקות, תוכניות וכו') |
| **Prisma** | ORM | "מתרגם" בין TypeScript ל-MongoDB |
| **Tailwind CSS** | עיצוב | מעצב את האתר עם classes מוכנים |
| **Cloudinary** | מדיה | שירות חיצוני לאחסון תמונות וסרטונים |

### מבנה הקבצים - מה נמצא איפה?

```
app/                          ← הדפים והשרת
├── page.tsx                  ← עמוד הבית
├── layout.tsx                ← "מעטפת" לכל הדפים (HTML, כיוון RTL)
├── login/page.tsx            ← דף התחברות למפיקות
├── register/page.tsx         ← דף הרשמה למפיקות
├── dashboard/                ← אזור המפיקות (דורש התחברות)
│   ├── page.tsx              ← הדשבורד הראשי - רשימת תוכניות
│   ├── new/page.tsx          ← טופס יצירת תוכנית חדשה
│   └── edit/[id]/page.tsx    ← טופס עריכת תוכנית קיימת
├── programs/page.tsx         ← הקטלוג הציבורי
└── api/                      ← ה-API (השרת שמטפל בבקשות)
    ├── auth/route.ts         ← טיפול בהתחברות
    ├── register/route.ts     ← טיפול בהרשמה
    ├── dashboard/route.ts    ← CRUD לתוכניות (יצירה/קריאה/עדכון/מחיקה)
    ├── programs/route.ts     ← שליפת תוכניות לקטלוג הציבורי
    └── test/route.ts         ← בדיקת חיבור ל-DB

components/                   ← רכיבי UI שחוזרים על עצמם
├── dashboard/
│   ├── ProgramCard.tsx       ← כרטיס תוכנית בדשבורד מפיקה
│   └── SubscriptionStatus.tsx ← תצוגת סטטוס מנוי
└── programs/
    ├── ProgramCard.tsx       ← כרטיס תוכנית בקטלוג ציבורי
    ├── ProgramFilters.tsx    ← פילטרים לחיפוש
    └── ProgramModal.tsx      ← חלון פרטי תוכנית

lib/                          ← קוד עזר
├── auth.ts                   ← פונקציות אימות (בעייתי - לתקן!)
└── prisma.ts                 ← חיבור למסד הנתונים

prisma/
├── schema.prisma             ← הגדרת המודלים (טבלאות) במסד הנתונים
└── seed.ts                   ← סקריפט שממלא את ה-DB בנתוני דוגמה

types/
└── program.ts                ← הגדרת TypeScript types
```

---

## 📊 מצב נוכחי - מה יש ומה חסר

### סיכום גרפי

```
צד מנהלת:     [░░░░░░░░░░]   0%  ← חסר לגמרי
צד מפיקות:    [████████░░]  80%  ← עובד, חסר status + אבטחה
צד ציבורי:    [███████░░░]  70%  ← עובד, חסר סינון לפי status
אבטחה:        [██░░░░░░░░]  20%  ← הצפנת סיסמה בלבד
איכות קוד:    [██████░░░░]  60%  ← מבנה טוב, חסרים כללים מקצועיים
```

### טבלת מצב מפורטת

| תחום | סטטוס | מה קיים | מה חסר |
|------|--------|---------|--------|
| מודל מפיקות | ✅ | שם, אימייל, טלפון, סיסמה מוצפנת | - |
| מודל תוכניות | ⚠️ חלקי | כל השדות קיימים | **חסר שדה `status`** |
| מודל מנויים | ✅ | תאריך תפוגה, סטטוס | - |
| הרשמת מפיקה | ✅ | טופס + API + הצפנת סיסמה | validation בשרת |
| התחברות מפיקה | ✅ | טופס + API + bcrypt | אבטחה מבוססת JWT |
| דשבורד מפיקות | ✅ | צפייה, יצירה, עריכה, מחיקה | הצגת status |
| העלאת מדיה | ✅ | Cloudinary - תמונות + וידאו | - |
| קטלוג ציבורי | ⚠️ חלקי | רשימה + פילטרים + מודל | **סינון לפי status** |
| **מודל מנהלת** | ❌ | - | **חסר לגמרי** |
| **דשבורד מנהלת** | ❌ | - | **חסר לגמרי** |
| **זרימת אישור** | ❌ | - | **חסר לגמרי** |
| **אבטחה** | ❌ | הצפנת סיסמה בלבד | **JWT, cookies, authorization** |

---

## 🔴 P0 - קריטי (חסימה פונקציונלית + אבטחה)

> **אלה המשימות הראשונות שצריך לעשות.** בלעדיהן האתר לא עונה על הדרישות.

---

### משימה 1: הוספת שדה `status` למודל Program

**למה זה קריטי?**  
לפי הדרישות, תוכנית נוצרת בסטטוס "נוצר" ומוצגת לציבור רק אחרי שהמנהלת לוחצת "שולם". כרגע **אין שום שדה שמבדיל** בין תוכנית חדשה לתוכנית מאושרת - כולן נראות אותו דבר.

**מה זה `status`?**  
שדה טקסט (string) שמגדיר את המצב של התוכנית:
- `"created"` = נוצרה ע"י המפיקה, ממתינה לאישור
- `"paid"` = המנהלת אישרה, מוצגת בקטלוג הציבורי

**מה לעשות:**

**שלב 1** - לפתוח את `prisma/schema.prisma` ולהוסיף שדה:
```prisma
model Program {
  // ... כל השדות הקיימים ...
  status      String   @default("created")   // ← הוסיפי שורה זו
  // ... שאר השדות ...
}
```

> **מה זה `@default("created")`?**  
> זה אומר שכל תוכנית חדשה שנוצרת תקבל אוטומטית status של "created", בלי שצריך לציין את זה בקוד.

**שלב 2** - לפתוח את `types/program.ts` ולהוסיף את השדה ל-Types:
```typescript
export interface Program {
  // ... שדות קיימים ...
  status: 'created' | 'paid';   // ← הוסיפי
}

export interface DashboardProgram {
  // ... שדות קיימים ...
  status: 'created' | 'paid';   // ← הוסיפי
}
```

> **מה זה `'created' | 'paid'`?**  
> זה TypeScript "union type" - אומר שהערך יכול להיות **רק** אחד מהשניים. אם תנסי לשים ערך אחר, TypeScript יתריע.

**שלב 3** - להריץ בטרמינל:
```bash
npx prisma db push
```
> **מה זה עושה?**  
> זה מסנכרן את השינויים ב-schema.prisma עם מסד הנתונים. בלי זה, ה-DB לא יידע שהוספנו שדה חדש.

---

### משימה 2: סינון הקטלוג הציבורי - רק תוכניות "שולם"

**למה זה קריטי?**  
כרגע ה-API בכתובת `/api/programs` מחזיר **את כל התוכניות** - כולל אלו שעוד לא אושרו. זה פוגע בכל המודל העסקי.

**מה לעשות:**

לפתוח את `app/api/programs/route.ts` ולהוסיף תנאי סינון:

```typescript
// כרגע (שורה 5-6):
const where: any = {};

// צריך להיות:
const where: any = { status: 'paid' };   // ← רק תוכניות ששולם עליהן
```

> **מה קורה כאן?**  
> המשתנה `where` הוא "תנאי" שנשלח ל-Prisma. כשמוסיפים `status: 'paid'`, Prisma יחזיר רק תוכניות שה-status שלהן הוא "paid". כל תוכנית בסטטוס "created" פשוט לא תוחזר.

---

### משימה 3: הוספת מודל Admin ב-DB

**למה זה קריטי?**  
אין ב-DB שום מקום לשמור את פרטי המנהלת. בלי זה, אי אפשר לבנות התחברות או דשבורד למנהלת.

**מה זה "מודל"?**  
מודל = הגדרה של "טבלה" במסד הנתונים. הוא מגדיר אילו שדות (עמודות) יש, ומה הטיפוס של כל שדה.

**מה לעשות:**

**שלב 1** - להוסיף ב-`prisma/schema.prisma`:
```prisma
model Admin {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
}
```

> **הסבר על כל שדה:**
> | שדה | הסבר |
> |-----|------|
> | `id` | מזהה ייחודי - MongoDB יוצר אוטומטית |
> | `email` | כתובת מייל - `@unique` = לא יכולות להיות שתי מנהלות עם אותו מייל |
> | `passwordHash` | הסיסמה **המוצפנת** (לעולם לא שומרים סיסמה רגילה!) |
> | `name` | שם המנהלת |
> | `createdAt` | תאריך יצירה - נוצר אוטומטית |

**שלב 2** - להוסיף ב-`types/program.ts`:
```typescript
export interface Admin {
  id: string;
  email: string;
  name: string;
}
```

**שלב 3** - להריץ:
```bash
npx prisma db push
```

**שלב 4** - להוסיף ב-`prisma/seed.ts` יצירת מנהלת ברירת מחדל:
```typescript
// בתוך הפונקציה main(), אחרי יצירת המפיקה:
const adminPasswordHash = await bcrypt.hash("admin123", 10);
await prisma.admin.create({
  data: {
    name: "מנהלת ראשית",
    email: "admin@example.com",
    passwordHash: adminPasswordHash,
  }
});
console.log("👑 נוצרה מנהלת!");
console.log("📧 אימייל: admin@example.com");
console.log("🔑 סיסמה: admin123");
```

---

### משימה 4: בניית דף התחברות למנהלת

**למה זה קריטי?**  
המנהלת צריכה דרך להיכנס למערכת. זה דף התחברות נפרד מזה של המפיקות.

**מה לעשות:**

**שלב 1** - ליצור API route חדש: `app/api/admin/auth/route.ts`

> **מה זה API Route?**  
> זה קובץ שרץ **בצד השרת**. כשהדפדפן שולח בקשה לכתובת `/api/admin/auth`, הקובץ הזה מטפל בבקשה.

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // מחפשים מנהלת עם האימייל הזה
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    // בודקים שהסיסמה נכונה
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    // ההתחברות הצליחה!
    return NextResponse.json({
      adminId: admin.id,
      name: admin.name,
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
```

> **למה מחזירים הודעה זהה גם למייל שגוי וגם לסיסמה שגויה?**  
> זה עיקרון אבטחה. אם נגיד "האימייל לא קיים", האקר ילמד אילו מיילים רשומים במערכת. בהודעה כללית, הוא לא יודע מה בדיוק שגוי.

**שלב 2** - ליצור דף התחברות: `app/admin/login/page.tsx`

הדף דומה מאוד ל-`app/login/page.tsx` (דף ההתחברות של המפיקות), עם שינויים:
- הכותרת: "התחברות מנהלת"
- ה-fetch שולח ל-`/api/admin/auth` (במקום `/api/auth`)
- לאחר הצלחה, שומרים `adminId` (במקום `producerId`)
- מפנה ל-`/admin` (במקום `/dashboard`)

---

### משימה 5: בניית דשבורד מנהלת - ניהול תוכניות

**למה זה קריטי?**  
זו הפונקציונליות המרכזית שחסרה - היכולת של המנהלת לראות תוכניות ולאשר אותן ("שולם").

**מה הדשבורד צריך להציג:**
```
┌─────────────────────────────────────────────────────────────┐
│  דשבורד מנהלת                                    [התנתקי]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 סטטיסטיקות                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ 15       │ │ 8        │ │ 7        │                    │
│  │ סה"כ     │ │ ממתינות  │ │ שולם     │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│  📋 תוכניות ממתינות לאישור                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ הצגה על ערכים         │ חנה כהן │ נוצר │ [✅ שולם]  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ סדנת יצירתיות         │ שרה לוי │ נוצר │ [✅ שולם]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  📋 תוכניות ששולמו                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ הרצאה על חינוך        │ רחל כ. │ שולם │              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**מה לעשות:**

**שלב 1** - ליצור API route: `app/api/admin/programs/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - שליפת כל התוכניות (למנהלת)
export async function GET(request: Request) {
  try {
    const programs = await prisma.program.findMany({
      include: { producer: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Admin programs GET error:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}

// PUT - עדכון סטטוס תוכנית (כפתור "שולם")
export async function PUT(request: Request) {
  try {
    const { programId, status } = await request.json();

    if (!programId || !status) {
      return NextResponse.json({ error: 'חסרים נתונים' }, { status: 400 });
    }

    const program = await prisma.program.update({
      where: { id: programId },
      data: { status },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Admin programs PUT error:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
```

> **מה זה `include`?**  
> כש-Prisma שולף תוכניות, הוא לא מביא אוטומטית את פרטי המפיקה. `include` אומר לו: "תביא גם את המפיקה שקשורה לתוכנית, אבל רק את השם, מייל וטלפון שלה".

**שלב 2** - ליצור דף: `app/admin/page.tsx`

הדף צריך:
1. לבדוק שהמנהלת מחוברת (יש `adminId` ב-localStorage)
2. לשלוף את כל התוכניות מ-`/api/admin/programs`
3. להציג אותן מחולקות: "ממתינות" (status === "created") ו"ששולמו" (status === "paid")
4. לכל תוכנית ממתינה - כפתור "שולם" שעושה `PUT` עם `status: "paid"`

> **מה קורה כשלוחצים "שולם"?**  
> 1. הדפדפן שולח בקשה PUT ל-API עם `{ programId: "...", status: "paid" }`
> 2. ה-API מעדכן את ה-status ב-DB
> 3. הדף מרענן את הרשימה
> 4. התוכנית עוברת מ"ממתינות" ל"ששולמו"
> 5. **מהרגע הזה** - התוכנית מופיעה בקטלוג הציבורי (כי משימה 2 סוננה רק status: "paid")

---

### משימה 6: בניית ניהול מפיקות

**למה זה קריטי?**  
המנהלת צריכה לראות את כל המפיקות הרשומות, ולנהל אותן (צפייה, מחיקה).

**מה לעשות:**

**שלב 1** - ליצור API route: `app/api/admin/producers/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - שליפת כל המפיקות
export async function GET() {
  try {
    const producers = await prisma.producer.findMany({
      include: {
        subscription: true,
        _count: { select: { programs: true } },   // סופר כמה תוכניות לכל מפיקה
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(producers);
  } catch (error) {
    console.error('Admin producers GET error:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}

// DELETE - מחיקת מפיקה
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const producerId = searchParams.get('producerId');

    if (!producerId) {
      return NextResponse.json({ error: 'חסר producerId' }, { status: 400 });
    }

    // מוחקים קודם את התוכניות של המפיקה, אחר כך את המנוי, ואז אותה
    await prisma.program.deleteMany({ where: { producerId } });
    await prisma.subscription.deleteMany({ where: { producerId } });
    await prisma.producer.delete({ where: { id: producerId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin producers DELETE error:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
```

> **למה מוחקים בסדר הזה?**  
> ב-DB יש "קשרים" (relations). תוכנית מצביעה על מפיקה (producerId). אם ננסה למחוק מפיקה שיש לה תוכניות - נקבל שגיאה! לכן מוחקים קודם את ה"ילדים" (תוכניות ומנוי) ורק אחר כך את ה"הורה" (מפיקה).

**שלב 2** - ליצור דף: `app/admin/producers/page.tsx`

הדף מציג טבלה של כל המפיקות עם: שם, אימייל, טלפון, מס' תוכניות, סטטוס מנוי, וכפתור מחיקה.

---

### משימה 7: תיקון אבטחת אימות

**למה זה קריטי?**  
כרגע האימות מבוסס על `localStorage` - וזה **לא בטוח בכלל**.

**מה הבעיה?**

```
מצב נוכחי (לא בטוח):
1. המפיקה מתחברת
2. ה-ID שלה נשמר ב-localStorage
3. כל בקשה שולחת את ה-ID כפרמטר

למה זה בעייתי?
• כל אחד יכול לפתוח Console בדפדפן ולכתוב:
  localStorage.setItem('producerId', 'id-של-מפיקה-אחרת')
  ופתאום הוא "מחובר" בתור מישהי אחרת! 😱

• ה-ID נשלח כ-query parameter בכתובת URL - נראה בלוגים ובהיסטוריה
```

**מה צריך לעשות (הגרסה הפשוטה):**

בגרסה הראשונה, עד שלומדים JWT, אפשר לפחות:

1. **להעביר את ה-ID ל-httpOnly cookie** במקום localStorage
2. **לבדוק בצד השרת** שה-producer/admin באמת קיים ב-DB

> **מה זה httpOnly cookie?**  
> Cookie רגיל - JavaScript בדפדפן יכול לקרוא ולשנות אותו (כמו localStorage).  
> httpOnly cookie - **רק השרת** יכול לקרוא אותו. JavaScript בדפדפן לא יכול לגעת בו. הרבה יותר בטוח!

**קובץ שצריך לשנות:** `lib/auth.ts` - להחליף את כל הפונקציות

**קבצים נוספים:** כל דפי הדשבורד וה-API routes צריכים לעבור מ-localStorage ל-cookie

> **הערה:** זו משימה גדולה שמשפיעה על הרבה קבצים. מומלץ לעשות אותה בסוף אחרי שכל הפונקציונליות עובדת, כדי לא לשבור דברים באמצע.

---

### משימה 8: הוספת בדיקת הרשאות (Authorization) ב-API

**למה זה קריטי?**  
כרגע, מפיקה אחת יכולה למחוק או לערוך תוכנית של מפיקה אחרת. אין שום בדיקה ש"התוכנית שייכת למפיקה שביקשה".

**מה ההבדל בין Authentication ל-Authorization?**

| מושג | שאלה | דוגמה |
|------|-------|-------|
| **Authentication** (אימות) | "מי את?" | כניסה עם מייל וסיסמה |
| **Authorization** (הרשאות) | "מה מותר לך?" | האם מותר לך למחוק את התוכנית **הזו**? |

**הבעיה בפועל:**

```typescript
// app/api/dashboard/route.ts - הקוד הנוכחי:
export async function DELETE(request: Request) {
  const programId = searchParams.get('programId');
  await prisma.program.delete({
    where: { id: programId! },   // ← מוחק בלי לבדוק של מי זה!
  });
}
```

**הפתרון:**

```typescript
// הקוד המתוקן:
export async function DELETE(request: Request) {
  const programId = searchParams.get('programId');
  const producerId = searchParams.get('producerId');

  if (!programId || !producerId) {
    return NextResponse.json({ error: 'חסרים נתונים' }, { status: 400 });
  }

  // בודקים שהתוכנית שייכת למפיקה הזו!
  const program = await prisma.program.findFirst({
    where: { id: programId, producerId: producerId },
  });

  if (!program) {
    return NextResponse.json({ error: 'התוכנית לא נמצאה' }, { status: 404 });
  }

  await prisma.program.delete({ where: { id: programId } });
  return NextResponse.json({ success: true });
}
```

> **מה ההבדל?**  
> `findFirst` עם שני תנאים (`id` + `producerId`) מוודא שהתוכנית גם קיימת **וגם** שייכת למפיקה שביקשה. אם מפיקה מנסה למחוק תוכנית של מישהי אחרת - תחזור שגיאה.

**לעשות את אותו דבר גם ב-PUT** (עדכון תוכנית).

---

## 🟠 P1 - חשוב (יציבות + תקינות)

> משימות אלה לא חוסמות את הפונקציונליות, אבל בלעדיהן האתר **לא יציב** - עלול לקרוס ולהיות פגיע.

---

### משימה 9: הוספת Validation בצד שרת (עם Zod)

**למה זה חשוב?**  
כרגע, אם מישהו שולח נתונים לא תקינים ל-API (למשל מייל ריק, או סיסמה של תו אחד) - השרת לא בודק ופשוט שומר ב-DB.

**מה זה Zod?**  
ספריית JavaScript שבודקת שנתונים תואמים למבנה שהגדרת. כמו "שומר" שבודק כרטיסים בכניסה.

**מה לעשות:**

**שלב 1** - להתקין:
```bash
npm install zod
```

**שלב 2** - ליצור קובץ: `lib/validations.ts`
```typescript
import { z } from 'zod';

// סכמת הרשמה - מגדירה איך נתוני הרשמה צריכים להיראות
export const registerSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().min(9, 'מספר טלפון לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
});

// סכמת יצירת תוכנית
export const programSchema = z.object({
  title: z.string().min(2, 'שם התוכנית חייב להכיל לפחות 2 תווים'),
  description: z.string().min(10, 'תיאור חייב להכיל לפחות 10 תווים'),
  category: z.string().min(1, 'חובה לבחור קטגוריה'),
  targetAge: z.string().min(1, 'חובה לבחור גיל מטרה'),
  duration: z.string().min(1, 'חובה למלא משך'),
  location: z.string().min(1, 'חובה למלא מיקום'),
  price: z.number().nullable(),          // מותר להיות null (אופציונלי)
  tags: z.array(z.string()).default([]),  // מערך של מחרוזות, ברירת מחדל ריק
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
});

// סכמת התחברות
export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'חובה למלא סיסמה'),
});
```

**שלב 3** - להשתמש ב-API routes:
```typescript
// דוגמה ב-app/api/register/route.ts:
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod בודק את הנתונים
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // result.data מכיל נתונים בטוחים ובדוקים ✅
    const { name, email, phone, password } = result.data;
    // ... המשך הקוד ...
  } catch (error) {
    // ...
  }
}
```

> **מה זה `safeParse`?**  
> פונקציה של Zod שבודקת את הנתונים. אם הכל תקין - מחזירה `{ success: true, data: {...} }`. אם יש בעיה - מחזירה `{ success: false, error: {...} }` עם הודעות שגיאה.

**קבצים לעדכן:** `app/api/register/route.ts`, `app/api/auth/route.ts`, `app/api/dashboard/route.ts` (POST ו-PUT)

---

### משימה 10: הוספת Error Handling (try/catch)

**למה זה חשוב?**  
כשמשהו משתבש (DB לא זמין, JSON לא תקין, וכו') - בלי try/catch השרת פשוט "קורס" ומחזיר שגיאה לא ברורה.

**אילו API routes חסר בהם try/catch?**

| קובץ | פונקציות חסרות |
|------|---------------|
| `app/api/dashboard/route.ts` | `GET`, `POST`, `PUT`, `DELETE` |
| `app/api/programs/route.ts` | `GET` |

**מה לעשות:**

לעטוף **כל** פונקציית API ב-try/catch. דוגמה:

```typescript
// לפני (ללא try/catch):
export async function GET(request: Request) {
  const programs = await prisma.program.findMany({...});
  return NextResponse.json(programs);
}

// אחרי (עם try/catch):
export async function GET(request: Request) {
  try {
    const programs = await prisma.program.findMany({...});
    return NextResponse.json(programs);
  } catch (error) {
    console.error('GET programs error:', error);
    return NextResponse.json(
      { error: 'אירעה שגיאה, נסי שוב מאוחר יותר' },
      { status: 500 }
    );
  }
}
```

> **למה `console.error` ולא להחזיר את השגיאה למשתמש?**  
> שגיאות מפורטות (stack traces) יכולות לחשוף מידע על המערכת להאקרים. השגיאה המפורטת נכתבת ללוג (שרק המפתחת רואה), והמשתמש מקבל הודעה כללית.

---

### משימה 11: הוספת Middleware

**למה זה חשוב?**  
כרגע, ההגנה על דפים מוגנים (דשבורד, אדמין) מתבצעת **בתוך כל דף בנפרד**. Middleware מרכז את זה במקום אחד.

**מה זה Middleware?**  
קוד שרץ **לפני** כל בקשה. כמו שומר בכניסה לבניין שבודק תעודות.

```
בלי Middleware:                    עם Middleware:
                                   
משתמש → דף דשבורד                  משתמש → 🔒 Middleware → דף דשבורד
         ↳ בודק auth                          ↳ בודק auth
משתמש → דף חדש                               ↳ חוסם אם אין
         ↳ בודק auth (שוב!)        
משתמש → דף עריכה                   פעם אחת, במקום אחד!
         ↳ בודק auth (שוב שוב!)    
```

**מה לעשות:**

ליצור קובץ `middleware.ts` **בשורש הפרויקט** (לא בתוך app/):
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // בודק גישה לאזור דשבורד מפיקות
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // כאן תהיה בדיקת cookie/token בעתיד
    // לעכשיו אפשר להשאיר ריק ולהוסיף אחרי משימה 7
  }

  // בודק גישה לאזור מנהלת
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // כאן תהיה בדיקת cookie/token של מנהלת
  }

  return NextResponse.next();
}

// מגדיר על אילו כתובות ה-middleware רץ
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/dashboard/:path*', '/api/admin/:path*'],
};
```

> **מה זה `matcher`?**  
> רשימת כתובות URL שה-middleware רץ עליהן. `:path*` אומר "וגם כל מה שמתחת". למשל `/dashboard/:path*` תופס גם `/dashboard`, גם `/dashboard/new`, גם `/dashboard/edit/123`.

---

### משימה 12: תיקון Non-null Assertion (`!`)

**למה זה חשוב?**  
בקובץ `app/api/dashboard/route.ts` יש `programId!` - הסימן `!` אומר ל-TypeScript "תסמכי עלי שזה לא null". אבל אם זה כן null, השרת יקרוס.

**הקוד הבעייתי:**
```typescript
await prisma.program.delete({
  where: { id: programId! },   // ← מה אם programId הוא null?
});
```

**הפתרון:**
```typescript
if (!programId) {
  return NextResponse.json({ error: 'חסר programId' }, { status: 400 });
}

// עכשיו TypeScript יודע ש-programId הוא string (לא null)
await prisma.program.delete({
  where: { id: programId },   // ← בלי ! - בטוח!
});
```

---

### משימה 13: הצגת סטטוס תוכנית בדשבורד מפיקה

**למה זה חשוב?**  
אחרי שהוספנו status (משימה 1), המפיקה צריכה **לראות** מה הסטטוס של כל תוכנית שלה.

**מה לעשות:**

בקובץ `components/dashboard/ProgramCard.tsx`, להוסיף תצוגת סטטוס:

```tsx
// להוסיף אחרי הקטגוריה:
<span className={`text-xs px-2 py-1 rounded ${
  program.status === 'paid'
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
}`}>
  {program.status === 'paid' ? '✅ שולם' : '⏳ ממתין לאישור'}
</span>
```

> **מה זה הסינטקס `${ ... ? ... : ... }`?**  
> זה "ternary operator" - דרך קצרה לכתוב if/else:
> ```
> תנאי ? "ערך אם נכון" : "ערך אם לא נכון"
> ```
> דוגמה: `program.status === 'paid' ? 'ירוק' : 'צהוב'`

---

### משימה 14: Rate Limiting

**למה זה חשוב?**  
בלי הגבלה, האקר יכול לשלוח אלפי ניסיונות התחברות בשנייה כדי לנחש סיסמאות (brute force).

**מה זה Rate Limiting?**  
הגבלת מספר הבקשות שמותר לשלוח בפרק זמן מסוים. למשל: "מקסימום 5 ניסיונות התחברות בדקה".

**גרסה פשוטה (בלי שירות חיצוני):**

ליצור קובץ `lib/rate-limit.ts`:
```typescript
// מפה שמחזיקה את מספר הניסיונות לכל IP
const attempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  // אם אין רשומה, או שהזמן עבר - מתחילים מחדש
  if (!record || now > record.resetTime) {
    attempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;  // מותר
  }

  // אם עברנו את המקסימום - חוסמים
  if (record.count >= maxAttempts) {
    return false;  // חסום!
  }

  // מעדכנים את המונה
  record.count++;
  return true;  // מותר
}
```

**שימוש ב-API route:**
```typescript
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'יותר מדי ניסיונות. נסי שוב בעוד דקה.' },
      { status: 429 }
    );
  }
  // ... המשך ההתחברות ...
}
```

> **⚠️ הגבלה:** הפתרון הזה עובד רק על שרת אחד. בפרודקשן עם מספר שרתים, צריך Redis (כמו Upstash).

**קבצי API שצריכים Rate Limiting:** `/api/auth`, `/api/register`, `/api/admin/auth`

---

## 🟡 P2 - שיפור (איכות קוד + תחזוקתיות)

> משימות אלה לא ישברו כלום אם לא תעשי אותן עכשיו, אבל הן יהפכו את הקוד ל**קל יותר לתחזוקה** בעתיד.

---

### משימה 15: העברת קבועים לקובץ constants

**למה?**  
הקטגוריות, טווחי הגיל, והמיקומים מופיעים בכמה קבצים שונים. ויש אי-התאמות! למשל:
- בטופס יצירה: `"7-12"` 
- בפילטרים: `"6-12"`

**מה לעשות:**

ליצור `lib/constants.ts`:
```typescript
export const CATEGORIES = [
  'תוכניות',
  'הרצאות',
  'אטרקציות',
  'אתרי נופש',
  'מסעדות',
  'מדריכות טיולים',
] as const;

export const TARGET_AGES = [
  '3-6',
  '7-12',
  '13-18',
] as const;

export const LOCATIONS = [
  'תל אביב',
  'ירושלים',
  'צפון',
  'דרום',
] as const;
```

ואז בכל הטפסים והפילטרים, להחליף את הערכים הידניים ב-import:
```tsx
import { CATEGORIES } from '@/lib/constants';

<select>
  <option value="">בחרי קטגוריה</option>
  {CATEGORIES.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

> **מה זה `as const`?**  
> זה אומר ל-TypeScript: "המערך הזה לא ישתנה לעולם". זה מאפשר ל-TypeScript לדעת בדיוק אילו ערכים מותרים.

**קבצים לעדכן:** `app/dashboard/new/page.tsx`, `app/dashboard/edit/[id]/page.tsx`, `components/programs/ProgramFilters.tsx`

---

### משימה 16: יצירת Custom Hook `useAuth`

**למה?**  
הקוד הבא חוזר על עצמו בכל דף בדשבורד:
```typescript
useEffect(() => {
  const producerId = localStorage.getItem('producerId');
  if (!producerId) { router.push('/login'); return; }
  // ...
}, []);
```

**מה לעשות:**

ליצור `hooks/useAuth.ts`:
```typescript
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [producerId, setProducerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('producerId');
    if (!id) {
      router.push('/login');
    } else {
      setProducerId(id);
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('producerId');
    router.push('/login');
  };

  return { producerId, loading, logout };
}
```

**שימוש:**
```typescript
// במקום 15 שורות של useEffect + localStorage + router:
const { producerId, loading, logout } = useAuth();

if (loading) return <div>טוען...</div>;
```

**קבצים לעדכן:** `app/dashboard/page.tsx`, `app/dashboard/new/page.tsx`, `app/dashboard/edit/[id]/page.tsx`

---

### משימה 17: תיקון `any` types

**למה?**  
שימוש ב-`any` מבטל את כל היתרונות של TypeScript - לא תקבלי התרעות על טעויות.

**מה לתקן:**

| קובץ | שורה | שינוי |
|------|------|-------|
| `app/dashboard/new/page.tsx` | `handleChange` | `(e: any)` → `(e: React.ChangeEvent<HTMLInputElement \| HTMLSelectElement \| HTMLTextAreaElement>)` |
| `app/dashboard/edit/[id]/page.tsx` | `handleChange` | אותו שינוי |
| `app/api/programs/route.ts` | `where` | `const where: any = {}` → `const where: Prisma.ProgramWhereInput = {}` (לייבא `Prisma` מ-`@prisma/client`) |

---

### משימה 18: סנכרון Types עם Schema

**למה?**  
ה-Types ב-TypeScript לא תואמים למה שיש ב-DB, וזה יגרום לבלבול ובאגים.

**מה חסר ב-`types/program.ts`:**

| Interface | שדה חסר | הסבר |
|-----------|---------|------|
| `DashboardProgram` | `status` | הוספנו במשימה 1 |
| `Program` | `status` | הוספנו במשימה 1 |
| `DashboardProgram` | `duration` | קיים ב-schema אבל לא ב-type (מסומן כ-optional `?` אבל צריך להיות חובה) |

---

### משימה 19: מחיקת Dead Code

**למה?**  
קוד שלא בשימוש מבלבל - "למה זה כאן? מישהו משתמש בזה?"

**מה למחוק:**

בקובץ `lib/auth.ts` - הפונקציות `setAuth()` ו-`clearAuth()` לא בשימוש באף מקום בפרויקט. הקוד משתמש ישירות ב-`localStorage.setItem` ו-`localStorage.removeItem`.

**אפשרות א':** למחוק אותן  
**אפשרות ב' (עדיפה):** להשתמש בהן במקום הקריאות הישירות ל-localStorage (זה בעצם מה שנעשה במשימה 16 עם useAuth)

---

### משימה 20: תיקון PrismaClient כפול

**למה?**  
בקובץ `app/api/test/route.ts` יש `new PrismaClient()` - זה יוצר **חיבור חדש** ל-DB בכל בקשה, במקום להשתמש ב-singleton שכבר קיים ב-`lib/prisma.ts`.

**מה זה Singleton?**  
דפוס שמוודא שיש רק **מופע אחד** של משהו. במקרה שלנו, רק חיבור אחד ל-DB.

**הבעיה:**
```typescript
// app/api/test/route.ts:
const prisma = new PrismaClient();   // ← חיבור חדש בכל פעם!
```

**הפתרון:**
```typescript
import { prisma } from '@/lib/prisma';   // ← שימוש ב-singleton הקיים
```

---

### משימה 21: שיפור שמות משתנים

**למה?**  
שמות לא ברורים מקשים על קריאת הקוד.

| קובץ | עכשיו | שם טוב יותר | למה |
|------|--------|-------------|-----|
| `app/api/auth/route.ts` | `isValid` | `isPasswordValid` | מה valid? הסיסמה |
| `app/programs/page.tsx` | `selected` | `selectedProgram` | מה נבחר? תוכנית |
| `app/programs/page.tsx` | `.then(r => r.json())` | `.then(response => response.json())` | `r` לא אומר כלום |

---

## 🟢 P3 - המלצות לעתיד

> אלה שיפורים ש**לא דחופים** אבל יעלו את הרמה של הפרויקט.

---

### משימה 22: פיצול טפסים ארוכים

דפי `dashboard/new/page.tsx` ו-`dashboard/edit/[id]/page.tsx` כוללים **גם** לוגיקה (state, submit, validation) **וגם** UI (הטופס עצמו) - מעל 200 שורות בכל דף.

**עיקרון:** כל קובץ עושה דבר אחד (Single Responsibility Principle).

**פתרון עתידי:** לפצל ל:
- `hooks/useProgramForm.ts` - הלוגיקה
- `components/forms/ProgramForm.tsx` - ה-UI

---

### משימה 23: Dark Mode

ב-`globals.css` יש הגדרות dark mode אבל הקומפוננטים לא תומכים. שיפור עתידי לחוויית משתמש.

---

### משימה 24: Pagination

כרגע הקטלוג הציבורי טוען את **כל** התוכניות בבת אחת. עם מאות תוכניות, הביצועים ייפגעו.

**פתרון עתידי:** להציג 20 תוכניות בכל פעם עם כפתור "הצג עוד" או עמודים.

---

### משימה 25: Loading States ו-Optimistic Updates

לשפר את חוויית המשתמש עם אנימציות טעינה (skeleton loading) ועדכונים "אופטימיים" (להראות שינוי מיידי לפני שהשרת מאשר).

---

### משימה 26: עדכון Seed

ה-seed (`prisma/seed.ts`) יוצר מפיקה אחת בלבד. כדאי לעדכן אותו עם:
- מפיקות מרובות
- תוכניות בסטטוסים שונים (created/paid)
- מנהלת ברירת מחדל
- נתוני דוגמה מגוונים

---

## 📐 סדר עבודה מומלץ

```
שבוע 1-2:  משימות 1 → 2 → 3 → 4 → 5 → 6
           (בניית כל הפונקציונליות החסרה)

שבוע 3:    משימות 8 → 12 → 10 → 9
           (אבטחה ויציבות בסיסית)

שבוע 4:    משימות 7 → 11 → 14 → 13
           (אבטחה מתקדמת + UI)

בהמשך:     משימות 15-21 (איכות קוד)
           משימות 22-26 (שיפורים)
```

> **טיפ חשוב:** אל תנסי לעשות הכל בבת אחת. תעבדי על משימה אחת, תוודאי שהיא עובדת, ואז תעברי לבאה.

---

## 📚 מילון מושגים

| מושג | הסבר |
|------|------|
| **API Route** | קובץ שרץ בצד השרת ומטפל בבקשות HTTP (GET, POST, PUT, DELETE) |
| **Authentication** | אימות זהות - "מי את?" (שם משתמש + סיסמה) |
| **Authorization** | בדיקת הרשאות - "מה מותר לך?" |
| **bcrypt** | ספרייה להצפנת סיסמאות. הופכת "123456" ל-"$2b$10$abc..." שאי אפשר לפענח |
| **CRUD** | Create, Read, Update, Delete - ארבע הפעולות הבסיסיות על נתונים |
| **Cookie (httpOnly)** | קובץ קטן שהשרת שומר בדפדפן. httpOnly = JavaScript לא יכול לגעת בו |
| **Custom Hook** | פונקציית React שמתחילה ב-`use` ומשתפת לוגיקה בין קומפוננטים |
| **Dead Code** | קוד שקיים אבל לא נמצא בשימוש |
| **JWT** | JSON Web Token - "כרטיס כניסה" מוצפן שמכיל מידע על המשתמש |
| **localStorage** | אחסון בדפדפן. כל JavaScript יכול לגשת אליו - **לא בטוח** לאימות! |
| **Middleware** | קוד שרץ לפני כל בקשה - כמו שומר בכניסה |
| **ORM** | Object-Relational Mapping - "מתרגם" בין קוד לבין מסד נתונים |
| **Prisma** | ה-ORM שהפרויקט משתמש בו |
| **Rate Limiting** | הגבלת מספר בקשות בפרק זמן - מונע brute force |
| **Schema** | הגדרת המבנה של מסד הנתונים (אילו טבלאות ושדות יש) |
| **Seed** | סקריפט שממלא את ה-DB בנתוני דוגמה - שימושי לפיתוח ובדיקות |
| **Singleton** | דפוס שמוודא שיש רק מופע אחד של משהו (כמו חיבור ל-DB) |
| **try/catch** | מבנה שתופס שגיאות ומונע קריסה. ה-try מנסה, ה-catch תופס אם נכשל |
| **Type** | הגדרה ב-TypeScript שמתארת את המבנה של אובייקט |
| **Validation** | בדיקה שנתונים תקינים לפני עיבוד (מייל תקין? סיסמה מספיק ארוכה?) |
| **Zod** | ספריית validation - בודקת שנתונים תואמים למבנה שהגדרת |
