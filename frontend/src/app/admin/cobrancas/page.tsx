"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { CheckCheck } from "lucide-react";

type ClientItem = {
  id: number;
  name: string;
  company_name: string | null;
  email: string;
};

type InstallmentItem = {
  id: number;
  hash: string;
  project_title: string;
  client_name: string;
  client_company_name: string;
  installment_number: number;
  amount: string;
  due_date: string;
  paid_amount: string | null;
  paid_at: string | null;
  is_paid: boolean;
  is_overdue: boolean;
};

type FinancePayload = {
  upcoming_installments: InstallmentItem[];
  recent_payments: InstallmentItem[];
};

type RevenueFormState = {
  existingClientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  projectTitle: string;
  serviceType: string;
  totalAmount: string;
  installmentsCount: string;
  startDate: string;
  firstDueDate: string;
  markFirstAsPaid: boolean;
  firstPaidAt: string;
};

const defaultRevenueForm = (): RevenueFormState => ({
  existingClientId: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  companyName: "",
  projectTitle: "",
  serviceType: "",
  totalAmount: "",
  installmentsCount: "2",
  startDate: new Date().toISOString().slice(0, 10),
  firstDueDate: new Date().toISOString().slice(0, 10),
  markFirstAsPaid: true,
  firstPaidAt: new Date().toISOString().slice(0, 10),
});

const emptyFinance: FinancePayload = {
  upcoming_installments: [],
  recent_payments: [],
};

function addMonthsToDate(dateValue: string, monthsToAdd: number) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date.toISOString().slice(0, 10);
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "number" ? value : Number(value || 0));
}

