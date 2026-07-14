import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// מיגון תוכן דינמי לפני הטמעה ב-HTML של המייל
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// מעטפת אחידה לכל המיילים: כרטיס לבן ממורכז, RTL, כותרת צבעונית וכיתוב תחתון.
// bodyHtml חייב להיות HTML בטוח - תוכן דינמי עובר escapeHtml לפני שמרכיבים אותו
async function sendTemplatedEmail(options: {
  to: string;
  subject: string;
  headingColor: string;
  heading: string;
  bodyHtml: string;
  footer: string;
}) {
  try {
    await transporter.sendMail({
      from: `"מדריך תוכניות" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: ${options.headingColor}; margin-bottom: 20px;">${options.heading}</h1>
            ${options.bodyHtml}
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              ${options.footer}
            </p>
          </div>
        </div>
      `,
    });
    console.log('✅ מייל נשלח בהצלחה ל:', options.to);
  } catch (error) {
    console.error('❌ שגיאה בשליחת מייל:', error);
  }
}

// תיבת הדגשה צבעונית בגוף המייל
function highlightBox(backgroundColor: string, borderColor: string, textColor: string, contentHtml: string): string {
  return `
    <div style="background-color: ${backgroundColor}; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid ${borderColor};">
      <p style="margin: 0; color: ${textColor};">${contentHtml}</p>
    </div>
  `;
}

export async function sendProgramPendingEmail(producerEmail: string, producerName: string, programTitle: string) {
  await sendTemplatedEmail({
    to: producerEmail,
    subject: '⏳ התוכנית שלך ממתינה לאישור',
    headingColor: '#f97316',
    heading: `שלום ${escapeHtml(producerName)}! 👋`,
    bodyHtml: `
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        התוכנית שלך <strong>"${escapeHtml(programTitle)}"</strong> נקלטה במערכת בהצלחה!
      </p>
      ${highlightBox('#fef3c7', '#f59e0b', '#92400e', '⏳ התוכנית ממתינה לאישור המנהלת. ברגע שתאושר, היא תופיע לרכזות באלפון.')}
    `,
    footer: 'תודה שבחרת במדריך תוכניות! 💙',
  });
}

export async function sendProgramApprovedEmail(producerEmail: string, producerName: string, programTitle: string) {
  await sendTemplatedEmail({
    to: producerEmail,
    subject: '✅ התוכנית שלך אושרה!',
    headingColor: '#10b981',
    heading: `מזל טוב ${escapeHtml(producerName)}! 🎉`,
    bodyHtml: `
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        התוכנית שלך <strong>"${escapeHtml(programTitle)}"</strong> אושרה על ידי המנהלת!
      </p>
      ${highlightBox('#d1fae5', '#10b981', '#065f46', '✅ התוכנית שלך כעת מוצגת לכל הרכזות באלפון ומוכנה לקבל פניות!')}
    `,
    footer: 'בהצלחה רבה! 💙',
  });
}

export async function sendProgramRejectedEmail(producerEmail: string, producerName: string, programTitle: string) {
  await sendTemplatedEmail({
    to: producerEmail,
    subject: '❌ התוכנית שלך נדחתה',
    headingColor: '#ef4444',
    heading: `שלום ${escapeHtml(producerName)},`,
    bodyHtml: `
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        לצערנו, התוכנית <strong>"${escapeHtml(programTitle)}"</strong> לא אושרה על ידי המנהלת.
      </p>
      ${highlightBox('#fee2e2', '#ef4444', '#991b1b', '❌ אנא ערכי את התוכנית ושלחי שוב לאישור.')}
    `,
    footer: 'נשמח לעזור! צרי קשר במידת הצורך.',
  });
}

export async function sendNewInquiryEmail(
  producerEmail: string,
  producerName: string,
  programTitle: string,
  contact: { name: string; phone: string; email?: string | null; institution?: string | null },
  message: string
) {
  await sendTemplatedEmail({
    to: producerEmail,
    subject: '📩 קיבלת פנייה חדשה!',
    headingColor: '#8b5cf6',
    heading: `שלום ${escapeHtml(producerName)}! 👋`,
    bodyHtml: `
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        קיבלת פנייה חדשה בנוגע לתוכנית <strong>"${escapeHtml(programTitle)}"</strong>:
      </p>
      <div style="background-color: #f5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #8b5cf6;">
        <p style="margin: 0; color: #4c1d95; white-space: pre-line;">${escapeHtml(message)}</p>
      </div>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #374151;"><strong>שם:</strong> ${escapeHtml(contact.name)}</p>
        ${contact.institution ? `<p style="margin: 5px 0 0 0; color: #374151;"><strong>מוסד:</strong> ${escapeHtml(contact.institution)}</p>` : ''}
        <p style="margin: 5px 0 0 0; color: #374151;"><strong>טלפון:</strong> ${escapeHtml(contact.phone)}</p>
        ${contact.email ? `<p style="margin: 5px 0 0 0; color: #374151;"><strong>אימייל:</strong> ${escapeHtml(contact.email)}</p>` : ''}
      </div>
    `,
    footer: 'את כל הפניות אפשר לראות באזור האישי שלך. בהצלחה! 💙',
  });
}
