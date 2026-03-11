"use client";

import { useEffect, useState } from "react";
import { weddingConfig, formatDate, formatTime } from "@/lib/config";

interface Comment {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [guestbookName, setGuestbookName] = useState("");
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [guestbookPassword, setGuestbookPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setMounted(true);
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
    fetchComments();
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookMessage || !guestbookPassword) {
      showToast("모든 항목을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestbookName,
          message: guestbookMessage,
          password: guestbookPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("방명록이 등록되었습니다!");
        setGuestbookName("");
        setGuestbookMessage("");
        setGuestbookPassword("");
        fetchComments();
      } else {
        showToast(data.error || "등록 실패");
      }
    } catch (error) {
      showToast("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#f5f0eb]"></div>;

  const { groom, bride, wedding, directions } = weddingConfig;

  return (
    <main className="w-full">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#3d3229] text-white px-6 py-3 rounded-lg z-50 text-sm">
          {toast}
        </div>
      )}
      <div className="scroll-indicator">
        <span></span>
      </div>

      {/* 1페이지: 커버 */}
      <section id="section1" className="section min-h-screen flex flex-col items-center justify-center text-center p-8" style={{background: "linear-gradient(135deg, #f5f0eb 0%, #e8e3dc 100%)"}}>
        <div className="max-w-md">
          <p className="text-sm tracking-[0.3em] text-[#6b5f52] mb-4">WEDDING INVITATION</p>
          <h1 className="text-5xl font-light text-[#3d3229] mb-6">{groom.name} & {bride.name}</h1>
          <p className="text-lg text-[#6b5f52] mb-8 leading-relaxed">
            {groom.father}, {groom.mother}의 아들 {groom.name}과<br />
            {bride.mother}의 딸 {bride.name} 결혼합니다
          </p>
          <div className="text-[#6b5f52]">
            <p className="text-xl mb-2">{formatDate(wedding.date)} {formatTime(wedding.time)}</p>
            <p className="text-base">{wedding.place}</p>
          </div>
        </div>
      </section>

      {/* 2페이지: 초대 */}
      <section id="section2" className="section min-h-screen flex flex-col items-center justify-center p-8" style={{background: "#faf8f5"}}>
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <p className="text-4xl font-light text-[#3d3229] mb-4">초대합니다</p>
            <p className="text-base text-[#6b5f52] leading-relaxed">
              같이 있으면 편안하고, 재밌습니다.<br />
              부족한 부분 서로 의지하고 잘하는 부분 밀어주며<br />
              살겠습니다.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-medium text-[#3d3229] mb-4 text-center">Wedding Day</h3>
            <div className="space-y-3 text-[#6b5f52]">
              <div className="flex justify-between"><span>일시</span><span>{formatDate(wedding.date)} {formatTime(wedding.time)}</span></div>
              <div className="flex justify-between"><span>장소</span><span>{wedding.place}</span></div>
              <div className="flex justify-between"><span>주소</span><span>{wedding.address}</span></div>
              <div className="flex justify-between"><span>연락처</span><a href={`tel:${wedding.phone}`} className="text-[#857b5c]">{wedding.phone}</a></div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-[#3d3229] mb-4 text-center">마음 전할 곳</h3>
            <AccountButton bank={groom.account.bank} account={groom.account.number} holder={groom.account.holder} />
            <AccountButton bank={bride.account.bank} account={bride.account.number} holder={bride.account.holder} />
            <AccountButton bank={bride.parentAccount.bank} account={bride.parentAccount.number} holder={bride.parentAccount.holder} />
          </div>
        </div>
      </section>

      {/* 3페이지: 갤러리 + 방명록 */}
      <section id="section3" className="section min-h-screen flex flex-col items-center justify-center p-8" style={{background: "linear-gradient(135deg, #f5f0eb 0%, #e8e3dc 100%)"}}>
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-light text-center text-[#3d3229] mb-8">Our Gallery</h2>
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square bg-[#e8e3dc] rounded-lg flex items-center justify-center">
                <span className="text-[#9a8b7c] text-sm">Photo {i}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-[#3d3229] mb-4 text-center">방명록</h3>
            <form onSubmit={handleGuestbookSubmit} className="space-y-3 mb-6">
              <input type="text" placeholder="이름" value={guestbookName} onChange={(e) => setGuestbookName(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#857b5c]" />
              <textarea placeholder="축하 메시지를 남겨주세요" value={guestbookMessage} onChange={(e) => setGuestbookMessage(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#857b5c] resize-none" />
              <input type="password" placeholder="비밀번호 (삭제 시 필요)" value={guestbookPassword} onChange={(e) => setGuestbookPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#857b5c]" />
              <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-[#857b5c] text-white rounded-lg text-sm disabled:opacity-50">
                {isSubmitting ? "등록 중..." : "방명록 남기기"}
              </button>
            </form>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-[#9a8b7c] text-sm py-4">아직 방명록이 없습니다.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-[#3d3229] text-sm">{comment.name}</p>
                    <p className="text-[#6b5f52] text-sm mt-1">{comment.message}</p>
                    <p className="text-[#9a8b7c] text-xs mt-2">{new Date(comment.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4페이지: 연락처 & 오시는 길 */}
      <section id="section4" className="section min-h-screen flex flex-col items-center justify-center p-8" style={{background: "#faf8f5"}}>
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-light text-center text-[#3d3229] mb-8">Contact & Location</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#9a8b7c] mb-2">신랑측</p>
              <p className="text-[#3d3229] font-medium">{groom.name}</p>
              <p className="text-sm text-[#6b5f52]">{groom.father}, {groom.mother}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-[#9a8b7c] mb-2">신부측</p>
              <p className="text-[#3d3229] font-medium">{bride.name}</p>
              <p className="text-sm text-[#6b5f52]">{bride.mother}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-medium text-[#3d3229] mb-4">오시는 길</h3>
            <div className="space-y-4 text-[#6b5f52]">
              <div><p className="text-sm font-medium mb-1">지하철</p><p className="text-sm">{directions.subway}</p></div>
              <div><p className="text-sm font-medium mb-1">자가용</p><p className="text-sm">"{directions.navi}"으로 검색</p></div>
              <a href={`https://map.kakao.com/link/search/${encodeURIComponent(wedding.address)}`} target="_blank" rel="noopener noreferrer" className="block text-center py-3 bg-[#857b5c] text-white rounded-lg mt-4">지도 보기</a>
            </div>
          </div>
          <button onClick={() => {navigator.clipboard.writeText(window.location.href); showToast("링크가 복사되었습니다!");}} className="w-full py-3 mt-6 border border-[#857b5c] text-[#857b5c] rounded-lg">
            청첩장 공유하기
          </button>
        </div>
      </section>
    </main>
  );
}

function AccountButton({ bank, account, holder }: { bank: string; account: string; holder: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`${bank} ${account} ${holder}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-left">
        <p className="text-sm text-[#9a8b7c]">{bank}</p>
        <p className="text-[#3d3229] font-medium">{account}</p>
        <p className="text-xs text-[#6b5f52]">{holder}</p>
      </div>
      <span className={`text-sm ${copied ? "text-green-600" : "text-[#857b5c]"}`}>{copied ? "복사됨" : "복사"}</span>
    </button>
  );
}
