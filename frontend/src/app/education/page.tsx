import type { Metadata } from "next";
import Education from "../pages/Education/Education";
import { buildBackendApiUrl } from "@/lib/backend-url";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Formação",
};

export default async function EducationPage() {
  const backendFormationsUrl = buildBackendApiUrl("formations/");

  let formations: any[] = [];

  try {
    const response = await fetch(backendFormationsUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      formations = Array.isArray(data) ? data : [];
    }
  } catch {
    formations = [];
  }

  return <Education initialFormations={formations as any} />;
}
