import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const backendUrl = buildBackendApiUrl(`project-installments/${id}/`);

  try {
    const payload = await request.json();

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: "Nao foi possivel atualizar a parcela.", errors: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado ao atualizar parcela." },
      { status: 500 },
    );
  }
}
