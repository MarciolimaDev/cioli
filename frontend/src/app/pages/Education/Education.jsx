"use client";

import React, { useEffect, useState } from "react";
import { Award, Calendar, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const typeLabelMap = {
  technologist: "Tecnólogo",
  graduation: "Graduação",
  postgrad: "Pós-graduação",
  professional_course: "Curso profissionalizante",
  certification: "Certificação",
};

const typeMascotMap = {
  technologist: "🎓",
  graduation: "🏛️",
  postgrad: "📚",
  professional_course: "🛠️",
  certification: "✅",
};

function getYearLabel(startDate, endDate, inProgress) {
  const startYear = startDate ? new Date(startDate).getFullYear() : null;
  const endYear = endDate ? new Date(endDate).getFullYear() : null;

  if (startYear && endYear) return `${startYear}-${endYear}`;
  if (startYear && inProgress) return `${startYear}-Atual`;
  if (startYear) return `${startYear}`;
  if (endYear) return `${endYear}`;
  return "Período não informado";
}

function normalizeFormations(raw) {
  return (Array.isArray(raw) ? raw : []).map((item, index) => {
    const typeLabel = typeLabelMap[item.formation_type] || "Formação";
    const tags = item.area
      ? item.area
          .split(/[;,|/]/)
          .map((value) => value.trim())
          .filter(Boolean)
          .slice(0, 6)
      : [];

    return {
      id: item.hash ?? `formation-${index}`,
      degree: item.title || "Formação sem título",
      school: item.institution || "Instituição não informada",
      mascot: typeMascotMap[item.formation_type] || "📘",
      year: getYearLabel(item.start_date, item.end_date, item.is_in_progress),
      achievements: [
        `Tipo: ${typeLabel}`,
        item.workload_hours ? `Carga horária: ${item.workload_hours}h` : null,
        item.is_in_progress ? "Status: Em andamento" : "Status: Concluído",
      ].filter(Boolean),
      skills: tags,
      description: item.description || "Sem descrição informada.",
    };
  });
}

const EducationSection = ({ initialFormations = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [educationData, setEducationData] = useState(() =>
    normalizeFormations(initialFormations)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFormations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/formations", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha ao carregar formações");
        }

        const raw = await response.json();
        setEducationData(normalizeFormations(raw));
      } catch {
        setEducationData((prev) => prev);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-screen relative overflow-hidden py-40 bg-[#04081A]">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04081A] via-transparent to-[#04081A]" />
        <div className="absolute inset-0 border border-white/[0.05] grid grid-cols-2 md:grid-cols-4" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-transparent mb-6">
            Formação Acadêmica
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Minha jornada de aprendizado e desenvolvimento profissional, destacando as formações acadêmicas que moldaram minha carreira e habilidades técnicas.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {!isLoading && educationData.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8">
              Nenhuma formação cadastrada no backend.
            </div>
          )}

          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              variants={cardVariants}
              className={`relative border rounded-xl p-8 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm ${
                hoveredIndex === index
                  ? "border-blue-500 scale-[1.02]"
                  : "border-blue-400/20"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">
                      {edu.degree}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-300 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    {edu.school}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {edu.year}
                  </p>
                </div>

                <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-3">
                  {edu.description}
                </p>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-2 text-sm"
                      >
                        <Award className="w-4 h-4" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {edu.skills.length > 0 ? (
                    edu.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300">
                      Geral
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;