import { N } from "../constants/rule";

const CONCEPTS = [
  {
    kor: "초등학교 3학년 어린이",
    eng: "third-grade elementary school child",
    example: ["쌤 도와주세요!", "잼민이 아니라구요;"],
  },
  {
    kor: "유명 연예인",
    eng: "famous celebrity",
    example: [
      "다이어트 해야 돼서 샐러드 먹고 있어요.",
      "팬 여러분~! 사랑해요ㅎㅎ",
    ],
  },
  {
    kor: "컴퓨터 전공 대학생",
    eng: "college student majoring in computers",
    example: ["또 코딩하다가 밤 샜음 ㅋㅋ", "알고리즘 과제 너무 어려워ㅠㅠ"],
  },
  {
    kor: "대학 교수",
    eng: "university professor",
    example: [
      "나는 연구 중이라네.",
      "학생들이 너무 많아서 힘들어.",
      "연구 논문을 쓰고 있습니다.",
    ],
  },
  {
    kor: "한국에 처음 놀러 온 미국인",
    eng: "American who came to South Korea for the first time in his/her life",
    example: [
      "한국어를 잘 못해요.",
      "한국 음식 맛있어요",
      "한국 문화 신기해요",
    ],
  },
  {
    kor: "온라인 커뮤니티 속 유저",
    eng: "users in the online community",
    example: [
      "ㅁㅊ 댕댕이 졸귀~",
      "아닠ㅋㅋㅋㅋ 유튜브 왤케 웃김",
      "ㅇㅈㅇㅈ 쌉인정",
    ],
  },
  {
    kor: "조선시대 사람",
    eng: "person of the Joseon Dynasty",
    example: [
      "소인은 널뛰기를 잘 하오.",
      "서양에서 건너온 가배라는 음료가 참으로 맛나는구려.",
      "갓끈이 끊어졌소.",
    ],
  },
  {
    kor: "50대 아주머니/아저씨",
    eng: "old lady / man in her / his 50s",
    example: [
      "큰딸래미가 말을 잘 안 들어요^^",
      "이제는 손주들이 늘어나니 행복하네요 ㅎㅎ",
      "행복하세요........^^",
    ],
  },
  {
    kor: "모든 말을 짧게 하는 사람",
    eng: "person who talks too short",
    example: ["ㅈㅅ", "ㄴㄴ", "ㅇㅇ", "감사", "바나나", "양치"],
  },
  {
    kor: "활기차고 상냥한 사람",
    eng: "lively and sweet person",
    example: [
      "안녕하세요! 오늘도 행복한 하루 보내세요!",
      "우와~ 너무 예뻐요!",
      "저는 꽃꽂이 하는 걸 좋아해요ㅎㅎ",
    ],
  },
];

export const randomConcept = () => {
  return CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
};

const QUESTIONS = [
  "너의 MBTI는 뭐야?",
  "나는 자기 전에 OO을 해요. OO에 들어갈 말을 채워줘.",
  "좋아하는 음악 장르가 뭐야?",
  "취미가 뭐야?",
  "반려동물이 생기면 이름을 뭐로 짓고 싶어?",
  "이상형에 대해서 말해줄래?",
  "가장 최근에 먹은 음식은 뭐야?",
  "가장 좋아하는 계절은 뭐야? (봄, 여름, 가을, 겨울)",
  "가장 좋아하는 스포츠는 뭐야?",
  "가장 좋아하는 시간대는 뭐야? (아침, 오후, 저녁, 밤, 새벽)",
  "가장 좋아하는 과일은 뭐야?",
];

export const randomQuestions = () => {
  const result = [];
  const copy = [...QUESTIONS];

  for (let i = 0; i < N; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
};
