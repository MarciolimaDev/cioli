"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Send, Briefcase } from "lucide-react";
import Swal from "sweetalert2";

const INITIAL_FORM_DATA = {
  full_name: "",
  email: "",
  phone: "",
  service_type: "",
  project_title: "",
  project_description: "",
  logo_image: null,
  brand_identity_status: "",
  brand_manual_file: null,
  reference_links: "",
  primary_color: "#0890F8",
  secondary_color: "#199FFF",
  timeline: "",
  budget_range: "",
  additional_info: "",
  privacyConsent: false,
};

export default function Services() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [currentStep, setCurrentStep] = useState(1);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    const loadServiceTypes = async () => {
      try {
        const response = await fetch("/api/contact-subjects", { cache: "no-store" });
        if (!response.ok) throw new Error("Falha ao carregar tipos de serviço");

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

  const selectedServiceType = useMemo(
    () => serviceTypes.find((item) => item.hash === formData.service_type) || null,
    [formData.service_type, serviceTypes]
  );

  const selectedServiceName = selectedServiceType?.name?.toLowerCase?.() || "";

  const isAuditAutomationFlow =
    selectedServiceName.includes("auditoria") ||
    selectedServiceName.includes("seguran") ||
    selectedServiceName.includes("automacao") ||
    selectedServiceName.includes("automação");

  const isWebDesignFlow =
    selectedServiceName.includes("landing") ||
    selectedServiceName.includes("site") ||
    selectedServiceName.includes("design") ||
    selectedServiceName.includes("ui");

  const totalSteps = 3;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const tempErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.full_name.trim()) {
        tempErrors.full_name = "Informe seu nome completo.";
        isValid = false;
      }

      if (!formData.email.trim()) {
        tempErrors.email = "Informe seu email.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "Digite um email válido, por exemplo: nome@empresa.com.";
        isValid = false;
      }

      if (!formData.phone.trim()) {
        tempErrors.phone = "Informe seu telefone ou WhatsApp.";
        isValid = false;
      }

      if (!formData.service_type) {
        tempErrors.service_type = "Escolha o tipo de projeto ou serviço.";
        isValid = false;
      }
    }

    if (step === 2) {
      if (!isAuditAutomationFlow && !formData.project_title.trim()) {
        tempErrors.project_title = "Conte qual é o objetivo do projeto.";
        isValid = false;
      }

      if (!formData.project_description.trim()) {
        tempErrors.project_description = isAuditAutomationFlow
          ? "Descreva o tipo de auditoria, automação ou serviço que você precisa."
          : "Conte mais sobre o que você precisa para eu entender seu briefing.";
        isValid = false;
      }
    }

    if (step === 3) {
      if (!formData.timeline) {
        tempErrors.timeline = "Selecione se existe prazo para o projeto.";
        isValid = false;
      }

      if (!formData.privacyConsent) {
        tempErrors.privacyConsent = "Você precisa aceitar a Política de Privacidade para enviar.";
        isValid = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      setSubmitStatus("error");
      setSubmitMessage("Revise os campos destacados para continuar.");
      return;
    }

    setSubmitMessage("");
    setSubmitStatus("idle");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const goToPreviousStep = () => {
    setSubmitMessage("");
    setSubmitStatus("idle");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitMessage("");
    setSubmitStatus("idle");

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);

    if (!step1Valid || !step2Valid || !step3Valid) {
      setSubmitStatus("error");
      setSubmitMessage("Revise os campos obrigatórios para enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      const fallbackProjectTitle = selectedServiceType?.name
        ? `Solicitação de ${selectedServiceType.name}`
        : "Solicitação de serviço";
      const projectTitleToSend = formData.project_title.trim() || fallbackProjectTitle;

      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("service_type", formData.service_type);
      payload.append("project_title", projectTitleToSend);
      payload.append("project_description", formData.project_description);
      payload.append("brand_identity_status", formData.brand_identity_status);
      payload.append("reference_links", formData.reference_links);
      payload.append("timeline", formData.timeline);
      payload.append("budget_range", formData.budget_range);

      if (isWebDesignFlow) {
        payload.append("primary_color", formData.primary_color);
        payload.append("secondary_color", formData.secondary_color);
      }

      payload.append("additional_info", formData.additional_info);
      payload.append("privacy_consent", String(formData.privacyConsent));

      if (formData.logo_image) payload.append("logo_image", formData.logo_image);
      if (formData.brand_manual_file) payload.append("brand_manual_file", formData.brand_manual_file);

      const response = await fetch("/api/service-requests", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 201) {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setCurrentStep(1);
        setSubmitStatus("idle");
        setSubmitMessage("");

        await Swal.fire({
          icon: "success",
          title: "Solicitação enviada com sucesso!",
          text: "Recebi seu briefing e vou retornar em breve com os próximos passos.",
          background: "#04081A",
          color: "#f8f8f8",
          confirmButtonText: "Perfeito",
          confirmButtonColor: "#199FFF",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.message || "Não foi possível enviar agora. Tente novamente em instantes.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Ocorreu um erro inesperado ao enviar. Tente novamente.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-20 mb-20 lg:pt-0 bg-[#04081A] text-white min-h-screen">
      <section className="hero min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-transparent">
                  Solicite um Serviço
                </h2>
                <p className="text-gray-300 text-lg">
                  Formulário passo a passo para facilitar o briefing. No fim, envio uma proposta com prazo e investimento.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg mt-1">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mais simples e rápido</h3>
                    <p className="text-gray-400 text-sm">Você responde por etapas, sem precisar preencher tudo de uma vez.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl">
              <form className="space-y-5">
                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-gray-700 rounded-lg p-4">
                  Este formulário ajuda a entender melhor seu projeto para que eu possa preparar uma proposta adequada.
                  Você não precisa saber responder tudo. Caso não saiba alguma resposta, pode deixar em branco.
                </p>

                <div className="flex items-center justify-between text-xs text-gray-300 bg-white/5 border border-gray-700 rounded-lg px-4 py-3">
                  <span>Passo {currentStep} de {totalSteps}</span>
                  <span>{currentStep === 1 ? "Contato" : currentStep === 2 ? "Briefing" : "Prazo e envio"}</span>
                </div>

                {submitMessage && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm border ${
                      submitStatus === "success"
                        ? "bg-green-500/10 border-green-500/40 text-green-300"
                        : "bg-red-500/10 border-red-500/40 text-red-300"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome completo *</label>
                      <input
                        type="text"
                        placeholder="Ex.: João da Silva"
                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                          errors.full_name ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        value={formData.full_name}
                        onChange={(e) => handleFieldChange("full_name", e.target.value)}
                      />
                      {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        placeholder="Ex.: contato@suaempresa.com"
                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                          errors.email ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="(11) 98765-4321"
                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                          errors.phone ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", formatPhone(e.target.value))}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Que tipo de projeto/serviço você precisa? *</label>
                      <select
                        className={`w-full px-4 py-3 rounded-lg border text-white ${
                          errors.service_type ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                        value={formData.service_type}
                        onChange={(e) => handleFieldChange("service_type", e.target.value)}
                      >
                        <option value="" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>
                          Selecione um tipo de projeto...
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
                      {errors.service_type && <p className="text-red-500 text-sm mt-1">{errors.service_type}</p>}
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {isAuditAutomationFlow ? (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Descreva o tipo de {selectedServiceName.includes("autom") ? "automação" : "serviço"} que você precisa *
                        </label>
                        <textarea
                          placeholder="Ex.: Quero automatizar envio de propostas, integração com WhatsApp, auditoria de segurança da minha aplicação..."
                          rows="6"
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                            errors.project_description ? "border-red-500" : "border-gray-700"
                          } focus:border-blue-500 focus:outline-none transition-colors resize-none`}
                          value={formData.project_description}
                          onChange={(e) => handleFieldChange("project_description", e.target.value)}
                        />
                        {errors.project_description && (
                          <p className="text-red-500 text-sm mt-1">{errors.project_description}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Qual é o objetivo do projeto? *</label>
                          <input
                            type="text"
                            placeholder="Ex.: Criar um site para minha empresa, refazer meu site atual ou lançar uma landing page"
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.project_title ? "border-red-500" : "border-gray-700"
                            } focus:border-blue-500 focus:outline-none transition-colors`}
                            value={formData.project_title}
                            onChange={(e) => handleFieldChange("project_title", e.target.value)}
                          />
                          {errors.project_title && <p className="text-red-500 text-sm mt-1">{errors.project_title}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Conte um pouco mais sobre o que você precisa *</label>
                          <textarea
                            placeholder="Exemplo:\n• Qual é o seu negócio?\n• Para que servirá o site ou sistema?\n• Quem é o público-alvo?"
                            rows="5"
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.project_description ? "border-red-500" : "border-gray-700"
                            } focus:border-blue-500 focus:outline-none transition-colors resize-none`}
                            value={formData.project_description}
                            onChange={(e) => handleFieldChange("project_description", e.target.value)}
                          />
                          {errors.project_description && (
                            <p className="text-red-500 text-sm mt-1">{errors.project_description}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Você possui sites de referência?</label>
                          <textarea
                            placeholder="Cole links de inspiração (opcional)"
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                            value={formData.reference_links}
                            onChange={(e) => handleFieldChange("reference_links", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Você já possui logotipo da empresa? (opcional)</label>
                          <p className="text-xs text-gray-400 mb-2">
                            Se tiver, envie o arquivo da logo. Formatos aceitos: PNG, JPG, SVG ou PDF.
                          </p>
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.svg,.pdf"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500/20 file:text-blue-200 hover:file:bg-blue-500/30 focus:border-blue-500 focus:outline-none transition-colors"
                            onChange={(e) => handleFieldChange("logo_image", e.target.files?.[0] || null)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Sua empresa possui identidade visual completa?</label>
                          <p className="text-xs text-gray-400 mb-2">
                            Ex: manual da marca com cores, tipografia e regras de uso da logo.
                          </p>
                          <select
                            className="w-full px-4 py-3 rounded-lg border text-white border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                            style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                            value={formData.brand_identity_status}
                            onChange={(e) => {
                              handleFieldChange("brand_identity_status", e.target.value);
                              if (e.target.value !== "manual") {
                                handleFieldChange("brand_manual_file", null);
                              }
                            }}
                          >
                            <option value="" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>
                              Selecione uma opção (opcional)
                            </option>
                            <option value="manual" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>
                              Sim, tenho manual da marca
                            </option>
                            <option value="logo_only" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>
                              Tenho apenas a logo
                            </option>
                            <option value="none" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>
                              Ainda não tenho identidade visual
                            </option>
                          </select>
                        </div>

                        {formData.brand_identity_status === "manual" && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Upload manual da marca (PDF)</label>
                            <input
                              type="file"
                              accept=".pdf"
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500/20 file:text-blue-200 hover:file:bg-blue-500/30 focus:border-blue-500 focus:outline-none transition-colors"
                              onChange={(e) => handleFieldChange("brand_manual_file", e.target.files?.[0] || null)}
                            />
                          </div>
                        )}

                        {isWebDesignFlow && (
                          <div className="rounded-xl border border-gray-700 bg-white/5 p-4 space-y-4">
                            <h3 className="font-medium">Cores preferidas para o projeto (opcional)</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Cor principal</label>
                                <input
                                  type="color"
                                  className="w-full h-11 rounded-lg bg-transparent border border-gray-700 cursor-pointer"
                                  value={formData.primary_color}
                                  onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Cor secundária</label>
                                <input
                                  type="color"
                                  className="w-full h-11 rounded-lg bg-transparent border border-gray-700 cursor-pointer"
                                  value={formData.secondary_color}
                                  onChange={(e) => handleFieldChange("secondary_color", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Existe prazo para o projeto? *</label>
                      <select
                        className={`w-full px-4 py-3 rounded-lg border text-white ${
                          errors.timeline ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                        value={formData.timeline}
                        onChange={(e) => handleFieldChange("timeline", e.target.value)}
                      >
                        <option value="" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Selecione um prazo</option>
                        <option value="no_rush" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Sem pressa</option>
                        <option value="1_month" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>1 mês</option>
                        <option value="2_3_months" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>2–3 meses</option>
                        <option value="more_than_3_months" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Mais de 3 meses</option>
                        <option value="urgent" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Urgente</option>
                      </select>
                      {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Qual faixa de investimento você imagina?</label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border text-white border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                        style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}
                        value={formData.budget_range}
                        onChange={(e) => handleFieldChange("budget_range", e.target.value)}
                      >
                        <option value="" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Selecione uma opção (opcional)</option>
                        <option value="unknown" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Ainda não sei</option>
                        <option value="1k_3k" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>R$ 1k – 3k</option>
                        <option value="3k_8k" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>R$ 3k – 8k</option>
                        <option value="8k_20k" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>R$ 8k – 20k</option>
                        <option value="20k_plus" style={{ backgroundColor: "#0b1229", color: "#f8f8f8" }}>Acima de R$ 20k</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Informações adicionais</label>
                      <textarea
                        placeholder="Algo importante que não foi perguntado? Pode escrever aqui."
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                        value={formData.additional_info}
                        onChange={(e) => handleFieldChange("additional_info", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 mt-6">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.privacyConsent}
                          onChange={(e) => handleFieldChange("privacyConsent", e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-gray-700 bg-white/5 text-[#0890F8] focus:ring-[#0890F8] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                          Li e concordo com a{" "}
                          <a
                            href="/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0890F8] hover:text-[#199FFF] underline font-semibold"
                          >
                            Política de Privacidade
                          </a>
                          {" "}e autorizo contato por email e WhatsApp.
                        </span>
                      </label>
                      {errors.privacyConsent && <p className="text-red-500 text-sm">{errors.privacyConsent}</p>}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="w-full sm:w-auto px-5 py-3 rounded-lg border border-gray-600 text-gray-200 hover:bg-white/5 transition-colors"
                    >
                      Voltar
                    </button>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="w-full bg-linear-to-r from-[#0890F8] to-[#199FFF] hover:from-[#0780E8] hover:to-[#088FEF] text-white font-semibold py-3 rounded-lg transition-all duration-300"
                    >
                      Próximo passo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-linear-to-r from-[#0890F8] to-[#199FFF] hover:from-[#0780E8] hover:to-[#088FEF] text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
