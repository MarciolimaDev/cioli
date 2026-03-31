"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type AboutContentItem = {
  id: number;
  title: string;
};

type FormationItem = {
  hash: string;
  title: string;
  institution: string;
};

type CategoryItem = {
  hash: string;
  name: string;
};

type SubjectItem = {
  hash: string;
  name: string;
};

export default function AdminGestaoPage() {
  const [aboutContent, setAboutContent] = useState<AboutContentItem[]>([]);
  const [formations, setFormations] = useState<FormationItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const [aboutResponse, formationsResponse, categoriesResponse, subjectsResponse] =
        await Promise.all([
          fetch("/api/about-content", { cache: "no-store" }),
          fetch("/api/formations", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/contact-subjects", { cache: "no-store" }),
        ]);

      const aboutData = await aboutResponse.json().catch(() => null);
      setAboutContent(aboutData ? [aboutData] : []);
      setFormations(await formationsResponse.json().catch(() => []));
      setCategories(await categoriesResponse.json().catch(() => []));
      setSubjects(await subjectsResponse.json().catch(() => []));
    }

    loadData();
  }, []);

  return (
    <AdminShell
      title="Gestao"
      description="Modulos de apoio institucional e configuracoes de conteudo."
    >
      <section className="grid gap-6 xl:grid-cols-4">
        {[
          ["Sobre", aboutContent.length],
          ["Formacoes", formations.length],
          ["Categorias", categories.length],
          ["Assuntos", subjects.length],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              {label}
            </p>
            <h3 className="mt-4 text-3xl font-black text-[#131b2e]">{value}</h3>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Sobre
          </p>
          <div className="mt-5 space-y-3">
            {aboutContent.map((item) => (
              <article key={item.id} className="rounded-xl bg-[#f7f9fb] p-4">
                <h3 className="text-sm font-bold text-[#131b2e]">{item.title}</h3>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Formacoes
          </p>
          <div className="mt-5 space-y-3">
            {formations.map((item) => (
              <article key={item.hash} className="rounded-xl bg-[#f7f9fb] p-4">
                <h3 className="text-sm font-bold text-[#131b2e]">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.institution}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Categorias e assuntos
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((item) => (
              <span
                key={item.hash}
                className="rounded-full bg-[#f7f9fb] px-3 py-2 text-sm text-[#131b2e]"
              >
                {item.name}
              </span>
            ))}
            {subjects.map((item) => (
              <span
                key={item.hash}
                className="rounded-full bg-[#eefcf5] px-3 py-2 text-sm text-[#131b2e]"
              >
                {item.name}
              </span>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
