import type { Metadata } from "next";
import "./globals.css";
import InspectGuard from "@/components/InspectGuard";
import AppShell from "@/components/AppShell";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcio Lima",
  alternateName: "Cioli",
  url: "https://cioli.online",
  image: "https://cioli.online/logocioli-bg-white.webp",
  jobTitle: "Desenvolvedor",
  sameAs: ["https://cioli.online"],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cioli.online"),
  applicationName: "CIOLI",
  title: {
    default: "CIOLI",
    template: "CIOLI | %s",
  },
  description: "Portfólio oficial de Marcio Lima | Cioli",
  keywords: [
    "Cioli",
    "Marcio Lima",
    "Portfólio Marcio Lima",
    "Portifolio Marcio",
    "Desenvolvedor",
    "Projetos",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CIOLI",
    description: "Portfólio oficial de Marcio Lima | Cioli",
    url: "https://cioli.online",
    siteName: "CIOLI",
    images: [
      {
        url: "/logocioli-bg-white.webp",
        width: 1200,
        height: 630,
        alt: "CIOLI | Portfólio oficial de Marcio Lima",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIOLI",
    description: "Portfólio oficial de Marcio Lima | Cioli",
    images: ["/logocioli-bg-white.webp"],
  },
  icons: {
    icon: "/logocioli-bg-white.webp",
    shortcut: "/logocioli-bg-white.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <InspectGuard />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
