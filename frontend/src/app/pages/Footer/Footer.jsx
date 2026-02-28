export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-blue-500/20 bg-[#04081A]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="bg-gradient-to-r from-[#0890F8] to-[#199FFF] bg-clip-text text-lg font-semibold text-transparent">
              Marcio Lima | Cioli
            </p>
            <p className="text-sm text-gray-400">
              Backend Developer · Web Developer · Entusiasta de Tecnologia
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-300">
            <a
              href="https://github.com/marciolimadev"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#199FFF]"
            >
              GitHub
            </a>
            <a
              href="mailto:contato.cioli@gmail.com"
              className="transition-colors hover:text-[#199FFF]"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
          © {year} Marcio Lima | Cioli. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
