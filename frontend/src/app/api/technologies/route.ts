import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendTechnologiesUrl = buildBackendApiUrl("technologies/");

  try {
    const response = await fetch(backendTechnologiesUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const technologies = await response.json();
    return NextResponse.json(Array.isArray(technologies) ? technologies : [], {
      status: 200,
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
