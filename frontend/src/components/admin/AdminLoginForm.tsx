"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

const ADMIN_SESSION_KEY = "cioli-admin-session";

const managedSections = [
  "Usuarios",
  "About Contents",
  "Categories",
  "Contact Messages",
  "Contact Subjects",
  "Formations",
  "Projects",
  "Service Requests",
  "Technologys",
];

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha para acessar a area administrativa.");
      return;
    }

    setIsSubmitting(true);

    sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({
        email: email.trim(),
        loggedAt: new Date().toISOString(),
      }),
    );

    router.push("/admin");
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-8%] h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:p-10">
          <div className="space-y-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Acesso administrativo CIOLI
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/70">
                Painel de operacao
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Login dedicado para operar seu painel administrativo no frontend.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Esta entrada centraliza o acesso aos modulos operacionais do site
                e prepara a base para gerenciar conteudo, portfolio e fluxos
                internos sem depender do painel do Django.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {managedSections.map((section) => (
              <div
                key={section}
                className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-slate-200 shadow-[0_12px_40px_rgba(5,10,30,0.35)]"
              >
                {section}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-8 space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950">
                <LockKeyhole className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Entrar</h2>
              <p className="text-sm leading-6 text-slate-300">
                Login apenas para acesso administrativo. Registro publico nao e
                exibido nesta area.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">E-mail</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-cyan-300/60">
                  <Mail className="h-5 w-5 text-cyan-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@cioli.online"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Senha</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-cyan-300/60">
                  <LockKeyhole className="h-5 w-5 text-cyan-200" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </label>

              {error ? (
                <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Acessar painel
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-300">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-cyan-100"
              >
                Voltar ao site principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
