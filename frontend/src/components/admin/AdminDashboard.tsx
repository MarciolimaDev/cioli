"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpenText,
  BriefcaseBusiness,
  ChevronRight,
  CreditCard,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareMore,
  PlusCircle,
  Search,
  Settings,
  ShieldUser,
  Sparkles,
  Tags,
  UserRound,
  Users,
} from "lucide-react";

const ADMIN_SESSION_KEY = "cioli-admin-session";

type SessionData = { email?: string };
type DashboardCollections = {
  aboutContent: unknown[];
  categories: unknown[];
  contactSubjects: unknown[];
  formations: unknown[];
  projects: unknown[];
  technologies: unknown[];
};
type FinanceSummary = {
  clients_count: number;
  projects_count: number;
  installments_count: number;
  total_billed: string;
  total_received: string;
  total_pending: string;
  total_overdue: string;
  total_due_today: string;
};
type FinanceInstallmentItem = {
  hash: string;
  project_title: string;
  client_name: string;
  client_company_name: string;
  installment_number: number;
  amount: string;
  due_date: string;
  paid_amount: string | null;
  paid_at: string | null;
  is_overdue: boolean;
};
type FinancePayload = {
  summary: FinanceSummary;
  upcoming_installments: FinanceInstallmentItem[];
  recent_payments: FinanceInstallmentItem[];
};
type ModuleItem = {
  title: string;
  description: string;
  count: number | null;
  status: "Ativo" | "Parcial" | "Pendente";
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  note: string;
};
type ClientItem = {
  id: number;
  name: string;
  company_name: string | null;
  email: string;
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

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, current: true },
  { label: "Billing", icon: CreditCard, current: false },
  { label: "Portfolio", icon: FolderKanban, current: false },
  { label: "Messages", icon: MessageSquareMore, current: false },
  { label: "Management", icon: ShieldUser, current: false },
];

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
  recent_payments: [],
};

const quickFeed = [
  { title: "Contact Messages", subtitle: "Falta listagem administrativa.", tone: "Pendente" },
  { title: "Service Requests", subtitle: "Formulario ativo, consulta ainda nao.", tone: "Parcial" },
  { title: "Financeiro", subtitle: "Clientes, projetos e parcelas ja possuem estrutura.", tone: "Ativo" },
];

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

const chartHeights = [36, 52, 44, 64, 72, 60];

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    typeof value === "number" ? value : Number(value || 0),
  );
const formatCount = (value: number | null) =>
  value === null ? "--" : new Intl.NumberFormat("pt-BR").format(value);
const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "--";
const monthLabel = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").slice(0, 3);
const clientLabel = (item: FinanceInstallmentItem) =>
  item.client_company_name || item.client_name || "Cliente";
const statusClasses = (status: ModuleItem["status"]) =>
  status === "Ativo"
    ? "border border-emerald-400/20 bg-emerald-400/15 text-emerald-700"
    : status === "Parcial"
      ? "border border-amber-300/20 bg-amber-400/15 text-amber-700"
      : "border border-slate-200 bg-slate-200/60 text-slate-500";

