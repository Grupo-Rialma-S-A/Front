import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rialma - Sistema de Gestão",
  description: "Sistema de gestão desenvolvido por XRef",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
