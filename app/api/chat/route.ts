import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('[/api/chat] N8N_WEBHOOK_URL não está definida');
    return NextResponse.json({ error: 'Configuração ausente no servidor' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text();
      console.error(`[/api/chat] n8n retornou ${n8nRes.status}:`, text);
      return NextResponse.json({ error: `Erro no agente: ${n8nRes.status}` }, { status: 502 });
    }

    const data = await n8nRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/chat] Falha ao contactar n8n:', err);
    return NextResponse.json({ error: 'Não foi possível conectar ao agente' }, { status: 503 });
  }
}
