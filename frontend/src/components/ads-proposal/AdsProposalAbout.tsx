import { FaBullseye, FaChartLine, FaFacebookF, FaInstagram, FaUsers } from "react-icons/fa";
import { SiMeta } from "react-icons/si";
import bannerSobre from "@/assets/images/bannersobre.png";

export default function AdsProposalAbout() {
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
              Quem Somos
            </p>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">Sobre a CIOLI</h2>
        </header>

        <div className="z-10 flex h-full w-full flex-col gap-8 pb-4 md:flex-row md:gap-12 md:pb-6">
          <div className="flex w-full flex-col justify-center space-y-8 md:w-1/2 md:pr-4">
            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-blue-700 bg-blue-900/50 shadow-lg transition-colors group-hover:bg-blue-800">
                <FaBullseye className="text-xl text-blue-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                  Estrategia e Performance
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Somos uma empresa focada em estrategias digitais robustas e
                  performance online mensuravel, garantindo que cada acao tenha
                  um proposito claro de crescimento para o seu negocio.
                </p>
              </div>
            </article>

            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-purple-700 bg-purple-900/50 shadow-lg transition-colors group-hover:bg-purple-800">
                <SiMeta className="text-xl text-purple-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                  Especialistas em Meta Ads
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Dominamos o ecossistema do Facebook e Instagram Ads. Criamos
                  campanhas segmentadas que atingem o publico certo no momento
                  ideal de compra.
                </p>
              </div>
            </article>

            <article className="group flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-indigo-700 bg-indigo-900/50 shadow-lg transition-colors group-hover:bg-indigo-800">
                <FaUsers className="text-xl text-indigo-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-300">
                  Leads Qualificados
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Nosso foco nao e apenas atrair cliques, mas sim conectar sua
                  empresa a potenciais clientes prontos para fechar negocio,
                  aumentando sua taxa de conversao.
                </p>
              </div>
            </article>

          </div>

          <div className="relative flex w-full items-center justify-center pb-2 md:w-1/2 md:pb-10">
            <div className="group relative h-96 w-full overflow-hidden rounded-2xl border border-gray-700 shadow-2xl sm:h-112 md:h-5/6">
              <img
                src={bannerSobre.src}
                alt="Strategic planning team"
                className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
              />

              <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0 sm:p-6 md:translate-y-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                        Missao
                      </p>
                      <p className="text-lg font-bold leading-tight text-white">
                        Impulsionar Negocios Digitais
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500/20 p-2">
                      <FaChartLine className="text-xl text-green-400" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-300">
                    <span>ROI Focado</span>
                    <span>Resultados Reais</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full w-3/4 bg-blue-500" />
                  </div>
                </article>
              </div>
            </div>

            <div
              className="absolute -right-2 top-16 z-20 hidden rounded-xl bg-linear-to-br from-purple-600 to-pink-600 p-3 shadow-lg animate-bounce sm:block"
              style={{ animationDuration: "3s" }}
            >
              <FaInstagram className="text-2xl text-white" />
            </div>
            <div
              className="absolute -left-2 bottom-24 z-20 hidden rounded-xl bg-linear-to-br from-blue-600 to-blue-800 p-3 shadow-lg animate-bounce sm:block md:-left-6 md:bottom-32"
              style={{ animationDuration: "4s" }}
            >
              <FaFacebookF className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
