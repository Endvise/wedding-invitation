// 청첩장 정보 설정

export const weddingConfig = {
  groom: {
    name: process.env.NEXT_PUBLIC_GROOM_NAME || '이재현',
    father: process.env.NEXT_PUBLIC_GROOM_FATHER || '이현배',
    mother: process.env.NEXT_PUBLIC_GROOM_MOTHER || '신명주',
    account: {
      bank: process.env.NEXT_PUBLIC_GROOM_ACCOUNT_BANK || '새마을금고   .',
      number: process.env.NEXT_PUBLIC_GROOM_ACCOUNT || '9004-003-084667',
      holder: process.env.NEXT_PUBLIC_GROOM_ACCOUNT_HOLDER || '이현배,신명주',
    },
  },
  bride: {
    name: process.env.NEXT_PUBLIC_BRIDE_NAME || '이선미',
    mother: process.env.NEXT_PUBLIC_BRIDE_MOTHER || '김난희',
    account: {
      bank: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT_BANK || '하나은행',
      number: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT || '242-910129-77507',
      holder: process.env.NEXT_PUBLIC_BRIDE_ACCOUNT_HOLDER || '이선미',
    },
    parentAccount: {
      bank: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT_BANK || '카카오',
      number: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT || '3333-11-605-9904',
      holder: process.env.NEXT_PUBLIC_BRIDE_PARENT_ACCOUNT_HOLDER || '김난희',
    },
  },
  wedding: {
    date: process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-05-17',
    time: process.env.NEXT_PUBLIC_WEDDING_TIME || '13:00',
    place: process.env.NEXT_PUBLIC_WEDDING_PLACE || '김해산정',
    address: process.env.NEXT_PUBLIC_WEDDING_ADDRESS || '경남 김해시 가야로 347-30',
    phone: process.env.NEXT_PUBLIC_WEDDING_PHONE || '055-324-6600',
    floor: process.env.NEXT_PUBLIC_WEDDING_FLOOR || '1층',
  },
  directions: {
    subway: process.env.NEXT_PUBLIC_SUBWAY_INFO || '김해 경전철 연지공원역 2번출구 도보 1km',
    navi: process.env.NEXT_PUBLIC_NAVI_SEARCH || '김해 산정',
  },
};

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

export function formatTime(timeStr: string): string {
  const [hour, minute] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? '오후' : '오전';
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${ampm} ${displayHour}:${minute}`;
}
