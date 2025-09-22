"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser, logout } from "@/lib/api";
import type { User } from "@/types/user";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CadastrarUsuario from "@/components/CadastrarUsuario";
import PlanilhaGado from "@/components/PlanilhaGado";
import OrcarMaterial from "@/components/OrcarMaterial";
import Sidebar from "@/components/SideBar";
import SistemaAcesso from "@/components/SistemaAcesso";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Define a primeira opção disponível como ativa por padrão
    if (!activeView) {
      setActiveView("cadastrar-usuario");
    }
  }, [router, activeView]);

  const dashboardOptions = [
    {
      title: "Sistema de acesso",
      description:
        "Gerencie usuários do sistema e configure permissões de acesso",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v极zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      view: "cadastrar-usuario",
    },
    // {
    //   title: "Simulação de planilha",
    //   description: "Controle e monitore seu rebanho com informações detalhadas",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    //       />
    //     </svg>
    //   ),
    //   view: "planilha-gado",
    // },
    {
      title: "Sistema de custos",
      description:
        "Calcule custos de materiais e gerencie orçamentos de projetos",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      view: "orcar-material",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (view: string) => {
    setActiveView(view);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const renderContent = () => {
    switch (activeView) {
      case "cadastrar-usuario":
        return <SistemaAcesso user={user!} />;
      case "planilha-gado":
        return <PlanilhaGado />;
      case "orcar-material":
        return <OrcarMaterial />;
      default:
        // Mostra a primeira opção por padrão
        return <CadastrarUsuario user={user!} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AnimatedBackground />
        <div className="text-blue-900 text-xl font-semibold flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          Carregando sistema...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <AnimatedBackground />

      {/* Logo de Fundo */}
      <div
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{
          backgroundImage: "url(/logo-png.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          opacity: 0.1,
          height: "80vh",
          top: "10vh",
        }}
      />

      {/* Conteúdo principal (ocupa o espaço disponível, menos a altura do footer) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          user={user}
          sidebarExpanded={sidebarExpanded}
          activeView={activeView}
          dashboardOptions={dashboardOptions}
          toggleSidebar={toggleSidebar}
          handleNavigation={handleNavigation}
          handleLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-blue-100/80 backdrop-blur-xl  p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-900 mb-1">
                  {dashboardOptions.find((opt) => opt.view === activeView)
                    ?.title || "Bem-vindo ao Dashboard"}
                </h1>
                <p className="text-blue-700">
                  {dashboardOptions.find((opt) => opt.view === activeView)
                    ?.description ||
                    "Selecione uma opção no menu para começar a usar o sistema."}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-200/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-blue-900 text-sm font-medium">
                    {new Date().toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area (com scroll quando necessário) */}
          <main className="flex-1 overflow-auto">{renderContent()}</main>
        </div>
      </div>

      {/* Footer (bloco normal na parte inferior) */}
      <Footer />
    </div>
  );
}
