// 청첩장 정보 설정
// 이 파일에서 결혼식 정보를 관리합니다

export const weddingConfig = {
  groom: {
    name: process.env.NEXT_PUBLIC_GROOM_NAME || '신랑',
    father: process.env.NEXT_PUBLIC_GROOM_FATHER || '아버지',
    mother: process.env.NEXT_PUBLIC_GROOM_MOTHER || '어머니',
    account: {
      bank: process.env.NEXT_PUBLIC_GROOM_ACCOUNT_BANK || '은행',
      number: process.env.NEXT_PUBLIC_GROOM_ACCOUNT || '계좌번호',
      holder: process.env.NEXT_PUBLIC_GROOM_ACCOUNT_HOLDER || '예금주',
    },
  },
  bride: {
    name: process.env.NEXT_PUBLIC_BRIDE_NAME || '신부',
    mother: process.env.NEXT_PUBLIC_BRIDE_MOTHER || '어머니',
    account: {
      bank: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT_BANK || '은행',
      number: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT || '계좌번호',
      holder: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT_HOLDER || '예금주',
    },
    parentAccount: {
      bank: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT_BANK || '은행',
      number: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT || '계좌번호',
      holder: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT_HOLDER || '예금주',
    },
  },
  wedding: {
    date: process.env.NEXT_PUBLIC_WEDDING_DATE || '2025-05-17',
    time: process.env.NEXT_PUBLIC_WEDDING_TIME || '13:00',
    place: process.env.NEXT_PUBLIC_WEDDING_PLACE || '장소',
    address: process.env.NEXT_PUBLIC_WEDDING_ADDRESS || '주소',
    phone: process.env.NEXT_PUBLIC_WEDDING_PHONE || '전화번호',
    floor: process.env.NEXT_PUBLIC_WEDDING_FLOOR || '',
  },
  directions: {
    subway: process.env.NEXT_PUBLIC_SUBWAY_INFO || '지하철 정보',
    navi: process.env.NEXT_PUBLIC_NAVI_SEARCH || '네비게이션 검색어',
  },
};

// 날짜 포맷팅
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString('ko-KR', options);
}

// 시간 포맷팅
export function formatTime(timeStr: string): string {
  const [hour, minute] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? '오후' : '오전';
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${ampm} ${displayHour}:${minute}`;
}
