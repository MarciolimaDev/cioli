"use client";

import React from "react";
import {
  AlertCircle,
  BadgeCheck,
  FileText,
  Gavel,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#04081A] text-gray-100">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0890F8] to-[#199FFF]">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Termos de Servico
          </h1>
          <p className="text-lg text-gray-400">
            Ultima atualizacao: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <AlertCircle className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Aceitacao dos Termos
                </h2>
                <p className="leading-relaxed text-gray-300">
                  Ao acessar este site, enviar mensagens, solicitar orcamentos
                  ou contratar servicos da CIOLI, voce concorda com estes Termos
                  de Servico e com a Politica de Privacidade aplicavel.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <BadgeCheck className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Escopo dos Servicos
                </h2>
                <p className="mb-4 text-gray-300">
                  A CIOLI presta servicos digitais sob proposta comercial e
                  alinhamento previo entre as partes. Isso pode incluir:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Desenvolvimento de sites, landing pages e sistemas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Integracoes com APIs e automacoes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Suporte tecnico e manutencao contratada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Atendimento comercial via formularios, e-mail e WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <MessageSquare className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Uso de Formularios e WhatsApp
                </h2>
                <p className="mb-4 text-gray-300">
                  Ao utilizar formularios do site ou canais como WhatsApp, voce
                  declara que as informacoes fornecidas sao verdadeiras e que
                  possui autorizacao para compartilhar os dados enviados.
                </p>
                <p className="text-gray-300">
                  O uso desses canais nao garante contratacao automatica, prazo
                  imediato ou aprovacao de qualquer proposta comercial.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <ShieldCheck className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Responsabilidades do Cliente
                </h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Fornecer briefing, acessos e materiais necessarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Validar entregas e responder dentro de prazo razoavel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Respeitar condicoes de pagamento acordadas em proposta</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <Gavel className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Pagamento, Cancelamento e Limitacoes
                </h2>
                <p className="mb-4 text-gray-300">
                  Valores, prazos, revisoes e formas de pagamento devem ser
                  definidos em proposta ou contrato especifico. Em caso de
                  inadimplencia, entregas futuras podem ser suspensas.
                </p>
                <p className="text-gray-300">
                  A CIOLI nao se responsabiliza por indisponibilidades causadas
                  por plataformas de terceiros, servicos externos, APIs,
                  provedores de hospedagem ou alteracoes feitas por pessoas sem
                  autorizacao.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Alteracoes nestes Termos
            </h2>
            <p className="text-gray-300">
              Estes Termos de Servico podem ser atualizados a qualquer momento
              para refletir mudancas operacionais, legais ou comerciais. A
              versao vigente sera sempre a publicada nesta pagina.
            </p>
          </section>

          <section className="rounded-lg border border-[#0890F8]/30 bg-gradient-to-r from-[#0890F8]/10 to-[#199FFF]/10 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Contato
            </h2>
            <p className="mb-4 text-gray-300">
              Para duvidas sobre estes Termos de Servico, entre em contato:
            </p>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-[#0890F8]">E-mail:</strong>{" "}
                <a
                  href="mailto:contato@cioli.dev"
                  className="underline hover:text-[#0890F8]"
                >
                  contato@cioli.dev
                </a>
              </p>
              <p>
                <strong className="text-[#0890F8]">Responsavel:</strong> CIOLI
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
