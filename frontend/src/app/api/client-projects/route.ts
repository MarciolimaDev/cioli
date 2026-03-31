import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendUrl = buildBackendApiUrl("client-projects/");

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const backendUrl = buildBackendApiUrl("client-projects/");

  try {
    const payload = await request.json();

    const response = await fetch(backendUrl, {
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
        { message: "Nao foi possivel cadastrar o projeto.", errors: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado ao cadastrar projeto." },
      { status: 500 },
    );
  }
}
