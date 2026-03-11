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
    fetchComments();
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookMessage || !guestbookPassword) { showToast("모든 항목을 입력해주세요."); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: guestbookName, message: guestbookMessage, password: guestbookPassword }) });
      if (res.ok) { showToast("방명록이 등록되었습니다!"); setGuestbookName(""); setGuestbookMessage(""); setGuestbookPassword(""); fetchComments(); }
    } catch (e) { showToast("오류가 발생했습니다."); }
    finally { setIsSubmitting(false); }
  };

  if (!mounted) return <div style={S.loading}>Loading...</div>;

  const { groom, bride, wedding, directions } = weddingConfig;

  return (
    <main>
      {toast && <div style={S.toast}>{toast}</div>}
      
      {/* PAGE 1 */}
      <div style={S.page}>
        <img src="/images/page1.jpg" style={S.bgImg} alt="bg1"/>
        <div style={S.overlay}>
          <p style={S.titleSmall}>WEDDING INVITATION</p>
          <h1 style={S.title}>{groom.name} & {bride.name}</h1>
          <p style={S.subtitle}>{groom.father}, {groom.mother}의 아들 {groom.name}과<br/>{bride.mother}의 딸 {bride.name} 결혼합니다</p>
          <p style={S.info}>{formatDate(wedding.date)} {formatTime(wedding.time)}</p>
          <p style={S.info}>{wedding.place}</p>
        </div>
      </div>

      {/* PAGE 2 */}
      <div style={S.page}>
        <img src="/images/page2.jpg" style={S.bgImg} alt="bg2"/>
        <div style={S.overlay}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>Wedding Day</h3>
            <div style={S.row}><span>일시</span><span>{formatDate(wedding.date)} {formatTime(wedding.time)}</span></div>
            <div style={S.row}><span>장소</span><span>{wedding.place}</span></div>
            <div style={S.row}><span>주소</span><span>{wedding.address}</span></div>
            <div style={S.row}><span>연락처</span><a href={`tel:${wedding.phone}`} style={S.link}>{wedding.phone}</a></div>
          </div>
          <div style={S.card}>
            <h3 style={S.cardTitle}>마음 전할 곳</h3>
            <CopyBtn b={groom.account.bank} a={groom.account.number} h={groom.account.holder}/>
            <CopyBtn b={bride.account.bank} a={bride.account.number} h={bride.account.holder}/>
            <CopyBtn b={bride.parentAccount.bank} a={bride.parentAccount.number} h={bride.parentAccount.holder}/>
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div style={S.page}>
        <img src="/images/page3.jpg" style={S.bgImg} alt="bg3"/>
        <div style={S.overlay}>
          <h2 style={S.sectionTitle}>Our Gallery</h2>
          <div style={S.galleryGrid}>{[1,2,3,4,5,6].map(i => <div key={i} style={S.galleryItem}><span>Photo {i}</span></div>)}</div>
          <div style={S.card}>
            <h3 style={S.cardTitle}>방명록</h3>
            <form onSubmit={handleSubmit} style={S.form}>
              <input type="text" placeholder="이름" value={guestbookName} onChange={e=>setGuestbookName(e.target.value)} style={S.input}/>
              <textarea placeholder="축하 메시지" value={guestbookMessage} onChange={e=>setGuestbookMessage(e.target.value)} rows={2} style={S.input}/>
              <input type="password" placeholder="비밀번호" value={guestbookPassword} onChange={e=>setGuestbookPassword(e.target.value)} style={S.input}/>
              <button type="submit" disabled={isSubmitting} style={S.btn}>{isSubmitting?"등록중":"방명록 남기기"}</button>
            </form>
            <div style={S.comments}>
              {comments.length===0?<p style={S.noComm}>아직 방명록이 없습니다.</p>:
              comments.map(c => <div key={c.id} style={S.comm}><b>{c.name}</b><p>{c.message}</p><small>{new Date(c.created_at).toLocaleDateString("ko-KR")}</small></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4 */}
      <div style={S.page}>
        <img src="/images/page4.jpg" style={S.bgImg} alt="bg4"/>
        <div style={S.overlay}>
          <h2 style={S.sectionTitle}>Contact & Location</h2>
          <div style={S.card}><p style={S.label}>신랑측</p><b style={S.name}>{groom.name}</b><p style={S.parents}>{groom.father}, {groom.mother}</p></div>
          <div style={S.card}><p style={S.label}>신부측</p><b style={S.name}>{bride.name}</b><p style={S.parents}>{bride.mother}</p></div>
          <div style={S.card}>
            <h3 style={S.cardTitle}>오시는 길</h3>
            <p style={S.label}>지하철</p><p>{directions.subway}</p>
            <p style={S.label}>자가용</p><p>"{directions.navi}" 검색</p>
            <a href={`https://map.kakao.com/link/search/${wedding.address}`} target="_blank" style={S.mapBtn}>지도 보기</a>
          </div>
          <button onClick={()=>{navigator.clipboard.writeText(window.location.href);showToast("링크 복사됨");}} style={S.shareBtn}>청첩장 공유하기</button>
        </div>
      </div>
    </main>
  );
}