function addMonthsToDate(dateValue: string, monthsToAdd: number) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const router = useRouter();
  const session = useMemo<SessionData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionData;
    } catch {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [collections, setCollections] = useState<DashboardCollections>({
    aboutContent: [],
    categories: [],
    contactSubjects: [],
    formations: [],
    projects: [],
    technologies: [],
  });
  const [finance, setFinance] = useState<FinancePayload>(emptyFinance);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [revenueForm, setRevenueForm] = useState<RevenueFormState>(defaultRevenueForm);
  const [isSavingRevenue, setIsSavingRevenue] = useState(false);
  const [revenueMessage, setRevenueMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return void router.replace("/admin/login");
    let active = true;
    async function loadDashboardData() {
      try {
        const responses = await Promise.all([
          fetch("/api/about-content", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/contact-subjects", { cache: "no-store" }),
          fetch("/api/formations", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/technologies", { cache: "no-store" }),
          fetch("/api/finance-summary", { cache: "no-store" }),
        ]);
        const data = await Promise.all(responses.map((r, i) => r.json().catch(() => (i === 0 ? null : i === 6 ? emptyFinance : []))));
        if (!active) return;
        setCollections({
          aboutContent: data[0] ? [data[0]] : [],
          categories: Array.isArray(data[1]) ? data[1] : [],
          contactSubjects: Array.isArray(data[2]) ? data[2] : [],
          formations: Array.isArray(data[3]) ? data[3] : [],
          projects: Array.isArray(data[4]) ? data[4] : [],
          technologies: Array.isArray(data[5]) ? data[5] : [],
        });
        setFinance((data[6] as FinancePayload)?.summary ? (data[6] as FinancePayload) : emptyFinance);
        const clientsResponse = await fetch("/api/clients", { cache: "no-store" });
        const clientsData = await clientsResponse.json().catch(() => []);
        if (!active) return;
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch {
        if (!active) return;
        setCollections({ aboutContent: [], categories: [], contactSubjects: [], formations: [], projects: [], technologies: [] });
        setFinance(emptyFinance);
        setClients([]);
      }
    }
    loadDashboardData();
    return () => {
      active = false;
    };
  }, [router, session]);

  const modules = useMemo<ModuleItem[]>(() => [
    { title: "Clientes", description: "Base comercial para relacionamento e faturamento.", count: finance.summary.clients_count, status: "Ativo", icon: Users, accent: "from-[#9ad7ff] to-[#79aef2]", note: "Modelos e API financeira criados no backend." },
    { title: "Cobrancas", description: "Parcelas, vencimentos, pagamentos e inadimplencia.", count: finance.summary.installments_count, status: "Ativo", icon: CreditCard, accent: "from-[#d7ff69] to-[#79f2c7]", note: "Resumo financeiro ja alimenta o dashboard." },
    { title: "Projects", description: "Projetos publicados no portfolio.", count: collections.projects.length, status: "Ativo", icon: FolderKanban, accent: "from-[#ffcf7a] to-[#ff8f6b]", note: "CRUD disponivel no backend." },
    { title: "Technologys", description: "Tecnologias associadas aos projetos.", count: collections.technologies.length, status: "Ativo", icon: Sparkles, accent: "from-[#d3b8ff] to-[#8ea4ff]", note: "CRUD disponivel no backend." },
    { title: "Categories", description: "Classificacao base para tecnologias e organizacao.", count: collections.categories.length, status: "Ativo", icon: Tags, accent: "from-[#8ef9d2] to-[#48d2a0]", note: "CRUD disponivel no backend." },
    { title: "Formations", description: "Historico academico e certificacoes.", count: collections.formations.length, status: "Ativo", icon: BriefcaseBusiness, accent: "from-[#ffe28b] to-[#f6b75e]", note: "CRUD disponivel no backend." },
    { title: "About Contents", description: "Conteudo institucional do topo do site.", count: collections.aboutContent.length, status: "Parcial", icon: BookOpenText, accent: "from-[#8aa1ff] to-[#6173f3]", note: "Edicao ainda depende de endpoint." },
    { title: "Contact Subjects", description: "Assuntos usados em contato e solicitacao de servico.", count: collections.contactSubjects.length, status: "Parcial", icon: Mail, accent: "from-[#adb5c7] to-[#7b8498]", note: "Leitura disponivel no frontend." },
    { title: "Contact Messages", description: "Mensagens recebidas no formulario.", count: null, status: "Pendente", icon: MessageSquareMore, accent: "from-[#9ea7b8] to-[#64748b]", note: "A API atual aceita criacao, nao listagem." },
    { title: "Usuarios", description: "Acesso administrativo e permissoes.", count: null, status: "Pendente", icon: UserRound, accent: "from-[#b4bbc8] to-[#8e97a8]", note: "Sem endpoint administrativo no frontend." },
  ], [collections, finance.summary]);

  const filteredModules = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? modules.filter((m) => `${m.title} ${m.description} ${m.note}`.toLowerCase().includes(q)) : modules;
  }, [modules, searchTerm]);

  const overviewCards = [
    { label: "Total recebido", value: formatCurrency(finance.summary.total_received), caption: "Fluxo confirmado no periodo atual.", delta: "+12.5%", positive: true },
    { label: "Pendente", value: formatCurrency(finance.summary.total_pending), caption: `${finance.upcoming_installments.length} cobranca(s) aguardando pagamento.`, delta: "-4.2%", positive: false },
    { label: "Faturamento bruto", value: formatCurrency(finance.summary.total_billed), caption: `${finance.summary.projects_count} projeto(s) financeiros cadastrados.`, progress: Math.min(Math.round((Number(finance.summary.total_received || 0) / Math.max(Number(finance.summary.total_billed || 0), 1)) * 100), 100) },
  ];

  const chartData = useMemo(() => {
    const base = Math.max(Number(finance.summary.total_billed || 0), Number(finance.summary.total_received || 0), 1);
    const start = new Date();
    start.setDate(1);
    start.setMonth(start.getMonth() - 5);
    return chartHeights.map((h, i) => {
      const d = new Date(start);
      d.setMonth(start.getMonth() + i);
      return { label: monthLabel(d), projectedHeight: Math.min(h + 16, 88), actualHeight: Math.max(h, 24), projected: Math.round((base * (0.52 + i * 0.08)) / 6), actual: Math.round((base * (0.34 + i * 0.07)) / 6) };
    });
  }, [finance.summary.total_billed, finance.summary.total_received]);

  async function refreshFinanceAndClients() {
    const [financeResponse, clientsResponse] = await Promise.all([
      fetch("/api/finance-summary", { cache: "no-store" }),
      fetch("/api/clients", { cache: "no-store" }),
    ]);

    const financeData = await financeResponse.json().catch(() => emptyFinance);
    const clientsData = await clientsResponse.json().catch(() => []);

    setFinance(financeData?.summary ? financeData : emptyFinance);
    setClients(Array.isArray(clientsData) ? clientsData : []);
  }

  async function handleRevenueSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRevenueMessage(null);
    setIsSavingRevenue(true);

    try {
      let clientId = Number(revenueForm.existingClientId || 0);

      if (!clientId) {
        const clientResponse = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: revenueForm.clientName,
            company_name: revenueForm.companyName || null,
            email: revenueForm.clientEmail,
            phone: revenueForm.clientPhone || null,
            status: "active",
            notes: "",
          }),
        });

        const clientData = await clientResponse.json().catch(() => ({}));

        if (!clientResponse.ok || !clientData?.id) {
          throw new Error("Nao foi possivel criar o cliente.");
        }

        clientId = Number(clientData.id);
      }

      const projectResponse = await fetch("/api/client-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: clientId,
          title: revenueForm.projectTitle,
          description: "",
          service_type: revenueForm.serviceType || null,
          agreed_amount: revenueForm.totalAmount,
          installments_count: Number(revenueForm.installmentsCount || 1),
          start_date: revenueForm.startDate,
          status: "active",
        }),
      });

      const projectData = await projectResponse.json().catch(() => ({}));

      if (!projectResponse.ok || !projectData?.id) {
        throw new Error("Nao foi possivel criar o projeto financeiro.");
      }

      const totalAmount = Number(revenueForm.totalAmount || 0);
      const installmentsCount = Math.max(Number(revenueForm.installmentsCount || 1), 1);
      const installmentAmount = (totalAmount / installmentsCount).toFixed(2);

      for (let index = 0; index < installmentsCount; index += 1) {
        const isFirstInstallment = index === 0;
        const installmentResponse = await fetch("/api/project-installments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project: projectData.id,
            installment_number: index + 1,
            description: `${revenueForm.projectTitle} - parcela ${index + 1}`,
            amount: installmentAmount,
            due_date: addMonthsToDate(revenueForm.firstDueDate, index),
            paid_amount:
              isFirstInstallment && revenueForm.markFirstAsPaid ? installmentAmount : null,
            paid_at:
              isFirstInstallment && revenueForm.markFirstAsPaid
                ? revenueForm.firstPaidAt
                : null,
            notes: "",
          }),
        });

        if (!installmentResponse.ok) {
          throw new Error(`Nao foi possivel criar a parcela ${index + 1}.`);
        }
      }

      await refreshFinanceAndClients();
      setRevenueForm(defaultRevenueForm());
      setRevenueMessage("Receita cadastrada no painel com sucesso.");
    } catch (error) {
      setRevenueMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar a receita.",
      );
    } finally {
      setIsSavingRevenue(false);
    }
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto bg-[#131b2e] py-8 text-white shadow-[0_28px_80px_rgba(19,27,46,0.28)]">
        <div className="mb-10 flex items-center gap-3 px-6"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6ffbbe] text-[#131b2e]"><LayoutDashboard className="h-4 w-4" /></div><h1 className="text-2xl font-black tracking-tight">The Ledger</h1></div>
        <nav className="flex-1 space-y-1">{navigation.map(({ label, icon: Icon, current }) => <button key={label} type="button" className={`flex w-full items-center gap-3 px-6 py-3 text-left text-sm transition ${current ? "border-l-4 border-[#6ffbbe] bg-white/5 pl-5 text-[#6ffbbe]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4" /><span className="font-semibold">{label}</span></button>)}</nav>
        <div className="px-6 pb-6"><button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6ffbbe] px-4 py-3 text-sm font-bold text-[#131b2e] transition hover:bg-[#4edea3]"><PlusCircle className="h-4 w-4" />New Service Request</button></div>
        <div className="border-t border-white/10 pt-6">
          <button type="button" className="flex w-full items-center gap-3 px-6 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"><Settings className="h-4 w-4" />Settings</button>
          <button type="button" className="flex w-full items-center gap-3 px-6 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"><HelpCircle className="h-4 w-4" />Support</button>
          <div className="mt-4 px-6 text-sm"><p className="text-xs uppercase tracking-[0.28em] text-white/35">Sessao ativa</p><p className="mt-3 font-semibold text-white">{session.email || "administrador"}</p></div>
          <div className="px-6 pt-4"><button type="button" onClick={() => { sessionStorage.removeItem(ADMIN_SESSION_KEY); router.replace("/admin/login"); }} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"><LogOut className="h-4 w-4" />Sair</button></div>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between bg-white/80 px-5 shadow-sm backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-6">
          <div className="relative w-full min-w-[220px] max-w-xl"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search project metrics..." className="w-full rounded-full border-none bg-[#f2f4f6] py-2.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:shadow-[0_0_0_2px_rgba(190,198,224,0.55)]" /></div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-500 md:flex"><button type="button" className="transition hover:text-[#131b2e]">Projects</button><button type="button" className="transition hover:text-[#131b2e]">Users</button><button type="button" className="border-b-2 border-[#131b2e] pb-1 text-[#131b2e]">Billing</button></nav>
        </div>
        <div className="flex items-center gap-4 lg:gap-5">
          <button type="button" className="text-slate-500 transition hover:text-[#131b2e]"><Bell className="h-4 w-4" /></button>
          <button type="button" className="text-slate-500 transition hover:text-[#131b2e]"><Mail className="h-4 w-4" /></button>
          <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex"><div className="text-right"><p className="text-xs font-bold text-[#191c1e]">Executive Curator</p><p className="text-[10px] text-slate-500">Administrator</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e0e3e5] bg-[#131b2e] text-[#6ffbbe]"><ShieldUser className="h-4 w-4" /></div></div>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-5 pb-12 pt-24 lg:px-12">
        <section className="mb-10"><h2 className="text-4xl font-black tracking-tight text-[#131b2e]">Visao Geral Financeira</h2><p className="mt-2 text-sm text-[#7c839b]">Analise curada do desempenho de receita e fluxo de caixa.</p></section>

        <section className="mb-10 grid gap-6 xl:grid-cols-3">
          {overviewCards.map((card) => <article key={card.label} className={`rounded-xl p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)] ${"progress" in card ? "bg-[#131b2e] text-white" : "bg-white text-[#191c1e]"}`}><p className={`text-[11px] font-bold uppercase tracking-[0.28em] ${"progress" in card ? "text-[#6ffbbe]" : "text-slate-400"}`}>{card.label}</p><div className="mt-4 flex items-end gap-2"><h3 className="text-4xl font-black tracking-tight">{card.value}</h3>{"delta" in card ? <span className={`mb-1 inline-flex items-center gap-1 text-xs font-bold ${card.positive ? "text-[#006c49]" : "text-[#f23d5c]"}`}>{card.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{card.delta}</span> : null}</div><p className="mt-4 text-xs text-slate-400">{card.caption}</p>{"progress" in card ? <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#6ffbbe]" style={{ width: `${card.progress}%` }} /></div> : null}</article>)}
        </section>

        <section className="mb-10 rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
                Lancar receita
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-[#131b2e]">
                Cadastrar cliente, projeto e parcelas pelo frontend
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Exemplo: servico de R$ 600 em 2x, com a primeira parcela ja paga e a segunda pendente.
              </p>
            </div>
            <div className="rounded-xl bg-[#f7f9fb] px-4 py-3 text-sm text-slate-600">
              Clientes cadastrados: <span className="font-bold text-[#131b2e]">{clients.length}</span>
            </div>
          </div>

          <form onSubmit={handleRevenueSubmit} className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Cliente existente</span>
                <select value={revenueForm.existingClientId} onChange={(event) => setRevenueForm((current) => ({ ...current, existingClientId: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none focus:border-[#131b2e]/20">
                  <option value="">Criar nova cliente</option>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.company_name || client.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nome da cliente</span>
                <input value={revenueForm.clientName} onChange={(event) => setRevenueForm((current) => ({ ...current, clientName: event.target.value }))} disabled={Boolean(revenueForm.existingClientId)} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none disabled:opacity-50" placeholder="Ex.: Maria Silva" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email</span>
                <input type="email" value={revenueForm.clientEmail} onChange={(event) => setRevenueForm((current) => ({ ...current, clientEmail: event.target.value }))} disabled={Boolean(revenueForm.existingClientId)} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none disabled:opacity-50" placeholder="cliente@email.com" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Telefone</span>
                <input value={revenueForm.clientPhone} onChange={(event) => setRevenueForm((current) => ({ ...current, clientPhone: event.target.value }))} disabled={Boolean(revenueForm.existingClientId)} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none disabled:opacity-50" placeholder="(68) 99999-9999" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Empresa</span>
                <input value={revenueForm.companyName} onChange={(event) => setRevenueForm((current) => ({ ...current, companyName: event.target.value }))} disabled={Boolean(revenueForm.existingClientId)} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none disabled:opacity-50" placeholder="Opcional" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Servico</span>
                <input value={revenueForm.projectTitle} onChange={(event) => setRevenueForm((current) => ({ ...current, projectTitle: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" placeholder="Landing page, identidade visual..." />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Tipo de servico</span>
                <input value={revenueForm.serviceType} onChange={(event) => setRevenueForm((current) => ({ ...current, serviceType: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" placeholder="Ex.: Landing page" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Valor total</span>
                <input type="number" min="0" step="0.01" value={revenueForm.totalAmount} onChange={(event) => setRevenueForm((current) => ({ ...current, totalAmount: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" placeholder="600.00" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Parcelas</span>
                <input type="number" min="1" step="1" value={revenueForm.installmentsCount} onChange={(event) => setRevenueForm((current) => ({ ...current, installmentsCount: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" />
              </label>
            </div>

            <div className="grid gap-4 content-start">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Data de inicio</span>
                <input type="date" value={revenueForm.startDate} onChange={(event) => setRevenueForm((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Vencimento da 1a parcela</span>
                <input type="date" value={revenueForm.firstDueDate} onChange={(event) => setRevenueForm((current) => ({ ...current, firstDueDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none" />
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e]">
                <input type="checkbox" checked={revenueForm.markFirstAsPaid} onChange={(event) => setRevenueForm((current) => ({ ...current, markFirstAsPaid: event.target.checked }))} />
                Marcar a primeira parcela como paga
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Data do pagamento da 1a parcela</span>
                <input type="date" value={revenueForm.firstPaidAt} onChange={(event) => setRevenueForm((current) => ({ ...current, firstPaidAt: event.target.value }))} disabled={!revenueForm.markFirstAsPaid} className="w-full rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e] outline-none disabled:opacity-50" />
              </label>
              <div className="rounded-xl bg-[#131b2e] p-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#6ffbbe]">Como funciona</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">Ao salvar, o painel cria o cliente se necessario, depois cria o projeto financeiro e gera as parcelas automaticamente em intervalos mensais a partir da primeira data de vencimento.</p>
              </div>
              {revenueMessage ? <p className="rounded-xl bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e]">{revenueMessage}</p> : null}
              <button type="submit" disabled={isSavingRevenue} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6ffbbe] px-5 py-3 text-sm font-bold text-[#131b2e] transition hover:bg-[#4edea3] disabled:opacity-60">
                <PlusCircle className="h-4 w-4" />
                {isSavingRevenue ? "Salvando..." : "Salvar receita"}
              </button>
            </div>
          </form>
        </section>

        <section className="mb-10 grid gap-8 lg:grid-cols-3">
          <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)] lg:col-span-2">
            <div className="mb-8 flex items-center justify-between gap-4"><div><h3 className="text-xl font-bold text-[#131b2e]">Faturamento Mensal</h3><p className="text-sm text-slate-400">Projecao vs realizado dos ultimos 6 meses</p></div><div className="flex gap-2"><button type="button" className="rounded-md bg-[#f2f4f6] px-3 py-1 text-xs font-bold text-[#191c1e]">Mes</button><button type="button" className="rounded-md px-3 py-1 text-xs font-bold text-slate-400">Trimestre</button></div></div>
            <div className="flex h-64 items-end justify-between gap-4 px-2">{chartData.map((item) => <div key={item.label} className="flex flex-1 flex-col items-center"><div className="relative w-full rounded-t-lg bg-[#f2f4f6]" style={{ height: `${item.projectedHeight}%` }}><div className="absolute bottom-0 w-full rounded-t-lg bg-[#6ffbbe]/25" style={{ height: `${Math.max(item.projectedHeight - 10, 18)}%` }} /><div className="absolute bottom-0 w-full rounded-t-lg bg-[#131b2e] transition-colors hover:bg-[#6ffbbe]" style={{ height: `${item.actualHeight}%` }} /></div><span className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</span></div>)}</div>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-500"><div className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#131b2e]" />Receita recebida</div><div className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#6ffbbe]/70" />Projecao comercial</div></div>
          </article>

          <div className="space-y-6">
            <aside className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
              <div className="mb-5 flex items-center justify-between gap-4"><div><h3 className="text-lg font-bold text-[#131b2e]">Cobrancas</h3><p className="text-xs text-slate-400">Titulos mais urgentes</p></div><button type="button" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#131b2e]">Ver todos<ChevronRight className="h-3.5 w-3.5" /></button></div>
              <div className="space-y-3">{finance.upcoming_installments.slice(0, 4).length > 0 ? finance.upcoming_installments.slice(0, 4).map((item) => <article key={item.hash} className="rounded-xl bg-[#f7f9fb] px-4 py-3"><div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-bold text-[#131b2e]">{clientLabel(item)}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{item.project_title}</p></div><p className="text-sm font-bold text-[#131b2e]">{formatCurrency(item.amount)}</p></div><div className="mt-3 flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{formatDate(item.due_date)}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${item.is_overdue ? "bg-[#40000d] text-[#f23d5c]" : "bg-[#eefcf5] text-[#006c49]"}`}>{item.is_overdue ? "Urgente" : "Aberta"}</span></div></article>) : <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm leading-6 text-slate-600">Nenhuma cobranca em aberto ainda.</p>}</div>
            </aside>
            <aside className="rounded-xl bg-[#131b2e] p-5 text-white shadow-[0px_12px_32px_rgba(25,28,30,0.08)]"><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#6ffbbe]">Acao necessaria</p><h3 className="mt-3 text-lg font-black leading-tight">Voce possui {finance.upcoming_installments.length} cobranca(s) vencendo esta semana.</h3><button type="button" className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#131b2e] transition hover:bg-[#eff1f3]">Enviar lembretes</button></aside>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Operation stack</p><h3 className="mt-2 text-2xl font-black tracking-tight text-[#131b2e]">Modulos do administrativo</h3></div><p className="text-sm text-slate-500">{filteredModules.length} modulo(s) visiveis</p></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">{filteredModules.map(({ title, description, count, status, icon: Icon, accent, note }) => <article key={title} className="rounded-xl bg-[#f7f9fb] p-5"><div className="flex items-start justify-between gap-3"><div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-[#131b2e]`}><Icon className="h-4 w-4" /></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClasses(status)}`}>{status}</span></div><h4 className="mt-4 text-lg font-black text-[#131b2e]">{title}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p><div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Registros</p><p className="mt-1 text-2xl font-black text-[#131b2e]">{formatCount(count)}</p></div><ChevronRight className="h-4 w-4 text-slate-400" /></div><p className="mt-4 text-xs leading-5 text-slate-500">{note}</p></article>)}</div>
          </article>

          <div className="space-y-6">
            <aside className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Pagamentos recentes</p>
              <div className="mt-5 space-y-3">{finance.recent_payments.slice(0, 3).length > 0 ? finance.recent_payments.slice(0, 3).map((item) => <article key={item.hash} className="rounded-xl bg-[#f7f9fb] p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-bold text-[#131b2e]">{clientLabel(item)}</h4><p className="mt-1 text-xs text-slate-500">{item.project_title}</p></div><span className="rounded-full bg-[#eefcf5] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#006c49]">Pago</span></div><p className="mt-3 text-sm font-semibold text-[#131b2e]">{formatCurrency(item.paid_amount || item.amount)}</p><p className="mt-1 text-xs text-slate-500">Pago em {formatDate(item.paid_at)}</p></article>) : <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm leading-6 text-slate-600">Nenhum pagamento registrado ainda.</p>}</div>
            </aside>
            <aside className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Fila administrativa</p><div className="mt-5 space-y-3">{quickFeed.map((item) => <article key={item.title} className="rounded-xl bg-[#f7f9fb] p-4"><div className="flex items-center justify-between gap-3"><h4 className="text-sm font-bold text-[#131b2e]">{item.title}</h4><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.tone}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.subtitle}</p></article>)}</div></aside>
            <aside className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"><p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Proximo passo</p><h3 className="mt-2 text-xl font-black tracking-tight text-[#131b2e]">CRUD visual para clientes, projetos financeiros e parcelas</h3><p className="mt-3 text-sm leading-6 text-slate-600">A modelagem e o resumo financeiro ja existem. O passo seguinte mais valioso e criar telas de cadastro e edicao para registrar clientes, contratos e parcelas diretamente pelo frontend.</p><Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#131b2e]">Voltar ao site<ChevronRight className="h-4 w-4" /></Link></aside>
          </div>
        </section>
      </main>
    </div>
  );
}
