export const RULE = (concept: string, usernames: string[]) => {
  return [
    `극락 퀴즈쇼를 시작합니다-! 

    지금 이 채팅방에는 5명이 있어요. 

${usernames.join(", ")}, 그리고 AI...`,

    `[진행 방식]

    매 1분마다 질문을 드려요. 
    질문에 대답하며 자유롭게 대화해주세요. 
    
    총 ${N}번의 질문이 주어지며, 
    모든 대화가 끝나면 정답을 맞출 수 있어요. 
    
    누가 특정 참여자(혹은 AI)인지 맞춰보세요.`,

    `[유의 사항]

    재미있게 플레이하려면 다음의 규칙을 지켜주세요. 
    
    1. 고유명사 사용을 피해주세요. 
    어제 극락식당에서 오야꼬동을 먹었다. 
    
    2. 컨셉과 다른 대화는 피해주세요. 
    아 나 50대 중반인데, 동년배들 다 초코우유 좋아한다.
    (컨셉: 초등학생)
    
    3. 질문과 무관한 답변은 피해주세요.  
    내 MBTI는 ISTJ야. 
    (질문: 취미가 무엇인가요)`,

    `이번 게임에서는
    [${concept}]의 말투로 연기해 줘.
    
    그럼 이제 시작한다-!`,
  ];
};

export const N = 1;
