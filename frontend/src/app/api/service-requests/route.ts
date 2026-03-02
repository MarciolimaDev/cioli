import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function POST(request: Request) {
  const backendServiceRequestsUrl = buildBackendApiUrl("service-requests/");

  try {
    const payload = await request.formData();

    const response = await fetch(backendServiceRequestsUrl, {
      method: "POST",
      body: payload,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Nao foi possivel enviar sua solicitacao.",
          errors: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado ao enviar solicitacao." },
      { status: 500 }
    );
  }
}
