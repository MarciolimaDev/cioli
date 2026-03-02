import { Metadata } from "next";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Política de Privacidade | Cioli Dev",
  description: "Política de privacidade e proteção de dados do Cioli Dev. Saiba como coletamos, usamos e protegemos suas informações.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
