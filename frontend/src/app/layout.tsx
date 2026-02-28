import type { Metadata } from "next";
import "./globals.css";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";

export const metadata: Metadata = {
  title: {
    default: "CIOLI",
    template: "CIOLI | %s",
  },
  description: "Portfólio oficial de Marcio Lima | Cioli",
  icons: {
    icon: "/logocioli-bg-blue.webp",
    shortcut: "/logocioli-bg-blue.webp",
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}