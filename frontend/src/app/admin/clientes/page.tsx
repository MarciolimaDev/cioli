"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type ClientItem = {
  id: number;
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  status: string;
};

const emptyForm = {
  name: "",
  company_name: "",
  email: "",
  phone: "",
};

export default function AdminClientesPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadClients() {
    const response = await fetch("/api/clients", { cache: "no-store" });
    const data = await response.json().catch(() => []);
    setClients(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "active",
          notes: "",
          company_name: form.company_name || null,
          phone: form.phone || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel cadastrar a cliente.");
      }

      setForm(emptyForm);
      setMessage("Cliente cadastrada com sucesso.");
      await loadClients();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao cadastrar cliente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="Clientes"
      description="Cadastre e consulte clientes sem sair do frontend."
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Novo cliente
          </p>
          <div className="mt-5 grid gap-4">
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Nome da cliente"
              className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none"
            />
            <input
              value={form.company_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  company_name: event.target.value,
                }))
              }
              placeholder="Empresa"
              className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none"
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none"
            />
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Telefone"
              className="rounded-xl border border-slate-200 bg-[#f7f9fb] px-4 py-3 text-sm outline-none"
            />
          </div>
          {message ? (
            <p className="mt-4 rounded-xl bg-[#f7f9fb] px-4 py-3 text-sm text-[#131b2e]">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-xl bg-[#131b2e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e2942] disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Cadastrar cliente"}
          </button>
        </form>

        <section className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Base de clientes
            </p>
            <span className="text-sm font-semibold text-[#131b2e]">
              {clients.length} registro(s)
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {clients.length > 0 ? (
              clients.map((client) => (
                <article key={client.id} className="rounded-xl bg-[#f7f9fb] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#131b2e]">
                        {client.company_name || client.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {client.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eefcf5] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#006c49]">
                      {client.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{client.email}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {client.phone || "Sem telefone"}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-slate-600">
                Nenhum cliente cadastrado ainda.
              </p>
            )}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
