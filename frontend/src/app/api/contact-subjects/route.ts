import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendSubjectsUrl = buildBackendApiUrl("contact-subjects/");

  try {
    const response = await fetch(backendSubjectsUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const subjects = await response.json();
    return NextResponse.json(Array.isArray(subjects) ? subjects : [], {
      status: 200,
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
