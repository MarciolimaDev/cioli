"use client";

import { useEffect, useState } from "react";
import {
  FaHome,
  FaLaptopCode,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaEnvelope,
  FaBars,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    updateViewport();
    handleScroll();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHome = pathname === "/";
  const isTransparentOnScroll = isHome && isMobile && hasScrolled && !isMenuOpen;

  const navLinks = [
    { id: "home", icon: FaHome, text: "Início", path: "/" },
    { id: "skills", icon: FaCode, text: "Skills", path: "/skills" },
    {
      id: "education",
      icon: FaGraduationCap,
      text: "Formação",
      path: "/education",
    },
    { id: "projects", icon: FaLaptopCode, text: "Projetos", path: "/projects" },
    { id: "services", icon: FaBriefcase, text: "Serviços", path: "/services" },
    { id: "contact", icon: FaEnvelope, text: "Contato", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isTransparentOnScroll
          ? "bg-transparent backdrop-blur-none"
          : "bg-gray-900/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none"
      }`}
    >
      <div className="md:fixed md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-auto">
        <div
          className={`md:rounded-full transition-all duration-300 ${
            isTransparentOnScroll
              ? "p-0 bg-transparent"
              : "p-[2px] bg-gradient-to-r from-[#0890F8] via-[#1897F2] to-[#199FFF] animate-gradient-x"
          }`}
        >
          <nav
            className={`md:rounded-full px-4 md:px-6 py-2.5 transition-colors duration-300 ${
              isTransparentOnScroll
                ? "bg-transparent backdrop-blur-none"
                : "bg-gray-900/90 backdrop-blur-md"
            }`}
          >
            {/* Mobile Menu Button */}
            <div className="flex justify-between items-center md:hidden px-2">
              <Link href="/" className="text-white font-bold">
                Cioli
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <FaBars />
              </button>
            </div>

            {/* Navigation Links */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1 lg:gap-2 py-4 md:py-0">
                {navLinks.map(({ id, icon: Icon, text, path }) => (
                  
                  <Link
                    key={id}
                    href={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 md:py-1.5 rounded-lg md:rounded-full text-sm font-medium
                      transition-all duration-300 flex items-center gap-2
                      hover:bg-white/10 
                      ${
                        id !== "about" && pathname === path
                          ? "bg-white/15 text-white"
                          : "text-gray-300 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      className={`text-base ${
                        id !== "about" && pathname === path ? "scale-110" : ""
                      }`}
                    />
                    <span className="inline">{text}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </header>
  );
}