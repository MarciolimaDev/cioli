import type { Metadata } from "next";
import Contact from "../pages/Contact/Contact";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Marcio Lima (Cioli) para oportunidades, freelas e parcerias em desenvolvimento.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <Contact />;
}
