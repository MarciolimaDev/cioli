import { NextResponse } from "next/server";
import {
  buildBackendAbsoluteUrl,
  buildBackendApiUrl,
} from "@/lib/backend-url";

export async function GET() {
  const backendBaseUrl = buildBackendApiUrl("projects/");

  try {
    const response = await fetch(backendBaseUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const projects = await response.json();

    const normalized = (Array.isArray(projects) ? projects : []).map((project) => {
      const thumbnail = project?.thumbnall || "";
      const absoluteThumbnail = buildBackendAbsoluteUrl(thumbnail);

      return {
        ...project,
        thumbnall: absoluteThumbnail,
      };
    });

    return NextResponse.json(normalized, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
