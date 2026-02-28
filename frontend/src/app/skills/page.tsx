import type { Metadata } from "next";
import Skills from "../pages/Skills/Skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Habilidades técnicas de Marcio Lima (Cioli), incluindo stacks, ferramentas e tecnologias utilizadas.",
  alternates: {
    canonical: "/skills",
  },
};

export default function SkillsPage() {
  return <Skills />;
}
