import { Metadata } from "next";
import TermsOfService from "../pages/TermsOfService/TermsOfService";

export const metadata: Metadata = {
  title: "Termos de Servico | Cioli Dev",
  description:
    "Termos de servico da CIOLI para uso do site, formularios de contato e solicitacoes comerciais.",
};

export default function TermsOfServicePage() {
  return <TermsOfService />;
}
