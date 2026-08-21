# Use Case Diagram

```mermaid
flowchart LR
    producer["מפיקה"]
    coordinator["רכזת"]
    admin["מנהל מערכת"]

    subgraph system["מערכת מדריך תוכניות"]
        ucRegister(("רישום"))
        ucLogin(("התחברות"))
        ucAddProgram(("הוספת תוכנית"))
        ucEditProgram(("עריכת תוכנית"))
        ucDeleteProgram(("מחיקת תוכנית"))
        ucSearchProgram(("חיפוש תוכנית"))
        ucFilterPrograms(("סינון תוכניות"))
        ucViewProgramDetails(("צפייה בפרטי תוכנית"))
        ucApproveProgram(("אישור תוכנית"))
        ucRejectProgram(("דחיית תוכנית"))
        ucDeleteApprovedProgram(("מחיקת תוכנית"))
    end

    producer --> ucRegister
    producer --> ucLogin
    producer --> ucAddProgram
    producer --> ucEditProgram
    producer --> ucDeleteProgram

    coordinator --> ucSearchProgram
    coordinator --> ucFilterPrograms
    coordinator --> ucViewProgramDetails

    admin --> ucApproveProgram
    admin --> ucRejectProgram
    admin --> ucDeleteApprovedProgram
```

## גרסה מקוצרת לכיתוב מתחת לתרשים

התרשים מציג את שלושת סוגי המשתמשים המרכזיים במערכת: מפיקה, רכזת ומנהל מערכת, ואת הפעולות העיקריות שכל אחד מהם מבצע. עבור המפיקה מוצגות פעולות של רישום, התחברות, הוספה, עריכה ומחיקה של תוכניות. עבור הרכזת מוצגות פעולות של חיפוש, סינון וצפייה בפרטי תוכנית. עבור מנהל המערכת מוצגות פעולות של אישור, דחייה ומחיקה של תוכניות.

## איך להשתמש בזה ב-Word

1. לפתוח את הקובץ ב-VS Code.
2. להציג את תרשים ה-Mermaid.
3. לצלם את התרשים ולהדביק למסמך Word.
4. מתחת לתמונה להוסיף את פסקת ההסבר הקצרה שמופיעה כאן.