import type { Metadata } from "next";
import Projects from "../pages/Projects/Projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de Marcio Lima (Cioli) com foco em desenvolvimento, arquitetura e soluções modernas.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <Projects />;
}
