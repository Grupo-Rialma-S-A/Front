"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isAuthenticated, getCurrentUser, logout } from "@/lib/api";
import type { User } from "@/types/user";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AnimatedBackground />

        <div className="text-green-800 text-xl font-semibold flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          Carregando...
        </div>
      </div>
    );
  }

  const dashboardOptions = [
    {
      title: "Cadastrar Usuário",
      description:
        "Gerencie usuários do sistema e configure permissões de acesso.",
      icon: "👥",
      route: "/cadastrar-usuario",
    },
    {
      title: "Planilha de Gado",
      description:
        "Controle e monitore seu rebanho com informações detalhadas.",
      icon: "🐄",
      route: "/planilha-gado",
    },
    {
      title: "Orçar Material",
      description:
        "Calcule custos de materiais e gerencie orçamentos de projetos.",
      icon: "💰",
      route: "/orcar-material",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />

      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-center py-4 px-12">
          <button
            onClick={handleLogout}
            className="bg-red-100/90 backdrop-blur-sm cursor-pointer border-2 border-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-200/90 transition-colors shadow-sm"
          >
            Sair
          </button>
          <div className="text-green-800">
            <p className="text-lg font-semibold">Olá, {user.name}</p>
            <p className="text-sm text-green-700">
              {user.role === "admin" ? "Administrador" : "Usuário"}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <img
              src="/logo.png"
              alt="Rialma Logo"
              className="w-52 h-auto mx-auto rounded mb-2"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h1 className="text-xl font-bold text-green-800">
              Sistema de Gestão Agropecuária
            </h1>
          </div>

          {/* Cards do Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(option.route)}
                className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-lg cursor-pointer hover:border-green-400 hover:shadow-lg hover:bg-white/90 transition-all duration-200"
              >
                <div className="bg-green-100/80 backdrop-blur-sm border-b-2 border-green-200 p-4 rounded-t-lg text-center">
                  <h3 className="text-lg font-bold text-green-800">
                    {option.title}
                  </h3>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {option.description}
                  </p>

                  <div className="flex justify-end">
                    <span className="text-green-700 text-sm font-semibold">
                      Acessar →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
