"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCheck,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

type FinancePayload = {
  summary: {
    clients_count: number;
    projects_count: number;
    installments_count: number;
    total_billed: string;
    total_received: string;
    total_pending: string;
    total_overdue: string;
    total_due_today: string;
  };
  upcoming_installments: Array<{
    id: number;
    hash: string;
    project_title: string;
    client_name: string;
    client_company_name: string;
    amount: string;
    due_date: string;
    is_overdue: boolean;
  }>;
};

const emptyFinance: FinancePayload = {
  summary: {
    clients_count: 0,
    projects_count: 0,
    installments_count: 0,
    total_billed: "0.00",
    total_received: "0.00",
    total_pending: "0.00",
    total_overdue: "0.00",
    total_due_today: "0.00",
  },
  upcoming_installments: [],
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function isDueToday(value: string) {
  const today = new Date();
  const todayValue = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .slice(0, 10);

  return value === todayValue;
}

function installmentCardClasses(isOverdue: boolean, dueToday: boolean) {
  if (isOverdue) {
    return "rounded-xl border border-[#f23d5c]/30 bg-[#fff1f3] p-4";
  }

  if (dueToday) {
    return "rounded-xl border border-[#f5b700]/35 bg-[#fff8db] p-4";
  }

  return "rounded-xl bg-[#f7f9fb] p-4";
}

export default function AdminPage() {
  const [finance, setFinance] = useState<FinancePayload>(emptyFinance);
  const [updatingInstallmentId, setUpdatingInstallmentId] = useState<number | null>(null);

  async function loadData() {
    const response = await fetch("/api/finance-summary", { cache: "no-store" });
    const data = await response.json().catch(() => emptyFinance);
    setFinance(data?.summary ? data : emptyFinance);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleMarkAsPaid(installmentId: number, amount: string) {
    setUpdatingInstallmentId(installmentId);

    try {
      await fetch(`/api/project-installments/${installmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid_amount: amount,
          paid_at: new Date().toISOString().slice(0, 10),
        }),
      });
      await loadData();
    } finally {
      setUpdatingInstallmentId(null);
    }
  }

  const progress = Math.min(
    Math.round(
      (Number(finance.summary.total_received || 0) /
        Math.max(Number(finance.summary.total_billed || 0), 1)) *
        100,
    ),
    100,
  );

  return (
    <AdminShell
      title="Dashboard"
      description="Visao geral dos modulos administrativos do frontend."
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <article className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <CreditCard className="h-14 w-14 text-[#131b2e]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Total recebido
          </p>
          <div className="mt-4 flex items-end gap-2">
            <h3 className="text-4xl font-black tracking-tight text-[#131b2e]">
              {formatCurrency(finance.summary.total_received)}
            </h3>
            <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-[#006c49]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +12.5%
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Total pago nas parcelas ja registradas.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Bell className="h-14 w-14 text-[#131b2e]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Pendente
          </p>
          <div className="mt-4 flex items-end gap-2">
            <h3 className="text-4xl font-black tracking-tight text-[#131b2e]">
              {formatCurrency(finance.summary.total_pending)}
            </h3>
            <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-[#f23d5c]">
              <ArrowDownRight className="h-3.5 w-3.5" />
              -4.2%
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {finance.upcoming_installments.length} fatura(s) aguardando pagamento.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-[#131b2e] p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 p-4 opacity-20">
            <LayoutDashboard className="h-14 w-14 text-white" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#6ffbbe]">
            Faturamento bruto
          </p>
          <div className="mt-4 flex items-end gap-2">
            <h3 className="text-4xl font-black tracking-tight">
              {formatCurrency(finance.summary.total_billed)}
            </h3>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Meta mensal: {progress}% atingida
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#6ffbbe]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Modulos
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["Clientes", "Cadastro e relacionamento comercial."],
              ["Cobrancas", "Projetos financeiros e parcelas."],
              ["Portfolio", "Projetos publicados e tecnologias."],
              ["Mensagens", "Inbox e solicitacoes comerciais."],
              ["Gestao", "Categorias, formacoes e conteudos institucionais."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-xl bg-[#f7f9fb] p-5">
                <h4 className="text-lg font-black text-[#131b2e]">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </article>

        <aside className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Proximas cobrancas
          </p>
          <div className="mt-5 space-y-3">
            {finance.upcoming_installments.length > 0 ? (
              finance.upcoming_installments.slice(0, 5).map((item) => {
                const dueToday = !item.is_overdue && isDueToday(item.due_date);

                return (
                <article
                  key={item.hash}
                  className={installmentCardClasses(item.is_overdue, dueToday)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">
                        {item.client_company_name || item.client_name}
                      </h4>
                      <p
                        className={`mt-1 text-xs ${
                          item.is_overdue
                            ? "text-[#b42318]"
                            : dueToday
                              ? "text-[#9a6700]"
                              : "text-slate-500"
                        }`}
                      >
                        {item.project_title}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        item.is_overdue
                          ? "bg-[#40000d] text-[#f23d5c]"
                          : dueToday
                            ? "bg-[#fff1c2] text-[#9a6700]"
                            : "bg-[#eefcf5] text-[#006c49]"
                      }`}
                    >
                      {item.is_overdue ? "Urgente" : dueToday ? "Vence hoje" : "Aberta"}
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      item.is_overdue
                        ? "text-[#7a0019]"
                        : dueToday
                          ? "text-[#7a5d00]"
                          : "text-[#131b2e]"
                    }`}
                  >
                    {formatCurrency(item.amount)}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      item.is_overdue
                        ? "font-semibold text-[#b42318]"
                        : dueToday
                          ? "font-semibold text-[#9a6700]"
                          : "text-slate-500"
                    }`}
                  >
                    Vencimento em {formatDate(item.due_date)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(item.id, item.amount)}
                    disabled={updatingInstallmentId === item.id}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#131b2e] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1e2942] disabled:opacity-60"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    {updatingInstallmentId === item.id ? "Baixando" : "Dar baixa"}
                  </button>
                </article>
              )})
            ) : (
              <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm leading-6 text-slate-600">
                Nenhuma cobranca em aberto no momento.
              </p>
            )}
          </div>
        </aside>
      </section>
    </AdminShell>
  );
}
