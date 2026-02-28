import type { Metadata } from "next";
import Experience from "../pages/Experience/Experience";

export const metadata: Metadata = {
  title: "Experiência",
  description:
    "Experiência profissional de Marcio Lima (Cioli) em projetos e desenvolvimento de software.",
  alternates: {
    canonical: "/experience",
  },
};

export default function ExperiencePage() {
  return <Experience />;
}
