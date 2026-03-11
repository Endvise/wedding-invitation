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
      { threshold: 0.1 }
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
      if (data.comments) setComments(data.comments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({ name: guestbookName, message: guestbookMessage, password: guestbookPassword }),
      });
      if (res.ok) {
        showToast("방명록이 등록되었습니다!");
        setGuestbookName("");
        setGuestbookMessage("");
        setGuestbookPassword("");
        fetchComments();
      }
    } catch (error) {
      showToast("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div style={{minHeight:"100vh",background:"#f5f0eb",padding:"50px",textAlign:"center"}}>Loading...</div>;

  const { groom, bride, wedding, directions } = weddingConfig;

  return (
    <main>
      {toast && <div style={styles.toast}>{toast}</div>}
      <div style={styles.scrollIndicator}><span></span></div>

      <section id="s1" className="section" style={Object.assign({}, styles.page, {backgroundImage:"url(/images/page1.jpg)"})}>
        <div style={styles.contentBox}>
          <p style={styles.titleSmall}>WEDDING INVITATION</p>
          <h1 style={styles.title}>{groom.name} & {bride.name}</h1>
          <p style={styles.subtitle}>{groom.father}, {groom.mother}의 아들 {groom.name}과<br/>{bride.mother}의 딸 {bride.name} 결혼합니다</p>
          <div style={styles.info}>
            <p>{formatDate(wedding.date)} {formatTime(wedding.time)}</p>
            <p>{wedding.place}</p>
          </div>
        </div>
      </section>

      <section id="s2" className="section" style={Object.assign({}, styles.page, {backgroundImage:"url(/images/page2.jpg)"})}>
        <div style={styles.contentBox}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Wedding Day</h3>
            <div style={styles.infoList}>
              <div><span>일시</span><span>{formatDate(wedding.date)} {formatTime(wedding.time)}</span></div>
              <div><span>장소</span><span>{wedding.place}</span></div>
              <div><span>주소</span><span>{wedding.address}</span></div>
              <div><span>연락처</span><a href={`tel:${wedding.phone}`} style={styles.link}>{wedding.phone}</a></div>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>마음 전할 곳</h3>
            <AccountBtn b={groom.account.bank} a={groom.account.number} h={groom.account.holder} />
            <AccountBtn b={bride.account.bank} a={bride.account.number} h={bride.account.holder} />
            <AccountBtn b={bride.parentAccount.bank} a={bride.parentAccount.number} h={bride.parentAccount.holder} />
          </div>
        </div>
      </section>

      <section id="s3" className="section" style={Object.assign({}, styles.page, {backgroundImage:"url(/images/page3.jpg)"})}>
        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Our Gallery</h2>
          <div style={styles.gallery}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={styles.galleryItem}><span>Photo {i}</span></div>)}
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>방명록</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input type="text" placeholder="이름" value={guestbookName} onChange={e=>setGuestbookName(e.target.value)} style={styles.input}/>
              <textarea placeholder="축하 메시지" value={guestbookMessage} onChange={e=>setGuestbookMessage(e.target.value)} rows={3} style={styles.input}/>
              <input type="password" placeholder="비밀번호" value={guestbookPassword} onChange={e=>setGuestbookPassword(e.target.value)} style={styles.input}/>
              <button type="submit" disabled={isSubmitting} style={styles.btn}>{isSubmitting?"등록중":"방명록 남기기"}</button>
            </form>
            <div style={styles.commentList}>
              {comments.length===0?<p style={styles.noComment}>아직 방명록이 없습니다.</p>:
              comments.map(c => (
                <div key={c.id} style={styles.comment}>
                  <p style={styles.commentName}>{c.name}</p>
                  <p style={styles.commentMsg}>{c.message}</p>
                  <p style={styles.commentDate}>{new Date(c.created_at).toLocaleDateString("ko-KR")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="s4" className="section" style={Object.assign({}, styles.page, {backgroundImage:"url(/images/page4.jpg)"})}>
        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Contact & Location</h2>
          <div style={styles.card}>
            <p style={styles.label}>신랑측</p>
            <p style={styles.name}>{groom.name}</p>
            <p style={styles.parents}>{groom.father}, {groom.mother}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.label}>신부측</p>
            <p style={styles.name}>{bride.name}</p>
            <p style={styles.parents}>{bride.mother}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>오시는 길</h3>
            <p style={styles.label}>지하철</p><p>{directions.subway}</p>
            <p style={styles.label}>자가용</p><p>"{directions.navi}"으로 검색</p>
            <a href={`https://map.kakao.com/link/search/${wedding.address}`} target="_blank" style={styles.mapBtn}>지도 보기</a>
          </div>
          <button onClick={()=>{navigator.clipboard.writeText(window.location.href);showToast("링크 복사됨");}} style={styles.shareBtn}>청첩장 공유하기</button>
        </div>
      </section>

      <style>{`
        .section{opacity:0;transform:translateY(30px);transition:all 0.8s}.section.visible{opacity:1;transform:translateY(0)}
        @keyframes bounce{0%,20%,50%,80%,100%{transform:translateX(-50%)translateY(0)}40%{transform:translateX(-50%)translateY(-10px)}60%{transform:translateX(-50%)translateY(-5px)}}
      `}</style>
    </main>
  );
}

function AccountBtn({b,a,h}:{b:string,a:string,h:string}){
  const[copied,setCopied]=useState(false);
  const copy=()=>{navigator.clipboard.writeText(`${b} ${a} ${h}`);setCopied(true);setTimeout(()=>setCopied(false),2000)};
  return <button onClick={copy} style={styles.accountBtn}><div><p style={styles.bank}>{b}</p><p style={styles.account}>{a}</p><p style={styles.holder}>{h}</p></div><span style={copied?styles.copied:styles.copyText}>{copied?"복사됨":"복사"}</span></button>;
}

const styles:Record<string,React.CSSProperties>={
  toast:{position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",background:"#3d3229",color:"white",padding:"12px 24px",borderRadius:"8px",zIndex:50,fontSize:"14px"},
  scrollIndicator:{position:"fixed",bottom:"30px",left:"50%",transform:"translateX(-50%)",zIndex:100,animation:"bounce 2s infinite",opacity:0.7},
  page:{minHeight:"100vh",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",padding:"40px 20px",display:"flex",justifyContent:"center",alignItems:"center"},
  contentBox:{maxWidth:"420px",width:"100%"},
  titleSmall:{fontSize:"11px",letterSpacing:"0.3em",color:"#fff",marginBottom:"16px",textShadow:"0 1px 3px rgba(0,0,0,0.5)"},
  title:{fontSize:"36px",fontWeight:300,color:"#fff",marginBottom:"24px",textShadow:"0 1px 5px rgba(0,0,0,0.5)"},
  subtitle:{fontSize:"15px",color:"#fff",marginBottom:"32px",lineHeight:1.6,textShadow:"0 1px 3px rgba(0,0,0,0.5)"},
  info:{color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,0.5)",fontSize:"16px"},
  sectionTitle:{fontSize:"22px",fontWeight:300,color:"#fff",marginBottom:"32px",textAlign:"center",textShadow:"0 1px 3px rgba(0,0,0,0.5)"},
  card:{background:"rgba(255,255,255,0.95)",borderRadius:"16px",padding:"20px",marginBottom:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"},
  cardTitle:{fontSize:"16px",fontWeight:500,color:"#3d3229",marginBottom:"16px",textAlign:"center"},
  infoList:{display:"flex",flexDirection:"column",gap:"10px",fontSize:"13px",color:"#6b5f52"},
  link:{color:"#857b5c"},
  form:{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"},
  input:{width:"100%",padding:"10px 12px",border:"1px solid #ddd",borderRadius:"8px",fontSize:"13px",outline:"none"},
  btn:{width:"100%",padding:"10px",background:"#857b5c",color:"white",border:"none",borderRadius:"8px",fontSize:"13px",cursor:"pointer"},
  commentList:{maxHeight:"200px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"10px"},
  comment:{padding:"10px",background:"#f9f9f9",borderRadius:"8px"},
  commentName:{fontWeight:500,fontSize:"13px",color:"#3d3229"},
  commentMsg:{fontSize:"13px",color:"#6b5f52",marginTop:"4px"},
  commentDate:{fontSize:"11px",color:"#9a8b7c",marginTop:"6px"},
  noComment:{textAlign:"center",color:"#9a8b7c",fontSize:"13px",padding:"20px 0"},
  label:{fontSize:"11px",color:"#9a8b7c",marginBottom:"4px"},
  name:{fontSize:"16px",fontWeight:500,color:"#3d3229"},
  parents:{fontSize:"13px",color:"#6b5f52"},
  mapBtn:{display:"block",textAlign:"center",padding:"12px",background:"#857b5c",color:"white",borderRadius:"8px",marginTop:"16px",textDecoration:"none"},
  shareBtn:{width:"100%",padding:"12px",marginTop:"16px",border:"1px solid #857b5c",color:"#857b5c",borderRadius:"8px",background:"transparent",cursor:"pointer"},
  gallery:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px",marginBottom:"24px"},
  galleryItem:{aspectRatio:"1",background:"rgba(255,255,255,0.7)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"},
  accountBtn:{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px",background:"white",border:"none",borderRadius:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",cursor:"pointer",marginBottom:"8px"},
  bank:{fontSize:"11px",color:"#9a8b7c"},
  account:{fontSize:"14px",fontWeight:500,color:"#3d3229"},
  holder:{fontSize:"11px",color:"#6b5f52"},
  copyText:{fontSize:"12px",color:"#857b5c"},
  copied:{fontSize:"12px",color:"green"}
};
