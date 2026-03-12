import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이재현 ♥ 이선미 결혼합니다",
  description: "2025년 5월 17일 토요일 오후 1시, 김해산정에서 결혼식을 거행합니다.",
  openGraph: {
    title: "이재현 ♥ 이선미 결혼합니다",
    description: "2025년 5월 17일 토요일 오후 1시",
    type: "website",
    images:
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "이재현 ♥ 이선미 결혼합니다",
      },
    ],
    url: "https://wedding-invitation-tan-iota.vercel.app",
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
