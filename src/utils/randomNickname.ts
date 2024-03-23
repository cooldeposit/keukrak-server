const ADVERBS = [
  "꽤",
  "조금",
  "매우",
  "너무",
  "그냥",
  "정말",
  "아주",
  "제법",
  "좀",
  "다소",
  "약간",
  "대단히",
  "대체로",
];

const ADJECTIVES = [
  "멋진",
  "잘생긴",
  "귀여운",
  "멋있는",
  "예쁜",
  "착한",
  "빡친",
  "졸린",
  "친절한",
  "행복한",
  "슬픈",
  "무서운",
  "화난",
  "기쁜",
  "우울한",
  "신난",
  "쩌는",
  "멋부리는",
  "힘든",
  "쉽지 않은",
  "코딩하는",
  "잘 먹는",
];

const NOUNS = [
  {
    icon: "🐶",
    name: "개",
  },
  {
    icon: "🐱",
    name: "고양이",
  },
  {
    icon: "🐭",
    name: "쥐",
  },
  {
    icon: "🐹",
    name: "햄스터",
  },
  {
    icon: "🐰",
    name: "토끼",
  },
  {
    icon: "🦊",
    name: "여우",
  },
  {
    icon: "🐻",
    name: "곰",
  },
  {
    icon: "🐼",
    name: "판다",
  },
  {
    icon: "🐨",
    name: "코알라",
  },
  {
    icon: "🐯",
    name: "호랑이",
  },
  {
    icon: "🦁",
    name: "사자",
  },
  {
    icon: "🐮",
    name: "소",
  },
  {
    icon: "🐷",
    name: "돼지",
  },
  {
    icon: "🐸",
    name: "개구리",
  },
  {
    icon: "🐵",
    name: "원숭이",
  },
  {
    icon: "🐔",
    name: "닭",
  },
  {
    icon: "🐧",
    name: "펭귄",
  },
  {
    icon: "🐦",
    name: "새",
  },
  {
    icon: "🐤",
    name: "병아리",
  },
  {
    icon: "🦆",
    name: "오리",
  },
  {
    icon: "🦅",
    name: "독수리",
  },
  {
    icon: "🦉",
    name: "올빼미",
  },
  {
    icon: "🦇",
    name: "박쥐",
  },
  {
    icon: "🐺",
    name: "늑대",
  },
  {
    icon: "🐗",
    name: "멧돼지",
  },
  {
    icon: "🐴",
    name: "말",
  },
  {
    icon: "🦄",
    name: "유니콘",
  },
  {
    icon: "🐝",
    name: "벌",
  },
  {
    icon: "🦋",
    name: "나비",
  },
  {
    icon: "🍧",
    name: "아이스크림",
  },
  {
    icon: "🍔",
    name: "햄버거",
  },
  {
    icon: "🦈",
    name: "상어",
  },
  {
    icon: "🐬",
    name: "돌고래",
  },
  {
    icon: "🐳",
    name: "고래",
  },
  {
    icon: "🐋",
    name: "고래상어",
  },
  {
    icon: "🐟",
    name: "물고기",
  },
  {
    icon: "🐠",
    name: "금붕어",
  },
  {
    icon: "🐡",
    name: "복어",
  },
  {
    icon: "🦐",
    name: "새우",
  },
  {
    icon: "🦑",
    name: "오징어",
  },
  {
    icon: "🦀",
    name: "게",
  },
  {
    icon: "🐙",
    name: "문어",
  },
  {
    icon: "🦞",
    name: "랍스터",
  },
  {
    icon: "🍭",
    name: "사탕",
  },
  {
    icon: "🍬",
    name: "캔디",
  },
  {
    icon: "🍫",
    name: "초콜릿",
  },
  {
    icon: "🍿",
    name: "팝콘",
  },
  {
    icon: "🎙",
    name: "마이크",
  },
  {
    icon: "🎧",
    name: "헤드폰",
  },
  {
    icon: "📱",
    name: "스마트폰",
  },
  {
    icon: "💻",
    name: "노트북",
  },
  {
    icon: "🌸",
    name: "꽃",
  },
  {
    icon: "🌈",
    name: "무지개",
  },
  {
    icon: "🌞",
    name: "태양",
  },
  {
    icon: "🌛",
    name: "달",
  },
  {
    icon: "🌟",
    name: "별",
  },
  {
    icon: "🌠",
    name: "별똥별",
  },
  {
    icon: "🌌",
    name: "우주",
  },
  {
    icon: "🌎",
    name: "지구",
  },
  {
    icon: "👑",
    name: "왕관",
  },
  {
    icon: "👒",
    name: "모자",
  },
  {
    icon: "🛴",
    name: "킥보드",
  },
  {
    icon: "🚲",
    name: "자전거",
  },
  {
    icon: "🚗",
    name: "자동차",
  },
  {
    icon: "🚕",
    name: "택시",
  },
  {
    icon: "🚜",
    name: "트랙터",
  },
  {
    icon: "🚚",
    name: "트럭",
  },
  {
    icon: "🚀",
    name: "로켓",
  },
  {
    icon: "🚁",
    name: "헬리콥터",
  },
  {
    icon: "🛸",
    name: "UFO",
  },
  {
    icon: "🚢",
    name: "배",
  },
  {
    icon: "☂",
    name: "우산",
  },
  {
    icon: "🎈",
    name: "풍선",
  },
];

const randomColor = () => {
  const r = Math.floor(Math.random() * 128) + 128;
  const g = Math.floor(Math.random() * 128) + 128;
  const b = Math.floor(Math.random() * 128) + 128;

  return `rgb(${r}, ${g}, ${b})`;
};

export const randomNickname = () => {
  const adverb = ADVERBS[Math.floor(Math.random() * ADVERBS.length)];
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  return {
    icon: noun.icon,
    color: randomColor(),
    name: `${adverb} ${adjective} ${noun.name}`,
  };
};
