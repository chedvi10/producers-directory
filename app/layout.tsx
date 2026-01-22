import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מדריך תוכניות",
  description: "כל מה שאת צריכה לארוע שלך במקום אחד",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
