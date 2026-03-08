import type { Metadata } from "next";
import AdsProposall from "@/app/pages/AdsProposall/AdsProposall";

export const metadata: Metadata = {
  title: "Proposta Ads",
  description:
    "Proposta de gestao de trafego pago da CIOLI com foco em geracao de leads e performance no Meta Ads.",
  alternates: {
    canonical: "/proposta-ads",
  },
};

export default function PropostaAdsPage() {
  return (
    <main>
      <AdsProposall />
    </main>
  );
}
