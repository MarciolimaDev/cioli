"use client";

import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Shield, Lock, Mail, Clock, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#04081A] text-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0890F8] to-[#199FFF] mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          <p className="text-gray-400 text-lg">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introdução */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <AlertCircle className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-white">Introdução</h2>
                <p className="text-gray-300 leading-relaxed">
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e
                  protegemos seus dados pessoais quando você utiliza nossos formulários de contato
                  e solicitação de serviços. Ao usar nossos serviços, você concorda com as
                  práticas descritas neste documento.
                </p>
              </div>
            </div>
          </section>

          {/* Dados Coletados */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <UserCheck className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Dados Coletados
                </h2>
                <p className="text-gray-300 mb-4">
                  Coletamos os seguintes dados pessoais quando você preenche nossos formulários:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Nome completo:</strong> para identificação e personalização do atendimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>E-mail:</strong> para comunicação e envio de respostas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Telefone/WhatsApp:</strong> para contato direto quando necessário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Informações do projeto:</strong> detalhes sobre a solicitação ou mensagem enviada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Arquivos (opcional):</strong> logo, imagens ou documentos relacionados ao projeto</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidade do Uso */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <Mail className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Finalidade do Uso dos Dados
                </h2>
                <p className="text-gray-300 mb-4">
                  Seus dados pessoais são utilizados exclusivamente para:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Responder suas solicitações de contato ou orçamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Elaborar propostas comerciais personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Enviar comunicações relacionadas aos serviços solicitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Melhorar a qualidade do atendimento e experiência do usuário</span>
                  </li>
                </ul>
                <p className="text-gray-400 mt-4 text-sm">
                  <strong>Importante:</strong> Não utilizamos seus dados para envio de marketing
                  não solicitado ou outras finalidades sem seu consentimento expresso.
                </p>
              </div>
            </div>
          </section>

          {/* Compartilhamento */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <Lock className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Compartilhamento de Dados
                </h2>
                <p className="text-gray-300 mb-4">
                  Seus dados pessoais <strong className="text-[#0890F8]">não serão vendidos, alugados ou compartilhados</strong> com terceiros, exceto:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Com prestadores de serviços essenciais (hospedagem, notificações) que operam sob estrito acordo de confidencialidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Quando exigido por lei ou ordem judicial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Com seu consentimento explícito para situações específicas</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Armazenamento */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <Clock className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Período de Armazenamento
                </h2>
                <p className="text-gray-300 mb-4">
                  Seus dados pessoais serão armazenados pelo seguinte período:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Mensagens de contato:</strong> até 12 meses após o último contato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Solicitações de serviço:</strong> até 24 meses ou conclusão do projeto contratado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Documentos fiscais:</strong> conforme exigido pela legislação brasileira (mínimo 5 anos)</span>
                  </li>
                </ul>
                <p className="text-gray-400 mt-4 text-sm">
                  Após esses períodos, seus dados serão excluídos permanentemente ou anonimizados,
                  salvo obrigações legais de retenção.
                </p>
              </div>
            </div>
          </section>

          {/* Direitos do Titular */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <Shield className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Seus Direitos (LGPD)
                </h2>
                <p className="text-gray-300 mb-4">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Correção:</strong> solicitar atualização de dados incompletos, inexatos ou desatualizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Exclusão:</strong> solicitar eliminação de dados tratados com seu consentimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Portabilidade:</strong> solicitar transferência de dados a outro fornecedor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span><strong>Revogação do consentimento:</strong> retirar autorização para uso de dados a qualquer momento</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-[#0890F8]/10 rounded-lg border border-[#0890F8]/30">
                  <p className="text-gray-300">
                    Para exercer seus direitos, entre em contato através do e-mail:{" "}
                    <a
                      href="mailto:contato@cioli.dev"
                      className="text-[#0890F8] hover:text-[#199FFF] font-semibold underline"
                    >
                      contato@cioli.dev
                    </a>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Responderemos sua solicitação em até 15 dias úteis.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#0890F8]/10">
                <Lock className="w-6 h-6 text-[#0890F8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Segurança dos Dados
                </h2>
                <p className="text-gray-300 mb-4">
                  Implementamos medidas técnicas e organizacionais para proteger seus dados:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Criptografia SSL/TLS em todas as transmissões de dados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Servidores protegidos com firewall e sistemas de segurança atualizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Acesso restrito aos dados apenas por pessoal autorizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0890F8] mt-1">•</span>
                    <span>Backups regulares e procedimentos de recuperação de dados</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Alterações na Política */}
          <section className="bg-[#0b1229] rounded-lg p-6 border border-[#0890F8]/20">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              Alterações nesta Política
            </h2>
            <p className="text-gray-300">
              Esta política pode ser atualizada periodicamente para refletir mudanças em nossas
              práticas ou requisitos legais. A data da última atualização será sempre indicada
              no topo desta página. Recomendamos revisar esta política regularmente.
            </p>
          </section>

          {/* Contato */}
          <section className="bg-gradient-to-r from-[#0890F8]/10 to-[#199FFF]/10 rounded-lg p-6 border border-[#0890F8]/30">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              Dúvidas sobre Privacidade?
            </h2>
            <p className="text-gray-300 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de
              seus dados pessoais, entre em contato:
            </p>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-[#0890F8]">E-mail:</strong>{" "}
                <a
                  href="mailto:contato@cioli.dev"
                  className="hover:text-[#0890F8] underline"
                >
                  contato@cioli.dev
                </a>
              </p>
              <p>
                <strong className="text-[#0890F8]">Responsável:</strong> Cioli Dev
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
