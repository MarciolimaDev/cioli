import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendFormationsUrl = buildBackendApiUrl("formations/");

  try {
    const response = await fetch(backendFormationsUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const formations = await response.json();
    const sanitized = (Array.isArray(formations) ? formations : []).map(
      ({ id: _id, ...formation }) => formation
    );

    return NextResponse.json(sanitized, {
      status: 200,
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
