export interface ChatResponse {
  response: string;
  type: 'message' | 'reset';
}

export async function sendMessage(
  message: string,
  sessionId: string,
  userName: string,
): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, userName }),
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  return res.json();
}
