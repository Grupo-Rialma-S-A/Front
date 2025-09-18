"use client";

import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white shadow-lg rounded-lg mb-8">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="Rialma Logo"
            className="w-12 h-12 rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rialma</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Olá, {user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Desenvolvido por</span>
          <img
            src="/xref-logo.png"
            alt="XRef Logo"
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="font-semibold">XRef</span>
        </div>
      </div>
    </header>
  );
}
