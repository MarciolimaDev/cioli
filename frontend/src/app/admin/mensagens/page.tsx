"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type SubjectItem = {
  hash: string;
  name: string;
  is_active: boolean;
};

export default function AdminMensagensPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/contact-subjects", { cache: "no-store" });
      const data = await response.json().catch(() => []);
      setSubjects(Array.isArray(data) ? data : []);
    }

    loadData();
  }, []);

  return (
    <AdminShell
      title="Mensagens"
      description="Area reservada para inbox administrativa e solicitacoes."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Status atual
          </p>
          <h3 className="mt-4 text-2xl font-black text-[#131b2e]">
            Este modulo ainda nao lista mensagens no frontend
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            O backend atual aceita criacao de mensagens e service requests, mas
            ainda nao expoe leitura administrativa nessas rotas. A pagina ja
            existe para virar o inbox quando essa etapa for implementada.
          </p>
        </article>

        <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Assuntos ativos
          </p>
          <div className="mt-5 space-y-3">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <article key={subject.hash} className="rounded-xl bg-[#f7f9fb] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-[#131b2e]">
                      {subject.name}
                    </h3>
                    <span className="rounded-full bg-[#eefcf5] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#006c49]">
                      {subject.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-slate-600">
                Nenhum assunto encontrado.
              </p>
            )}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
