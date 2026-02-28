"use client";

import { useEffect, useState } from "react";

const fallbackHeroImageUrl =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
const olovaLogoUrl =
  "/assets/images/cioliC-black-white.ico";

export default function About() {
  const [heroImageUrl, setHeroImageUrl] = useState(fallbackHeroImageUrl);

  useEffect(() => {
    let isMounted = true;

    async function loadAboutContent() {
      try {
        const response = await fetch("/api/about-content", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const content = await response.json();
        if (isMounted && content?.hero_image) {
          setHeroImageUrl(content.hero_image);
        }
      } catch {
      }
    }

    loadAboutContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section id="about" className="py-16 md:py-32  text-white bg-[#04081A]">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl text-white">
            Sobre Mim
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
            <div className="relative mb-6 sm:mb-0">
              <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl p-px from-zinc-300 to-transparent">
                <img
                  src={heroImageUrl}
                  className="rounded-[15px] shadow block"
                  alt="Imagem de destaque da seção Sobre Mim"
                  width={1207}
                  height={929}
                />
              </div>
            </div>

            <div className="relative space-y-4">
              <p className="text-white">
                Olá, sou Márcio Lima. Minha principal expertise inclui: desenvolvimento frontend com React e Next.js, criação de APIs com Django Rest Framework, e experiência com bancos de dados relacionais PostgreSQL.
                <span className="font-bold text-white">
                  Estou sempre buscando evoluir como profissional, expandindo meus conhecimentos.
                </span>
              </p>
              <p className="text-white">
                Sou um profissional movido por aprendizado contínuo e inovação. 
                Meu objetivo é contribuir com a comunidade de desenvolvedores através 
                de projetos, ferramentas e soluções que realmente agreguem valor. 
                Acredito que tecnologia deve ser acessível, eficiente e capaz de 
                transformar ideias em realidade.
              </p>

              <div className="pt-6">
                <blockquote className="border-l-4 border-gray-300 pl-4">
                  <p className="text-white">
                    Sou um eterno aprendiz e inovador, movido pelo desejo de contribuir com a comunidade de desenvolvedores com novas ideias e ferramentas que agreguem valor real.
                  </p>

                  <div className="mt-6 space-y-3">
                    <cite className="block font-medium text-white">
                      Márcio Lima, criador do
                    </cite>
                    <div className="flex items-center gap-2">
                      <img
                        className="h-5 w-fit"
                        src={olovaLogoUrl}
                        alt="Olova Logo"
                        height="20"
                        width="auto"
                      />
                      <span className="text-white">CIOLI</span>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}