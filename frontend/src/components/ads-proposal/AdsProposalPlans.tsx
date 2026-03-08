import { FaCheck } from "react-icons/fa";

type PlanItem = {
  text: string;
};

type PlanCardProps = {
  accent: "blue" | "purple";
  badge?: string;
  label: string;
  title: string;
  subtitle: string;
  items: PlanItem[];
  setupLabel: string;
  setupPrice: string;
  monthlyLabel: string;
  monthlyPrice: string;
  highlighted?: boolean;
};

function PlanCard({
  accent,
  badge,
  label,
  title,
  subtitle,
  items,
  setupLabel,
  setupPrice,
  monthlyLabel,
  monthlyPrice,
  highlighted,
}: PlanCardProps) {
  const accentClasses =
    accent === "blue"
      ? {
          top: "bg-blue-500",
          label: "text-blue-400",
          iconBg: "bg-blue-900",
          iconText: "text-blue-400",
          cardHover: "hover:border-blue-500",
          footerBg: "bg-gray-800/30",
          monthly: "text-blue-400",
        }
      : {
          top: "bg-purple-500",
          label: "text-purple-400",
          iconBg: "bg-purple-900",
          iconText: "text-purple-400",
          cardHover: "hover:border-purple-500",
          footerBg: "bg-purple-900/20",
          monthly: "text-purple-400",
        };

  return (
    <article
      className={[
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 sm:p-8",
        highlighted
          ? "z-20 border-purple-400/50 bg-slate-800/90 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
          : "border-white/10 bg-slate-800/70",
        accentClasses.cardHover,
      ].join(" ")}
    >
      <div className={["absolute left-0 top-0 h-1 w-full", accentClasses.top].join(" ")} />

      {badge ? (
        <div className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
          <p>{badge}</p>
        </div>
      ) : null}

      <div className="mb-6 border-b border-gray-700 pb-4">
        <p className={["mb-1 text-sm font-bold uppercase tracking-[0.2em]", accentClasses.label].join(" ")}>
          {label}
        </p>
        <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
        <p className="mt-1 text-sm italic text-gray-400">{subtitle}</p>
      </div>

      <div className="flex-1">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.text} className="flex items-start">
              <span
                className={[
                  "mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  accentClasses.iconBg,
                ].join(" ")}
              >
                <FaCheck className={["text-[10px]", accentClasses.iconText].join(" ")} />
              </span>
              <p className="text-sm text-gray-300">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={[
          "-mb-5 -mx-5 mt-6 border-t border-gray-700 px-5 py-4 sm:-mb-8 sm:-mx-8 sm:px-8 sm:py-6",
          accentClasses.footerBg,
        ].join(" ")}
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs uppercase text-gray-400">{setupLabel}</p>
            <p className="text-lg font-bold text-white sm:text-xl">{setupPrice}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs uppercase text-gray-400">{monthlyLabel}</p>
            <p className={["text-2xl font-extrabold sm:text-3xl", accentClasses.monthly].join(" ")}>
              {monthlyPrice}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdsProposalPlans() {
  const plan1: PlanItem[] = [
    { text: "Diagnostico da estrutura atual de anuncios" },
    { text: "Planejamento estrategico de campanhas" },
    { text: "Criacao de criativos para anuncios" },
    { text: "Configuracao e publicacao das campanhas" },
    { text: "Monitoramento e otimizacao continua" },
    { text: "Relatorio basico de desempenho" },
  ];

  const plan2: PlanItem[] = [
    { text: "Criacao/configuracao Instagram e Facebook" },
    { text: "Configuracao Business Manager e Conta de Anuncios" },
    { text: "Configuracao do Pixel e integracoes" },
    { text: "Criacao e gestao de campanhas Meta Ads" },
    { text: "Criacao de criativos e otimizacoes continuas" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-150 w-150 rounded-full bg-blue-900/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-150 w-150 rounded-full bg-purple-900/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-10 pt-10 sm:px-6 md:min-h-180 md:px-16 md:pb-12 md:pt-12">
        <header className="mb-8 w-full">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-blue-500" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-400">
              Nossos Servicos
            </p>
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Planos de Servico - Comparativo
          </h2>
          <p className="mt-2 text-base text-gray-400 md:text-lg">
            Escolha a estrategia ideal para o momento do seu negocio
          </p>
        </header>

        <div className="flex flex-1 flex-col items-stretch justify-center gap-6 pb-4 md:flex-row md:gap-10">
          <div className="flex w-full md:w-1/2">
            <PlanCard
              accent="blue"
              label="Opcao Inicial"
              title="Plano 1 - Gestao de Trafego"
              subtitle="Para quem ja possui estrutura pronta"
              items={plan1}
              setupLabel="Configuração Inicial"
              setupPrice="R$ 300"
              monthlyLabel="Gestao Mensal"
              monthlyPrice="R$ 600"
            />
          </div>

          <div className="flex w-full md:w-1/2">
            <PlanCard
              accent="purple"
              badge="Recomendado"
              label="Solucao Completa"
              title="Plano 2 - Estrutura + Gestao"
              subtitle="Configuração completa de redes e ferramentas"
              items={plan2}
              setupLabel="Configuração completa"
              setupPrice="R$ 750"
              monthlyLabel="Gestao Mensal"
              monthlyPrice="R$ 600"
              highlighted
            />
          </div>
        </div>
      </div>
    </section>
  );
}
