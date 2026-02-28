import { generateContentStream } from './client';
import { SEARCH_SYSTEM_PROMPT } from './prompts';

export async function* searchWithAI(
  question: string,
  context: string,
  conversationHistory: Array<{ role: string; content: string }>
) {
  const historyText = conversationHistory
    .map((msg) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
    .join('\n');

  const prompt = `
## 대화 히스토리
${historyText || '(첫 질문)'}

## 현재 질문
${question}

## 사용 가능한 데이터
${context || '현재 캐시된 데이터가 없습니다.'}

위 데이터를 기반으로 사용자의 질문에 답변해주세요.
데이터에 없는 내용은 추측하지 말고, 데이터가 부족하면 "해당 지역 데이터가 아직 수집되지 않았습니다"라고 안내하세요.
`;

  yield* generateContentStream(prompt, SEARCH_SYSTEM_PROMPT, 'gemini-2.0-flash');
}
