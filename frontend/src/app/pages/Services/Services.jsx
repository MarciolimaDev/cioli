"use client";

import React, { useEffect, useState } from "react";
import { Send, Briefcase } from "lucide-react";
import Swal from "sweetalert2";

export default function Services() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    service_type: "",
    project_title: "",
    project_description: "",
    logo_image: null,
    additional_info: "",
  });

  const [errors, setErrors] = useState({});
  const [serviceTypes, setServiceTypes] = useState([]);

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
    const loadServiceTypes = async () => {
      try {
        const response = await fetch("/api/contact-subjects", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Falha ao carregar tipos de serviço");
        }

        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          hash: item.hash,
          name: item.name,
        }));

        setServiceTypes(normalized);
      } catch {
        setServiceTypes([]);
      }
    };

    loadServiceTypes();
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

    if (!formData.service_type) {
      tempErrors.service_type = "Selecione um tipo de serviço";
      isValid = false;
    }

    if (!formData.project_title.trim()) {
      tempErrors.project_title = "Título do projeto é obrigatório";
      isValid = false;
    }

    if (!formData.project_description.trim()) {
      tempErrors.project_description = "Descrição do projeto é obrigatória";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await Swal.fire({
        icon: "warning",
        title: "Campos obrigatorios",
        text: "Preencha todos os campos obrigatorios corretamente.",
        background: "#04081A",
        color: "#f8f8f8",
        confirmButtonText: "Ok",
        confirmButtonColor: "#0890F8",
      });
      return;
    }

    try {
      const payload = new FormData();
      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("service_type", formData.service_type);
      payload.append("project_title", formData.project_title);
      payload.append("project_description", formData.project_description);
      payload.append("additional_info", formData.additional_info);
      if (formData.logo_image) {
        payload.append("logo_image", formData.logo_image);
      }

      const response = await fetch("/api/service-requests", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 201) {
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          service_type: "",
          project_title: "",
          project_description: "",
          logo_image: null,
          additional_info: "",
        });
        setErrors({});

        await Swal.fire({
          icon: "success",
          title: "Solicitacao enviada!",
          text: "Recebi sua solicitacao e responderei em breve.",
          background: "#04081A",
          color: "#f8f8f8",
          confirmButtonText: "Perfeito",
          confirmButtonColor: "#199FFF",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Nao foi possivel enviar",
          text: result.message || "Tente novamente em instantes.",
          background: "#04081A",
          color: "#f8f8f8",
          confirmButtonText: "Fechar",
          confirmButtonColor: "#0890F8",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erro inesperado",
        text: "Ocorreu um erro ao enviar. Tente novamente.",
        background: "#04081A",
        color: "#f8f8f8",
        confirmButtonText: "Fechar",
        confirmButtonColor: "#0890F8",
      });
      console.error("Error:", error);
    }
  };

  return (
    <main className="pt-20 lg:pt-[0rem] bg-[#04081A] text-white min-h-screen">
      <section className="hero min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Service Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-transparent">
                  Solicite um Serviço
                </h2>
                <p className="text-gray-300 text-lg">
                  Descreva o projeto que você tem em mente. Vou
                  analisar sua solicitação e enviar uma proposta personalizada com prazo e orçamento.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg mt-1">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Detalhes Claros</h3>
                    <p className="text-gray-400 text-sm">
                      Quanto mais informações, melhor a proposta
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Service Form */}
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.full_name ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:outline-none transition-colors`}
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:outline-none transition-colors`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98765-4321"
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
                  <label className="block text-sm font-medium mb-2">
                    Logo da Marca (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500/20 file:text-blue-200 hover:file:bg-blue-500/30 focus:border-blue-500 focus:outline-none transition-colors"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logo_image: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>

                {/* Service Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Serviço *
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-lg border text-white ${
                      errors.service_type ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:outline-none transition-colors`}
                    style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                    value={formData.service_type}
                    onChange={(e) =>
                      setFormData({ ...formData, service_type: e.target.value })
                    }
                  >
                    <option
                      value=""
                      style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                    >
                      Selecione um tipo...
                    </option>
                    {serviceTypes.map((type) => (
                      <option
                        key={type.hash}
                        value={type.hash}
                        style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                      >
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.service_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.service_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Redesign de website, App mobile, etc"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.project_title ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:outline-none transition-colors`}
                    value={formData.project_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_title: e.target.value,
                      })
                    }
                  />
                  {errors.project_title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project_title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição do Projeto *
                  </label>
                  <textarea
                    placeholder="Descreva seu projeto em detalhes. O que você quer? Quem é o público-alvo? Há alguma referência ou inspiração?"
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                      errors.project_description
                        ? "border-red-500"
                        : "border-gray-700"
                    } focus:border-blue-500 focus:outline-none transition-colors resize-none`}
                    value={formData.project_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_description: e.target.value,
                      })
                    }
                  />
                  {errors.project_description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project_description}
                    </p>
                  )}
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Informações Adicionais
                  </label>
                  <textarea
                    placeholder="Algo que não mencionei acima? Links de referência? Requisitos especiais?"
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    value={formData.additional_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0890F8] to-[#199FFF] hover:from-[#0780E8] hover:to-[#088FEF] text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                >
                  <Send className="w-5 h-5" />
                  Enviar Solicitação
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
