import type { Metadata } from "next";
import Experience from "../pages/Experience/Experience";

export const metadata: Metadata = {
  title: "Experiência",
};

export default function ExperiencePage() {
  return <Experience />;
}
