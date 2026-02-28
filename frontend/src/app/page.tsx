import type { Metadata } from "next";
import Hero from "./pages/Hero/Hero";
import About from "./pages/About/About";

export const metadata: Metadata = {
  title: "Início",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
    </>
  );
}