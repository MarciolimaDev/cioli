"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type ProjectItem = {
  hash: string;
  title: string;
  descriptions_short: string;
  technologies?: Array<{ name: string }>;
  featured?: boolean;
};

type CategoryItem = {
  hash: string;
  name: string;
};

type TechnologyItem = {
  hash: string;
  name: string;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const [projectsResponse, categoriesResponse, technologiesResponse] =
        await Promise.all([
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/technologies", { cache: "no-store" }),
        ]);

      setProjects(await projectsResponse.json().catch(() => []));
      setCategories(await categoriesResponse.json().catch(() => []));
      setTechnologies(await technologiesResponse.json().catch(() => []));
    }

    loadData();
  }, []);

  return (
    <AdminShell
      title="Portfolio"
      description="Visualize os projetos publicados, categorias e tecnologias."
    >
      <section className="grid gap-6 xl:grid-cols-3">
        {[
          ["Projetos", projects.length],
          ["Categorias", categories.length],
          ["Tecnologias", technologies.length],
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

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Projetos publicados
          </p>
          <div className="mt-5 space-y-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <article key={project.hash} className="rounded-xl bg-[#f7f9fb] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#131b2e]">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {project.descriptions_short}
                      </p>
                    </div>
                    {project.featured ? (
                      <span className="rounded-full bg-[#eefcf5] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#006c49]">
                        Destaque
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(project.technologies || []).map((tech) => (
                      <span
                        key={`${project.hash}-${tech.name}`}
                        className="rounded-full bg-white px-3 py-1 text-xs text-slate-600"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-slate-600">
                Nenhum projeto publicado ainda.
              </p>
            )}
          </div>
        </article>

        <div className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Categorias
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.hash}
                  className="rounded-full bg-[#f7f9fb] px-3 py-2 text-sm text-[#131b2e]"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Tecnologias
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology.hash}
                  className="rounded-full bg-[#f7f9fb] px-3 py-2 text-sm text-[#131b2e]"
                >
                  {technology.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}
