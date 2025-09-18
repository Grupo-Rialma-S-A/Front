"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/lib/api";
import { User } from "@/types/user";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";

export default function OrcarMaterial() {
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
        <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-lg p-8 shadow-lg">
          <div className="text-green-800 text-xl font-semibold flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />

      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-center py-4 px-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-100/90 backdrop-blur-sm cursor-pointer border-2 border-green-200 text-green-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-200/90 transition-colors shadow-sm"
          >
            ← Voltar
          </button>
          <div className="text-green-800">
            <p className="text-lg font-semibold">Olá, {user.name}</p>
            <p className="text-sm text-green-700">
              {user.role === "admin" ? "Administrador" : "Usuário"}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Orçar Material
            </h1>
            <p className="text-green-700">
              Calcule custos de materiais e gerencie orçamentos
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-lg shadow-lg">
            <div className="bg-green-100/80 backdrop-blur-sm border-b-2 border-green-200 p-6 rounded-t-lg text-center">
              <h2 className="text-2xl font-bold text-green-800">
                Funcionalidade em Desenvolvimento
              </h2>
            </div>

            <div className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-8xl mb-6">💰</div>
                <h3 className="text-4xl font-bold text-green-700 mb-4">
                  Em breve...
                </h3>
                <p className="text-lg text-gray-600 max-w-md mb-6">
                  Esta funcionalidade está em desenvolvimento e estará
                  disponível em breve para facilitar o orçamento de materiais
                  para sua propriedade rural.
                </p>
                <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    <strong>Recursos que estarão disponíveis:</strong>
                  </p>
                  <ul className="text-sm text-green-600 mt-2 space-y-1">
                    <li>• Catálogo completo de materiais agropecuários</li>
                    <li>• Cálculo automático de custos e subtotais</li>

                    <li>• Geração de orçamentos em PDF</li>
                    <li>• Histórico de orçamentos realizados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
