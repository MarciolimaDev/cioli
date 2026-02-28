import type { Metadata } from "next";
import Contact from "../pages/Contact/Contact";

export const metadata: Metadata = {
  title: "Contato",
};

export default function ContactPage() {
  return <Contact />;
}
