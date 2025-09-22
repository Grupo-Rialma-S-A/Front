"use client";

import { useState, type FormEvent } from "react";
import { authenticateUser, shouldChangePassword } from "@/lib/api";
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
        // O authenticateUser já salva automaticamente o usuário e tokens no localStorage
        // Não precisamos mais chamar login() manualmente

        // Verifica se o usuário precisa trocar a senha
        if (shouldChangePassword()) {
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

      {/* Logo Section */}
      <div className="mb-12 relative z-10 text-center">
        {/* <div className="bg-white/10 backdrop-blur-md rounded-full p-8 mb-6 inline-block shadow-2xl border border-white/20"> */}
        <img
          src="/logo.png"
          alt="Rialma Logo"
          className="h-24 rounded-2xl  w-auto mx-auto drop-shadow-2xl filter brightness-110"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* </div> */}
        {/* <h1 className="text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-lg">
          Sistema Rialma
        </h1>
        <p className="text-blue-100 text-lg font-medium drop-shadow-md">
          Gestão Agropecuária Inteligente
        </p> */}
      </div>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-slate-600 p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Acesso Seguro</h2>
          </div>
          <p className="text-blue-50 text-sm opacity-90">
            Entre com suas credenciais
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-red-700 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-slate-500 group-focus-within:text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-slate-500 group-focus-within:text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Senha
                  </span>
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-slate-600 hover:from-blue-500 hover:via-blue-400 hover:to-slate-500 text-white py-4 font-bold text-base rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                  <span className="text-lg">Entrando...</span>
                </div>
              ) : (
                <span className=" cursor-pointer relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                    />
                  </svg>
                  ENTRAR NO SISTEMA
                </span>
              )}
            </button>
          </form>

          {/* Additional Options */}
          {/* <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                Esqueceu sua senha?
              </button>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-100 to-blue-50 border-t border-slate-200 px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 text-slate-600">
              <span className="text-sm">Desenvolvido por</span>
              <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                <img
                  src="/xref-logo.png"
                  alt="XRef Logo"
                  className="w-5 h-5"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="font-bold text-blue-700 text-sm">
                  Xref Solutions Partners
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Tecnologia e Inovação</p>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-8 relative z-10">
        <div className="flex items-center justify-center text-white/80 text-sm">
          {/* <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg> */}
          {/* <span>Conexão Segura SSL</span> */}
        </div>
      </div>
    </div>
  );
}
