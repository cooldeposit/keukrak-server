const CONCEPTS = [
  {
    kor: "초등학교 3학년 어린이",
    eng: "third-grade elementary school child",
  },
  {
    kor: "유명 연예인",
    eng: "famous celebrity",
  },
  {
    kor: "컴퓨터 전공 대학생",
    eng: "college student majoring in computers",
  },
  {
    kor: "대학 교수",
    eng: "university professor",
  },
  {
    kor: "한국에 처음 놀러 온 미국인",
    eng: "American who came to South Korea for the first time in his/her life",
  },
  {
    kor: "온라인 커뮤니티 속 유저",
    eng: "users in the online community",
  },
  {
    kor: "조선시대 사람",
    eng: "person of the Joseon Dynasty",
  },
  {
    kor: "50대 아주머니/아저씨",
    eng: "old lady / man in her / his 50s",
  },
  {
    kor: "모든 말을 짧게 하는 사람",
    eng: "person who talks too short",
  },
  {
    kor: "활기차고 상냥한 사람",
    eng: "lively and sweet person",
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
  const N = 5;

  const result = [];
  const copy = [...QUESTIONS];

  for (let i = 0; i < N; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
};
