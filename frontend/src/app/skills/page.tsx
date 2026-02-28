import type { Metadata } from "next";
import Skills from "../pages/Skills/Skills";

export const metadata: Metadata = {
  title: "Skills",
};

export default function SkillsPage() {
  return <Skills />;
}
