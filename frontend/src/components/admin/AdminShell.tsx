"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareMore,
  Settings,
  ShieldUser,
  Users,
} from "lucide-react";

const ADMIN_SESSION_KEY = "cioli-admin-session";

type SessionData = {
  email?: string;
};

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Cobrancas", href: "/admin/cobrancas", icon: CreditCard },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Mensagens", href: "/admin/mensagens", icon: MessageSquareMore },
  { label: "Gestao", href: "/admin/gestao", icon: Settings },
];

export default function AdminShell({
  children,
  title,
  description,
}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useMemo<SessionData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawSession = sessionStorage.getItem(ADMIN_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as SessionData;
    } catch {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/admin/login");
    }
  }, [router, session]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto bg-[#131b2e] py-8 text-white shadow-[0_28px_80px_rgba(19,27,46,0.28)]">
        <div className="mb-10 flex items-center gap-3 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6ffbbe] text-[#131b2e]">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">The Ledger</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => {
            const current = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
                  current
                    ? "border-l-4 border-[#6ffbbe] bg-white/5 pl-5 text-[#6ffbbe]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-semibold">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 pt-6">
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">
            Sessao ativa
          </p>
          <p className="mt-3 text-sm font-semibold text-white">
            {session.email || "administrador"}
          </p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              router.replace("/admin/login");
            }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between bg-white/80 px-5 shadow-sm backdrop-blur-xl lg:px-8">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#131b2e]">
            {title}
          </h2>
          <p className="text-sm text-[#7c839b]">{description}</p>
        </div>

        <div className="flex items-center gap-4 lg:gap-5">
          <button
            type="button"
            className="text-slate-500 transition hover:text-[#131b2e]"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="text-slate-500 transition hover:text-[#131b2e]"
          >
            <Mail className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
            <div className="text-right">
              <p className="text-xs font-bold text-[#191c1e]">
                Executive Curator
              </p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e0e3e5] bg-[#131b2e] text-[#6ffbbe]">
              <ShieldUser className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-5 pb-12 pt-24 lg:px-12">
        {children}
      </main>
    </div>
  );
}
