"use client";

import React, { useEffect, useState } from "react";
import { Send, Mail } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await fetch("/api/contact-subjects", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha ao carregar assuntos");
        }

        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          hash: item.hash,
          name: item.name,
        }));

        setSubjects(normalized);
      } catch {
        setSubjects([]);
      }
    };

    loadSubjects();
  }, []);

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    if (!formData.full_name.trim()) {
      tempErrors.full_name = "Nome completo é obrigatório";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email é inválido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = "Telefone é obrigatório";
      isValid = false;
    }

    if (!formData.subject) {
      tempErrors.subject = "Selecione um assunto";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Mensagem é obrigatória";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 201) {
        setStatus("Mensagem enviada com sucesso!");
        setFormData({
          full_name: "",
          email: "",
          subject: "",
          phone: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus(result.message || "Não foi possível enviar sua mensagem.");
      }
    } catch (error) {
      setStatus("Ocorreu um erro ao enviar. Tente novamente.");
      console.error("Error:", error);
    }
  };

  return (
    <main
      className="pt-20 lg:pt-[0rem] bg-[#04081A]
 text-white min-h-screen"
    >
      <section className="hero min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-transparent">
                  Entre em Contato
                </h2>
                <p className="text-gray-300 text-lg">
                  Me conte o que você precisa. Sem formulário infinito, sem robô — sou eu que leio e respondo.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-400">contato.cioli@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Seu Nome"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.full_name ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Seu Email"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Telefone"
                      inputMode="numeric"
                      maxLength={15}
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.phone ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: formatPhone(e.target.value),
                        })
                      }
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <select
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border ${
                        errors.subject ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#0f172a", color: "#94a3b8" }}
                      >
                        Selecione o assunto
                      </option>
                      {subjects.map((subject) => (
                        <option
                          key={subject.hash}
                          value={subject.hash}
                          style={{ backgroundColor: "#0f172a", color: "#e2e8f0" }}
                        >
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <textarea
                      placeholder="Sua mensagem"
                      rows="4"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.message ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors resize-none`}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0890F8] to-[#199FFF] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                >
                  <span>Enviar Mensagem</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-4 text-center ${
                    status.includes("sucesso")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <p>{status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}