function formatDate(value: string | null) {
  if (!value) return "--";
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

export default function AdminCobrancasPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [finance, setFinance] = useState<FinancePayload>(emptyFinance);
  const [form, setForm] = useState<RevenueFormState>(defaultRevenueForm);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatingInstallmentId, setUpdatingInstallmentId] = useState<number | null>(null);

  async function loadPageData() {
    const [clientsResponse, financeResponse] = await Promise.all([
      fetch("/api/clients", { cache: "no-store" }),
      fetch("/api/finance-summary", { cache: "no-store" }),
    ]);
    const clientsData = await clientsResponse.json().catch(() => []);
    const financeData = await financeResponse.json().catch(() => emptyFinance);
    setClients(Array.isArray(clientsData) ? clientsData : []);
    setFinance({
      upcoming_installments: Array.isArray(financeData.upcoming_installments)
        ? financeData.upcoming_installments
        : [],
      recent_payments: Array.isArray(financeData.recent_payments)
        ? financeData.recent_payments
        : [],
    });
  }

  useEffect(() => {
    loadPageData();
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
      await loadPageData();
    } finally {
      setUpdatingInstallmentId(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let clientId = Number(form.existingClientId || 0);

      if (!clientId) {
        const clientResponse = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.clientName,
            company_name: form.companyName || null,
            email: form.clientEmail,
            phone: form.clientPhone || null,
            status: "active",
            notes: "",
          }),
        });

        const clientData = await clientResponse.json().catch(() => ({}));

        if (!clientResponse.ok || !clientData?.id) {
          throw new Error("Nao foi possivel criar a cliente.");
        }

        clientId = Number(clientData.id);
      }

      const projectResponse = await fetch("/api/client-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: clientId,
          title: form.projectTitle,
          description: "",
          service_type: form.serviceType || null,
          agreed_amount: form.totalAmount,
          installments_count: Number(form.installmentsCount || 1),
          start_date: form.startDate,
          status: "active",
        }),
      });

      const projectData = await projectResponse.json().catch(() => ({}));

      if (!projectResponse.ok || !projectData?.id) {
        throw new Error("Nao foi possivel criar o projeto financeiro.");
      }

      const totalAmount = Number(form.totalAmount || 0);
      const installmentsCount = Math.max(Number(form.installmentsCount || 1), 1);
      const installmentAmount = (totalAmount / installmentsCount).toFixed(2);

      for (let index = 0; index < installmentsCount; index += 1) {
        const first = index === 0;
        const response = await fetch("/api/project-installments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project: projectData.id,
            installment_number: index + 1,
            description: `${form.projectTitle} - parcela ${index + 1}`,
            amount: installmentAmount,
            due_date: addMonthsToDate(form.firstDueDate, index),
            paid_amount: first && form.markFirstAsPaid ? installmentAmount : null,
            paid_at: first && form.markFirstAsPaid ? form.firstPaidAt : null,
            notes: "",
          }),
        });

        if (!response.ok) {
          throw new Error(`Nao foi possivel criar a parcela ${index + 1}.`);
        }
      }

      setForm(defaultRevenueForm());
      setMessage("Receita cadastrada com sucesso pelo frontend.");
      await loadPageData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao cadastrar receita.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="Cobrancas"
      description="Cadastre receitas, projetos financeiros e parcelas pelo painel."
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Nova receita
          </p>
          <div className="mt-5 grid gap-4">
            <select
              value={form.existingClientId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  existingClientId: event.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none"
            >
              <option value="">Criar nova cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.company_name || client.name}
                </option>
              ))}
            </select>
            <input value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} disabled={Boolean(form.existingClientId)} placeholder="Nome da cliente" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none disabled:opacity-50" />
            <input type="email" value={form.clientEmail} onChange={(event) => setForm((current) => ({ ...current, clientEmail: event.target.value }))} disabled={Boolean(form.existingClientId)} placeholder="Email" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none disabled:opacity-50" />
            <input value={form.clientPhone} onChange={(event) => setForm((current) => ({ ...current, clientPhone: event.target.value }))} disabled={Boolean(form.existingClientId)} placeholder="Telefone" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none disabled:opacity-50" />
            <input value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} disabled={Boolean(form.existingClientId)} placeholder="Empresa" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none disabled:opacity-50" />
            <input value={form.projectTitle} onChange={(event) => setForm((current) => ({ ...current, projectTitle: event.target.value }))} placeholder="Servico / projeto" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <input value={form.serviceType} onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))} placeholder="Tipo de servico" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <input type="number" min="0" step="0.01" value={form.totalAmount} onChange={(event) => setForm((current) => ({ ...current, totalAmount: event.target.value }))} placeholder="Valor total" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <input type="number" min="1" step="1" value={form.installmentsCount} onChange={(event) => setForm((current) => ({ ...current, installmentsCount: event.target.value }))} placeholder="Parcelas" className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <input type="date" value={form.firstDueDate} onChange={(event) => setForm((current) => ({ ...current, firstDueDate: event.target.value }))} className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none" />
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm">
              <input type="checkbox" checked={form.markFirstAsPaid} onChange={(event) => setForm((current) => ({ ...current, markFirstAsPaid: event.target.checked }))} />
              Primeira parcela ja foi paga
            </label>
            <input type="date" value={form.firstPaidAt} onChange={(event) => setForm((current) => ({ ...current, firstPaidAt: event.target.value }))} disabled={!form.markFirstAsPaid} className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none disabled:opacity-50" />
          </div>
          {message ? <p className="mt-4 rounded-xl bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e]">{message}</p> : null}
          <button type="submit" disabled={saving} className="mt-5 rounded-xl bg-[#131b2e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e2942] disabled:opacity-60">{saving ? "Salvando..." : "Salvar receita"}</button>
        </form>

        <div className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Parcelas em aberto
            </p>
            <div className="mt-5 space-y-3">
              {finance.upcoming_installments.length > 0 ? (
                finance.upcoming_installments.map((item) => {
                  const dueToday = !item.is_overdue && isDueToday(item.due_date);

                  return (
                  <article
                    key={item.hash}
                    className={installmentCardClasses(item.is_overdue, dueToday)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#131b2e]">
                          {item.client_company_name || item.client_name}
                        </h3>
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
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${item.is_overdue ? "bg-[#40000d] text-[#f23d5c]" : dueToday ? "bg-[#fff1c2] text-[#9a6700]" : "bg-[#eefcf5] text-[#006c49]"}`}>{item.is_overdue ? "Urgente" : dueToday ? "Vence hoje" : "Aberta"}</span>
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
                      Parcela {item.installment_number} - {formatCurrency(item.amount)}
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
                      Vence em {formatDate(item.due_date)}
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
                <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-slate-600">
                  Nenhuma parcela em aberto.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Pagamentos recentes
            </p>
            <div className="mt-5 space-y-3">
              {finance.recent_payments.length > 0 ? (
                finance.recent_payments.map((item) => (
                  <article key={item.hash} className="rounded-xl bg-[#f7f9fb] p-4">
                    <h3 className="text-sm font-bold text-[#131b2e]">
                      {item.client_company_name || item.client_name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.project_title}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#131b2e]">
                      {formatCurrency(item.paid_amount || item.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pago em {formatDate(item.paid_at)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-slate-600">
                  Nenhum pagamento recente.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
