import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מדריך תוכניות",
  description: "כל מה שאת צריכה לארוע שלך במקום אחד",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239333ea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m9 11 3 3 8-8'/><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>",
  },
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
