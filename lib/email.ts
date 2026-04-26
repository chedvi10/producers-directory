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

export async function sendProgramPendingEmail(producerEmail: string, producerName: string, programTitle: string) {
  try {
    await transporter.sendMail({
      from: `"מדריך תוכניות" <${process.env.SMTP_USER}>`,
      to: producerEmail,
      subject: '⏳ התוכנית שלך ממתינה לאישור',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #f97316; margin-bottom: 20px;">שלום ${producerName}! 👋</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              התוכנית שלך <strong>"${programTitle}"</strong> נקלטה במערכת בהצלחה!
            </p>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                ⏳ התוכנית ממתינה לאישור המנהלת. ברגע שתאושר, היא תופיע לרכזות באלפון.
              </p>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              תודה שבחרת במדריך תוכניות! 💙
            </p>
          </div>
        </div>
      `
    });
    console.log('✅ מייל נשלח בהצלחה ל:', producerEmail);
  } catch (error) {
    console.error('❌ שגיאה בשליחת מייל:', error);
  }
}

export async function sendProgramApprovedEmail(producerEmail: string, producerName: string, programTitle: string) {
  try {
    await transporter.sendMail({
      from: `"מדריך תוכניות" <${process.env.SMTP_USER}>`,
      to: producerEmail,
      subject: '✅ התוכנית שלך אושרה!',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #10b981; margin-bottom: 20px;">מזל טוב ${producerName}! 🎉</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              התוכנית שלך <strong>"${programTitle}"</strong> אושרה על ידי המנהלת!
            </p>
            <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46;">
                ✅ התוכנית שלך כעת מוצגת לכל הרכזות באלפון ומוכנה לקבל פניות!
              </p>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              בהצלחה רבה! 💙
            </p>
          </div>
        </div>
      `
    });
    console.log('✅ מייל אישור נשלח בהצלחה ל:', producerEmail);
  } catch (error) {
    console.error('❌ שגיאה בשליחת מייל:', error);
  }
}

export async function sendProgramRejectedEmail(producerEmail: string, producerName: string, programTitle: string) {
  try {
    await transporter.sendMail({
      from: `"מדריך תוכניות" <${process.env.SMTP_USER}>`,
      to: producerEmail,
      subject: '❌ התוכנית שלך נדחתה',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #ef4444; margin-bottom: 20px;">שלום ${producerName},</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              לצערנו, התוכנית <strong>"${programTitle}"</strong> לא אושרה על ידי המנהלת.
            </p>
            <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #ef4444;">
              <p style="margin: 0; color: #991b1b;">
                ❌ אנא ערכי את התוכנית ושלחי שוב לאישור.
              </p>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              נשמח לעזור! צרי קשר במידת הצורך.
            </p>
          </div>
        </div>
      `
    });
    console.log('✅ מייל דחייה נשלח בהצלחה ל:', producerEmail);
  } catch (error) {
    console.error('❌ שגיאה בשליחת מייל:', error);
  }
}