function CopyBtn({b,a,h}:{b:string,a:string,h:string}){
  const[copied,setCopied]=useState(false);
  return <button onClick={()=>{navigator.clipboard.writeText(`${b} ${a} ${h}`);setCopied(true);setTimeout(()=>setCopied(false),2000)}} style={S.copyBtn}><div><p style={S.bank}>{b}</p><p style={S.acc}>{a}</p><p style={S.holder}>{h}</p></div><span style={copied?S.copied:S.copyText}>{copied?"복사됨":"복사"}</span></button>;
}

const S:Record<string,React.CSSProperties>={
  loading:{minHeight:"100vh",background:"#f5f0eb",display:"flex",alignItems:"center",justifyContent:"center"},
  toast:{position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",background:"#3d3229",color:"white",padding:"12px 24px",borderRadius:"8px",zIndex:999},
  page:{position:"relative",minHeight:"100vh",background:"#333"},
  bgImg:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1},
  overlay:{position:"relative",zIndex:2,minHeight:"100vh",padding:"60px 20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.3)"},
  titleSmall:{fontSize:"12px",letterSpacing:"0.3em",color:"#fff",marginBottom:"20px",textShadow:"0 2px 8px rgba(0,0,0,0.8)"},
  title:{fontSize:"42px",fontWeight:300,color:"#fff",marginBottom:"24px",textShadow:"0 2px 8px rgba(0,0,0,0.8)"},
  subtitle:{fontSize:"16px",color:"#fff",marginBottom:"32px",lineHeight:1.6,textShadow:"0 2px 8px rgba(0,0,0,0.8)"},
  info:{color:"#fff",fontSize:"18px",textShadow:"0 2px 8px rgba(0,0,0,0.8)"},
  sectionTitle:{fontSize:"24px",fontWeight:300,color:"#fff",marginBottom:"32px",textShadow:"0 2px 8px rgba(0,0,0,0.8)"},
  card:{background:"rgba(255,255,255,0.96)",borderRadius:"16px",padding:"24px",marginBottom:"20px",width:"100%",maxWidth:"400px",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"},
  cardTitle:{fontSize:"16px",fontWeight:600,color:"#3d3229",marginBottom:"16px",textAlign:"center"},
  row:{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"#6b5f52",padding:"8px 0",borderBottom:"1px solid #eee"},
  link:{color:"#857b5c"},
  form:{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"},
  input:{width:"100%",padding:"12px",border:"1px solid #ddd",borderRadius:"8px",fontSize:"14px"},
  btn:{padding:"12px",background:"#857b5c",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",cursor:"pointer"},
  comments:{maxHeight:"180px",overflowY:"auto"},
  noComm:{textAlign:"center",color:"#999",padding:"20px"},
  comm:{padding:"10px",background:"#f9f9f9",borderRadius:"8px",marginBottom:"8px"},
  label:{fontSize:"12px",color:"#999",marginBottom:"4px"},
  name:{fontSize:"16px",color:"#3d3229"},
  parents:{fontSize:"14px",color:"#6b5f52"},
  mapBtn:{display:"block",textAlign:"center",padding:"12px",background:"#857b5c",color:"white",borderRadius:"8px",marginTop:"16px",textDecoration:"none"},
  shareBtn:{width:"100%",maxWidth:"400px",padding:"14px",marginTop:"16px",border:"1px solid #fff",color:"#fff",borderRadius:"8px",background:"rgba(0,0,0,0.3)",cursor:"pointer",fontSize:"14px"},
  galleryGrid:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px",marginBottom:"24px",width:"100%",maxWidth:"400px"},
  galleryItem:{aspectRatio:"1",background:"rgba(255,255,255,0.8)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"},
  copyBtn:{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px",background:"#fafafa",border:"none",borderRadius:"8px",cursor:"pointer",marginBottom:"8px"},
  bank:{fontSize:"11px",color:"#999"},
  acc:{fontSize:"14px",fontWeight:600,color:"#3d3229"},
  holder:{fontSize:"11px",color:"#666"},
  copyText:{fontSize:"12px",color:"#857b5c"},
  copied:{fontSize:"12px",color:"green"}
};
