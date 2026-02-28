import type { Metadata } from "next";
import Projects from "../pages/Projects/Projects";

export const metadata: Metadata = {
  title: "Projetos",
};

export default function ProjectsPage() {
  return <Projects />;
}
