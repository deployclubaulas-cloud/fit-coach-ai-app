export interface ChatResponse {
  response: string;
  type: 'message' | 'reset';
}

export async function sendMessage(
  message: string,
  sessionId: string,
  userName: string,
): Promise<ChatResponse> {
  const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) throw new Error('NEXT_PUBLIC_N8N_WEBHOOK_URL não configurada');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, userName }),
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  return res.json();
}
