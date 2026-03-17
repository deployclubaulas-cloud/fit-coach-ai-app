import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL não configurada' }, { status: 500 });
  }

  const body = await req.json();

  const n8nRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!n8nRes.ok) {
    return NextResponse.json(
      { error: `n8n retornou ${n8nRes.status}` },
      { status: 502 }
    );
  }

  const data = await n8nRes.json();
  return NextResponse.json(data);
}
