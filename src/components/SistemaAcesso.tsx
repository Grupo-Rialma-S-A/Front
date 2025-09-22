"use client";

import { useState, FormEvent } from "react";
import { createUser } from "@/lib/api";
import { User } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";
import CadastrarUsuario from "./CadastrarUsuario";
import ListarUsuarios from "./ListarUsuarios";
import CargosPermissoes from "./CargosPermissoes";

interface SistemaAcessoProps {
  user: User;
}

// Componente principal SistemaAcesso
export default function SistemaAcesso({ user }: SistemaAcessoProps) {
  const [activeTab, setActiveTab] = useState<string>("cadastrar");

  const tabs = [
    { id: "cadastrar", label: "Cadastrar Usuário", icon: "👤" },
    { id: "lista_usuario", label: "Lista de Usuários", icon: "📄" },
    { id: "cargos_permissoes", label: "Cargos e Permissões", icon: "🔑" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "cadastrar":
        return <CadastrarUsuario user={user} />;
      case "lista_usuario":
        return <ListarUsuarios user={user} />;
      case "cargos_permissoes":
        return <CargosPermissoes user={user} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-blue-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-t-lg cursor-pointer ${
              index === 0 ? "ml-4" : "" // Adiciona margin-left apenas no primeiro item
            } ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {/* <span className="mr-2">{tab.icon}</span> */}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border-t border-gray-200">{renderContent()}</div>
    </div>
  );
}
