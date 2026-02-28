import type { Metadata } from "next";
import "./globals.css";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import InspectGuard from "@/components/InspectGuard";

export const metadata: Metadata = {
  metadataBase: new URL("https://cioli.online"),
  title: {
    default: "CIOLI",
    template: "CIOLI | %s",
  },
  description: "Portfólio oficial de Marcio Lima | Cioli",
  openGraph: {
    title: "CIOLI",
    description: "Portfólio oficial de Marcio Lima | Cioli",
    url: "https://cioli.online",
    siteName: "CIOLI",
    images: ["/logocioli-bg-white.webp"],
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
    <html lang="en">
      <body suppressHydrationWarning>
        <InspectGuard />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}