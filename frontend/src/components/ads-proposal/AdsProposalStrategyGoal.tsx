import { FaBullseye, FaCalendarCheck, FaInstagram, FaUserPlus, FaWhatsapp } from "react-icons/fa";

export default function AdsProposalStrategyGoal() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-20 h-64 w-64 rounded-full bg-purple-600/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 pb-10 pt-12 sm:px-6 md:min-h-180 md:px-16 md:pb-12 md:pt-12">
        <header className="z-20 mb-10 md:mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-blue-500" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-400">
              Estrategia Digital
            </p>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Objetivo da Estrategia
          </h2>
        </header>

        <div className="z-10 flex h-full w-full flex-col gap-8 pb-4 md:flex-row md:gap-12 md:pb-6">
          <div className="flex w-full flex-col justify-center space-y-8 md:w-1/2 md:pr-4">
            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-blue-700 bg-blue-900/50 shadow-lg transition-colors group-hover:bg-blue-800">
                <FaBullseye className="text-xl text-blue-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                  Segmentacao de Estetica
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Desenvolvemos campanhas altamente segmentadas para atingir
                  potenciais clientes com interesse especifico em procedimentos
                  de estetica avancada.
                </p>
              </div>
            </article>

            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-green-700 bg-green-900/50 shadow-lg transition-colors group-hover:bg-green-800">
                <FaWhatsapp className="text-xl text-green-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-green-300">
                  Direcionamento Inteligente
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Conduzimos os leads qualificados diretamente para o
                  atendimento via WhatsApp ou Landing Page, encurtando a
                  jornada de compra.
                </p>
              </div>
            </article>

            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-purple-700 bg-purple-900/50 shadow-lg transition-colors group-hover:bg-purple-800">
                <FaCalendarCheck className="text-xl text-purple-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                  Novos Pacientes
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  O foco final e aumentar o volume de agendamentos reais e
                  conquistar novos pacientes recorrentes atraves de criativos de
                  alta conversao.
                </p>
              </div>
            </article>

          </div>

          <div className="relative flex w-full items-center justify-center pb-2 md:w-1/2 md:pb-10">
            <div className="group relative h-96 w-full overflow-hidden rounded-2xl border border-gray-700 shadow-2xl sm:h-112 md:h-5/6">
              <img
                src="https://page.gensparksite.com/slides_images/3af880f446fb18896cb7aba519276f73.webp"
                alt="Digital strategy dashboard"
                className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
              />

              <div className="absolute inset-0 bg-gray-900/40" />
              <div className="absolute bottom-0 h-1/2 w-full bg-gray-900/60" />

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0 sm:p-6 md:translate-y-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                        Resultado Esperado
                      </p>
                      <p className="text-lg font-bold leading-tight text-white">
                        Crescimento de Agenda
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <FaUserPlus className="text-xl text-blue-400" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-300">
                    <span>Captacao de Leads</span>
                    <span>Alta Conversao</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full w-4/5 bg-green-500" />
                  </div>
                </article>
              </div>
            </div>

            <div
              className="absolute -right-2 top-16 z-20 hidden rounded-xl bg-purple-600 p-3 shadow-lg animate-bounce sm:block"
              style={{ animationDuration: "3s" }}
            >
              <FaInstagram className="text-2xl text-white" />
            </div>
            <div
              className="absolute -left-2 bottom-24 z-20 hidden rounded-xl bg-green-600 p-3 shadow-lg animate-bounce sm:block md:-left-6 md:bottom-32"
              style={{ animationDuration: "4s" }}
            >
              <FaWhatsapp className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
