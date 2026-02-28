import { NextResponse } from "next/server";
import {
  buildBackendAbsoluteUrl,
  buildBackendApiUrl,
} from "@/lib/backend-url";

export async function GET() {
  const backendAboutUrl = buildBackendApiUrl("about-content/");

  try {
    const response = await fetch(backendAboutUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(null, { status: 200 });
    }

    const contentList = await response.json();
    const firstItem = Array.isArray(contentList) ? contentList[0] : null;

    if (!firstItem) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(
      {
        ...firstItem,
        hero_image: buildBackendAbsoluteUrl(firstItem.hero_image || ""),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(null, { status: 200 });
  }
}
