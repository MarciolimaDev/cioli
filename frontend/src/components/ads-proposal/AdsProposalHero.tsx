import { FaChartLine, FaFacebookF, FaInstagram, FaUserPlus } from "react-icons/fa";

export default function AdsProposalHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute -right-44 -top-44 h-168 w-2xl rounded-full bg-blue-900/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-28 h-112 w-md rounded-full bg-indigo-900/30"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col md:min-h-180 md:flex-row">
        <div className="flex w-full flex-col justify-center px-5 py-12 sm:px-6 sm:py-16 md:w-7/12 md:px-16">

          <div className="mb-10">
            <div className="mb-4 inline-block rounded-full border border-blue-500 bg-blue-900/30 px-3 py-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                Estrategia Digital
              </p>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Gestao de <br />
              <span className="text-blue-500">Trafego Pago</span>
            </h1>

            <p className="max-w-lg text-base font-light text-gray-300 sm:text-lg md:text-xl">
              Atraia novos clientes e aumente suas vendas com campanhas de alta
              performance no Meta Ads.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-3 sm:mb-14 sm:flex sm:flex-wrap sm:gap-4 md:gap-8">
            <article className="group w-full rounded-lg border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/60 hover:bg-pink-500/10 sm:w-28 sm:p-4">
              <FaInstagram className="mx-auto mb-2 text-3xl text-pink-500 transition-transform duration-300 group-hover:scale-110" />
              <p className="text-xs font-semibold text-gray-200 transition-colors duration-300 group-hover:text-pink-200">
                Instagram
              </p>
            </article>

            <article className="group w-full rounded-lg border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-blue-500/10 sm:w-28 sm:p-4">
              <FaFacebookF className="mx-auto mb-2 text-3xl text-blue-500 transition-transform duration-300 group-hover:scale-110" />
              <p className="text-xs font-semibold text-gray-200 transition-colors duration-300 group-hover:text-blue-200">
                Facebook
              </p>
            </article>

            <article className="group col-span-2 mx-auto w-full max-w-48 rounded-lg border border-white/20 bg-white/10 p-3 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:bg-green-500/10 sm:col-auto sm:mx-0 sm:w-28 sm:max-w-none sm:p-4">
              <FaChartLine className="mx-auto mb-2 text-3xl text-green-400 transition-transform duration-300 group-hover:scale-110" />
              <p className="text-xs font-semibold text-gray-200 transition-colors duration-300 group-hover:text-green-200">
                Estrategia
              </p>
            </article>
          </div>

        </div>

        <div className="relative h-80 w-full overflow-hidden bg-gray-900 sm:h-96 md:h-auto md:w-5/12 md:overflow-visible">
          <img
            src="https://page.gensparksite.com/slides_images/52ac111220cc0215a6a5e936d389e9b8.webp"
            alt="Dashboard de analytics"
            className="h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-blue-900/40" />
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-blue-500/20" />
          <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gray-900/60" />

          <article className="absolute bottom-4 left-4 right-4 z-20 rounded-lg border-l-8 border-blue-600 bg-white p-4 text-gray-800 shadow-2xl sm:bottom-8 sm:left-6 sm:right-auto sm:w-72 sm:p-6 md:bottom-20 md:-left-16">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">Objetivo</p>
                <h3 className="text-lg font-bold leading-tight">Geracao de Leads</h3>
              </div>
              <span className="rounded-full bg-green-100 p-2">
                <FaUserPlus className="text-green-600" />
              </span>
            </div>

            <div className="mb-1 mt-2 h-1.5 w-full rounded-full bg-gray-200">
              <div className="h-1.5 w-[85%] rounded-full bg-blue-600" />
            </div>
            <p className="text-right text-xs text-gray-400">Estrategia otimizada</p>
          </article>
        </div>
      </div>
    </section>
  );
}
