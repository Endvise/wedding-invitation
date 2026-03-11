"use client";

import { useEffect, useState } from "react";
import { weddingConfig, formatDate, formatTime } from "@/lib/config";

// 4페이지 청첩장 메인 컴포넌트
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 스크롤 애니메이션
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const { groom, bride, wedding, directions } = weddingConfig;

  return (
    <main className="w-full">
      {/* 스크롤 인디케이터 */}
      <div className="scroll-indicator">
        <span></span>
      </div>

      {/* 1페이지: 커버 */}
      <section
        id="section1"
        className="section min-h-screen flex flex-col items-center justify-center text-center p-8"
        style={{
          backgroundImage: "url('/images/page1-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#f5f0eb",
        }}
      >
        <div className="max-w-md">
          <p className="text-sm tracking-[0.3em] text-[var(--text-secondary)] mb-4">
            WEDDING INVITATION
          </p>
          <h1 className="text-4xl font-light text-[var(--text-primary)] mb-6">
            {groom.name} & {bride.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
            이현배, {groom.mother}의 아들 {groom.name}과<br />
            {bride.mother}의 딸 {bride.name} 결혼합니다
          </p>
          <div className="text-[var(--text-secondary)]">
            <p className="text-xl mb-2">
              {formatDate(wedding.date)} {formatTime(wedding.time)}
            </p>
            <p className="text-base">{wedding.place}</p>
          </div>
        </div>
      </section>

      {/* 2페이지: 초대 */}
      <section
        id="section2"
        className="section min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#faf8f5" }}
      >
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <p className="text-3xl font-light text-[var(--text-primary)] mb-4">
              초대합니다
            </p>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              같이 있으면 편안하고, 재밌습니다.<br />
              부족한 부분 서로 의지하고 잘하는 부분 밀어주며<br />
              살겠습니다.
            </p>
          </div>

          {/* 결혼식 정보 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 text-center">
              Wedding Day
            </h3>
            <div className="space-y-3 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>일시</span>
                <span>{formatDate(wedding.date)} {formatTime(wedding.time)}</span>
              </div>
              <div className="flex justify-between">
                <span>장소</span>
                <span>{wedding.place}</span>
              </div>
              <div className="flex justify-between">
                <span>주소</span>
                <span>{wedding.address}</span>
              </div>
              <div className="flex justify-between">
                <span>연락처</span>
                <a href={`tel:${wedding.phone}`} className="text-[var(--primary)]">
                  {wedding.phone}
                </a>
              </div>
            </div>
          </div>

          {/* 계좌번호 */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 text-center">
              마음 전할 곳
            </h3>
            <AccountButton
              bank={groom.account.bank}
              account={groom.account.number}
              holder={groom.account.holder}
            />
            <AccountButton
              bank={bride.account.bank}
              account={bride.account.number}
              holder={bride.account.holder}
            />
            <AccountButton
              bank={bride.parentAccount.bank}
              account={bride.parentAccount.number}
              holder={bride.parentAccount.holder}
            />
          </div>
        </div>
      </section>

      {/* 3페이지: 갤러리 */}
      <section
        id="section3"
        className="section min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#f5f0eb" }}
      >
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-light text-center text-[var(--text-primary)] mb-8">
            Our Gallery
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={`/gallery/photo${i}.jpg`}
                  alt={`Wedding photo ${i}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-center text-[var(--text-muted)] text-sm mt-6">
            wedding photos will be added soon
          </p>
        </div>
      </section>

      {/* 4페이지: 연락처 & 오시는 길 */}
      <section
        id="section4"
        className="section min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#faf8f5" }}
      >
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-light text-center text-[var(--text-primary)] mb-8">
            Contact & Location
          </h2>

          {/* 연락처 */}
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[var(--text-muted)] mb-2">신랑측</p>
              <p className="text-[var(--text-primary)] font-medium">{groom.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {groom.father}, {groom.mother}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[var(--text-muted)] mb-2">신부측</p>
              <p className="text-[var(--text-primary)] font-medium">{bride.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{bride.mother}</p>
            </div>
          </div>

          {/* 오시는 길 */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              오시는 길
            </h3>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <div>
                <p className="text-sm font-medium mb-1">지하철</p>
                <p className="text-sm">{directions.subway}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">자가용</p>
                <p className="text-sm">&quot;{directions.navi}&quot;으로 검색</p>
              </div>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(wedding.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 bg-[var(--primary)] text-white rounded-lg mt-4"
              >
                지도 보기
              </a>
            </div>
          </div>

          {/* 공유 버튼 */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("링크가 복사되었습니다!");
            }}
            className="w-full py-3 mt-6 border border-[var(--primary)] text-[var(--primary)] rounded-lg"
          >
            청첩장 공유하기
          </button>
        </div>
      </section>
    </main>
  );
}

// 계좌번호 복사 버튼 컴포넌트
function AccountButton({
  bank,
  account,
  holder,
}: {
  bank: string;
  account: string;
  holder: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${bank} ${account} ${holder}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-left">
        <p className="text-sm text-[var(--text-muted)]">{bank}</p>
        <p className="text-[var(--text-primary)] font-medium">{account}</p>
        <p className="text-xs text-[var(--text-secondary)]">{holder}</p>
      </div>
      <span className={`text-sm ${copied ? "text-green-600" : "text-[var(--primary)]"}`}>
        {copied ? "복사됨" : "복사"}
      </span>
    </button>
  );
}
