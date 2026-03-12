import { ImageResponse } from "next/og";
import { weddingConfig, formatDate, formatTime } from "@/lib/config";

export const runtime = "edge";

export const alt = "이재현 ♥ 이선미 결혼합니다";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const { groom, bride, wedding } = weddingConfig;
  
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f0eb",
          fontFamily: "'Malgun Gothic', sans-serif",
        }}
      >
        {/* 배경 장식 */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: "20px solid #857b5c",
          margin: "40px",
        }} />
        
        {/* 제목 */}
        <div style={{
          fontSize: "80px",
          color: "#3d3229",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          ❤️
        </div>
        
        <div style={{
          fontSize: "60px",
          fontWeight: 600,
          color: "#3d3229",
          marginBottom: "30px",
        }}>
          {groom.name} ♥ {bride.name}
        </div>
        
        <div style={{
          fontSize: "36px",
          color: "#6b5f52",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          Wedding Invitation
        </div>
        
        <div style={{
          fontSize: "32px",
          color: "#857b5c",
        }}>
          {formatDate(wedding.date)} {formatTime(wedding.time)}
        </div>
        
        <div style={{
          fontSize: "28px",
          color: "#999",
          marginTop: "20px",
        }}>
          {wedding.place}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
