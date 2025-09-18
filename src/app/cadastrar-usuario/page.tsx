"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser, createUser } from "@/lib/api";
import { User } from "@/types/user";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";

export default function CadastrarUsuario() {
  const [user, setUser] = useState<User | null>(null);
  const [nomeUsu, setNomeUsu] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [tel] = useState<string>("(11) 3333-4444");
  const [ramal] = useState<string>("1234");
  const [cel, setCel] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [trocarSenha] = useState<string>("N");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [router]);

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, "");

    // Aplica máscara para telefone fixo (11) 3333-4444
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    // Aplica máscara para celular (11) 99999-8888
    return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleCelChange = (value: string) => {
    const formatted = formatPhone(value);
    setCel(formatted);
  };

  const validateForm = () => {
    if (!nomeUsu.trim()) {
      setMessage("Nome do usuário é obrigatório");
      setMessageType("error");
      return false;
    }

    if (nomeUsu.length < 2 || nomeUsu.length > 100) {
      setMessage("Nome deve ter entre 2 e 100 caracteres");
      setMessageType("error");
      return false;
    }

    if (!email.trim()) {
      setMessage("Email é obrigatório");
      setMessageType("error");
      return false;
    }

    if (email.length > 50) {
      setMessage("Email deve ter no máximo 50 caracteres");
      setMessageType("error");
      return false;
    }

    if (!senha.trim()) {
      setMessage("Senha é obrigatória");
      setMessageType("error");
      return false;
    }

    if (senha.length < 6 || senha.length > 128) {
      setMessage("Senha deve ter entre 6 e 128 caracteres");
      setMessageType("error");
      return false;
    }

    if (cel && cel.replace(/\D/g, "").length < 10) {
      setMessage("Celular deve ter pelo menos 10 dígitos");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userData = {
        nomeUsu: nomeUsu.trim(),
        email: email.trim().toLowerCase(),
        tel,
        ramal,
        cel: cel || undefined, // Só envia se tiver valor
        senha,
        trocarSenha,
      };

      console.log("Enviando dados para a API:", userData);

      const result = await createUser(userData);

      if (result.success) {
        setMessage(`Usuário ${nomeUsu} cadastrado com sucesso!`);
        setMessageType("success");

        setNomeUsu("");
        setEmail("");
        setCel("");
        setSenha("");

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage(
          result.message || result.error || "Erro ao cadastrar usuário"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMessage("Erro de conexão. Verifique sua internet e tente novamente.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
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

        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              👤 Cadastrar Usuário
            </h1>
            <p className="text-green-700">
              Adicione um novo usuário ao sistema
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-lg shadow-lg">
            <div className="bg-green-100/80 backdrop-blur-sm border-b-2 border-green-200 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-green-800">
                Dados do Usuário
              </h2>
            </div>

            <div className="p-8">
              {message && (
                <div
                  className={`mb-6 px-4 py-3 rounded-lg ${
                    messageType === "error"
                      ? "bg-red-100 border border-red-400 text-red-700"
                      : "bg-green-100 border border-green-400 text-green-700"
                  }`}
                >
                  {messageType === "success" ? "✅ " : "⚠️ "}
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Nome do Usuário *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90 backdrop-blur-sm transition-all text-gray-900 placeholder-gray-500"
                    value={nomeUsu}
                    onChange={(e) => setNomeUsu(e.target.value)}
                    required
                    placeholder="Ex: Teste123"
                    minLength={2}
                    maxLength={100}
                    disabled={loading}
                  />
                  <p className="text-xs text-green-600 mt-1">
                    Mínimo 2, máximo 100 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90 backdrop-blur-sm transition-all text-gray-900 placeholder-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="teste123@gmail.com"
                    maxLength={50}
                    disabled={loading}
                  />
                  <p className="text-xs text-green-600 mt-1">
                    Máximo 50 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Celular
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90 backdrop-blur-sm transition-all text-gray-900 placeholder-gray-500"
                    value={cel}
                    onChange={(e) => handleCelChange(e.target.value)}
                    placeholder="(11) 99999-8888"
                    maxLength={20}
                    disabled={loading}
                  />
                  <p className="text-xs text-green-600 mt-1">
                    Opcional - Máximo 20 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90 backdrop-blur-sm transition-all text-gray-900 placeholder-gray-500"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      maxLength={128}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Mínimo 6, máximo 128 caracteres
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-green-200">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-3 cursor-pointer bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Cadastrando...
                      </div>
                    ) : (
                      "Cadastrar Usuário"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
