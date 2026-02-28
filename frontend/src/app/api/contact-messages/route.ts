import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function POST(request: Request) {
  const backendMessagesUrl = buildBackendApiUrl("contact-messages/");

  try {
    const payload = await request.json();

    const response = await fetch(backendMessagesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: "Não foi possível enviar sua mensagem.", errors: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado ao enviar mensagem." },
      { status: 500 }
    );
  }
}
