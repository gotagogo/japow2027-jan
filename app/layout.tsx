import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "2027 東北滑雪泡湯打卡遊",
  description: "2027 年 1 月 8–22 日，盛岡到青森，13 個雪場、14 晚的單板自駕旅程。",
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: { title: "2027 東北滑雪泡湯打卡遊", description: "盛岡 ⇄ 青森 · 13 雪場 · 14 晚", images: [`${basePath}/assets/tohoku-hero.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
