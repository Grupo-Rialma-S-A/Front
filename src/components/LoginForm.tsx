"use client";

import { useState, type FormEvent } from "react";
import { authenticateUser, login, shouldChangePassword } from "@/lib/api";
import { useRouter } from "next/navigation";
import AnimatedBackground from "./AnimatedBackground";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await authenticateUser(email, password);

      if (result.success && result.user) {
        login(result.user);

        // Verifica se o usuário precisa trocar a senha
        if (result.user.trocarSenha) {
          router.push("/trocar-senha");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.error || "Erro na autenticação");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      <AnimatedBackground />

      <div className="mb-8 relative z-10">
        <img
          src="/logo.png"
          alt="Rialma Logo"
          className=" h-32 mx-auto drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-lg w-full max-w-md relative z-10 shadow-lg">
        <div className="bg-green-100 border-b-2 border-green-200 p-4 text-center rounded-t-lg">
          <h1 className="text-xl font-bold text-green-800 mb-2">
            Sistema Rialma
          </h1>
          <p className="text-sm text-green-700">Gestão Agropecuária</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 p-3 text-sm rounded-md">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-sm text-gray-900 focus:border-green-600 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Senha:
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-sm text-gray-900 focus:border-green-600 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-green-700 text-white py-3 font-semibold text-sm rounded-md border-2 border-green-800 hover:bg-green-800 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border-t-2 border-gray-200 p-4 rounded-b-lg">
          <div className="mt-3 text-xs text-green-700 text-center flex items-center justify-center space-x-2">
            <span>Desenvolvido por</span>
            <img
              src="/xref-logo.png"
              alt="XRef Logo"
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-semibold">XRef</span>
          </div>
        </div>
      </div>
    </div>
  );
}
