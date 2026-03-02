import type { Metadata } from "next";
import Services from "../pages/Services/Services";

export const metadata: Metadata = {
  title: "Solicitar Serviço",
  description:
    "Descreva o serviço que você precisa e envie sua solicitação. Responderei em breve com uma proposta personalizada.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <Services />;
}
