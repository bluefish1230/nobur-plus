import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "700", "900"]
});

export const metadata: Metadata = {
  title: "Nobur Plus",
  description: "AI 梗圖與文章分享站"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${noto.variable} font-sans`} data-theme="gojo">
        {children}
      </body>
    </html>
  );
}
