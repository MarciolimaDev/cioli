import type { Metadata } from "next";
import Hero from "./pages/Hero/Hero";
import About from "./pages/About/About";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Portfólio oficial de Marcio Lima (Cioli) com projetos, experiência e habilidades em desenvolvimento.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
    </>
  );
}