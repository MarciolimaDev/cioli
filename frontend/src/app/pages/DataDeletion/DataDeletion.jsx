"use client";

import React from "react";
import {
  AlertTriangle,
  Mail,
  ShieldAlert,
  Trash2,
  UserRoundX,
} from "lucide-react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-[#04081A] text-gray-100">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0890F8] to-[#199FFF]">
            <Trash2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Exclusao de Dados do Usuario
          </h1>
          <p className="text-lg text-gray-400">
            Instrucoes para solicitar exclusao de dados da CIOLI
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <UserRoundX className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Como Solicitar a Exclusao
                </h2>
                <p className="leading-relaxed text-gray-300">
                  Se voce deseja excluir seus dados pessoais do nosso site,
                  formularios, atendimento comercial ou integracoes como
                  WhatsApp, envie uma solicitacao para o e-mail abaixo com o
                  assunto <strong>&quot;Exclusao de Dados&quot;</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <Mail className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Canal de Solicitacao
                </h2>
                <p className="text-gray-300">
                  E-mail:{" "}
                  <a
                    href="mailto:contato@cioli.dev?subject=Exclusao%20de%20Dados"
                    className="font-semibold underline hover:text-[#0890F8]"
                  >
                    contato@cioli.dev
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <ShieldAlert className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Informacoes Necessarias
                </h2>
                <p className="mb-4 text-gray-300">
                  Para localizar seu cadastro com seguranca, informe:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Nome completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>E-mail usado no contato ou cadastro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Telefone/WhatsApp vinculado, se aplicavel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#0890F8]">•</span>
                    <span>Descricao breve da solicitacao</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#0890F8]/20 bg-[#0b1229] p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-[#0890F8]/10 p-2">
                <AlertTriangle className="h-6 w-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-semibold text-white">
                  Prazo e Escopo da Exclusao
                </h2>
                <p className="mb-4 text-gray-300">
                  Após a validacao da identidade do solicitante, a exclusao dos
                  dados sera processada em prazo razoavel, salvo quando houver
                  obrigacao legal de retencao.
                </p>
                <p className="text-gray-300">
                  Dados que precisem ser mantidos por exigencia legal, fiscal ou
                  de seguranca poderao ser conservados pelo periodo minimo
                  necessario, com acesso restrito.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
