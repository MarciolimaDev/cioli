import {
  FaBullhorn,
  FaInfoCircle,
  FaLaptopCode,
  FaWallet,
  FaWhatsapp,
} from "react-icons/fa";

type NoteItem = {
  id: string;
  title: string;
  description: string;
};

function Note({ id, title, description }: NoteItem) {
  return (
    <li className="flex gap-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
        <span className="text-sm font-bold text-blue-400">{id}</span>
      </div>
      <div>
        <h4 className="mb-1 text-sm font-semibold text-white">{title}</h4>
        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
      </div>
    </li>
  );
}

export default function AdsProposalInvestmentNotes() {
  const notes: NoteItem[] = [
    {
      id: "1",
      title: "Pagamento da Plataforma",
      description:
        "A configuracao de cobranca e feita no cartao de credito da cliente diretamente no Business Manager da Meta.",
    },
    {
      id: "2",
      title: "Relatorios e Acompanhamento",
      description:
        "A gestao inclui o monitoramento constante das campanhas e envio de relatorio basico de desempenho mensal para alinhar estrategias.",
    },
    {
      id: "3",
      title: "Otimizacao Continua",
      description:
        "Testamos diferentes criativos e publicos ao longo do mes para garantir o melhor custo por resultado possivel.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-200 w-200 rounded-full bg-blue-900/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 h-150 w-150 rounded-full bg-purple-900/20 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-10 pt-10 sm:px-6 md:min-h-180 md:px-16 md:pb-12 md:pt-12">
        <header className="w-full pb-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-blue-500" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-400">
              Detalhes Finais
            </p>
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Investimento e Observacoes
          </h2>
        </header>

        <div className="flex flex-1 flex-col gap-6 pb-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-6 md:w-1/2">
            <article className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 backdrop-blur-xl sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-blue-500/10" />
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-blue-400 sm:mb-4 sm:h-12 sm:w-12">
                  <FaWallet className="text-2xl" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">Verba de Anuncios</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">
                    O valor investido em midia (anuncios) nao esta incluso nos
                    valores de gestao desta proposta. O pagamento e feito
                    diretamente a plataforma Meta.
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-blue-500/30 bg-blue-900/30 p-4 sm:p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                  Recomendacao Inicial
                </p>
                <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                  <span className="text-3xl font-bold text-white sm:text-4xl">R$ 20</span>
                  <span className="mb-1 text-lg text-gray-400">a</span>
                  <span className="text-3xl font-bold text-white sm:text-4xl">R$ 40</span>
                  <span className="mb-2 ml-1 text-sm text-gray-400">/ dia</span>
                </div>
                <p className="mt-2 text-xs text-blue-200/80">
                  Para obter melhores resultados e aprendizado da campanha.
                </p>
              </div>
            </article>

            <article className="flex-1 rounded-2xl border border-white/10 bg-slate-800/60 p-5 backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FaBullhorn className="text-xl text-purple-400" />
                <h3 className="text-lg font-bold text-white">Canais de Captacao</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <FaWhatsapp className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">WhatsApp</p>
                    <p className="text-xs text-gray-400">Contato Direto</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <FaLaptopCode className="text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Landing Page</p>
                    <p className="text-xs text-gray-400">Conversao</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="flex w-full md:w-1/2">
            <article className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-slate-800/60 p-5 backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                <FaInfoCircle className="text-xl text-gray-400" />
                <h3 className="text-lg font-bold text-white">Informacoes Importantes</h3>
              </div>

              <ul className="flex-1 space-y-6">
                {notes.map((note) => (
                  <Note
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                  />
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
