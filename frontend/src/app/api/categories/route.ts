import { NextResponse } from "next/server";
import { buildBackendApiUrl } from "@/lib/backend-url";

export async function GET() {
  const backendCategoriesUrl = buildBackendApiUrl("categories/");

  try {
    const response = await fetch(backendCategoriesUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const categories = await response.json();
    return NextResponse.json(Array.isArray(categories) ? categories : [], {
      status: 200,
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
