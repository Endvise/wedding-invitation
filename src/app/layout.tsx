import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jae-hyun & Sun-mi 결혼합니다",
  description: "2025년 5월 17일 토요일 오후 1시, 김해산정에서 결혼식을 거행합니다.",
  openGraph: {
    title: "Jae-hyun & Sun-mi 결혼합니다",
    description: "2025년 5월 17일 토요일 오후 1시",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
