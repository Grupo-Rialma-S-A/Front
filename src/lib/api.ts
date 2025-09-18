import { User, AuthResult } from "@/types/user";

interface LoginApiResponse {
  success: boolean;
  message?: string;
  result?: number;
  data?: {
    codUsu: number;
    nomeUsu: string;
    email: string;
    trocarSenha: string;
  };
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: password,
      }),
    });

    const data: LoginApiResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Erro na autenticação",
      };
    }

    if (data.success && data.data) {
      const user: User = {
        id: data.data.codUsu,
        email: data.data.email,
        name: data.data.nomeUsu,
        role: "Membro",
        trocarSenha: data.data.trocarSenha === "S",
      };

      return {
        success: true,
        user: user,
      };
    } else {
      return {
        success: false,
        error: data.message || "Credenciais inválidas",
      };
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return {
      success: false,
      error: "Erro de conexão. Tente novamente.",
    };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const user = localStorage.getItem("rialma_user");
  return !!user;
};

// Função para obter o usuário atual do localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("rialma_user");
  return user ? JSON.parse(user) : null;
};

// Função para fazer login (salvar no localStorage)
export const login = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("rialma_user", JSON.stringify(user));
};

// Função para fazer logout (remover do localStorage)
export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rialma_user");
};

// Função para verificar se o usuário precisa trocar a senha
export const shouldChangePassword = (): boolean => {
  const user = getCurrentUser();
  return user?.trocarSenha === true;
};

// Interface para dados de cadastro de usuário
interface CreateUserData {
  nomeUsu: string;
  email: string;
  tel?: string;
  ramal?: string;
  cel?: string;
  senha: string;
  trocarSenha?: string;
}

// Interface para o response da API de cadastro
interface CreateUserApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  userId?: string;
  error?: string;
  executionTime?: number;
}

// Função para cadastrar usuário
export const createUser = async (
  userData: CreateUserData
): Promise<CreateUserApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeUsu: userData.nomeUsu,
        email: userData.email,
        tel: userData.tel || "(11) 3333-4444",
        ramal: userData.ramal || "1234",
        cel: userData.cel,
        senha: userData.senha,
        trocarSenha: userData.trocarSenha || "N",
      }),
    });

    const data: CreateUserApiResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erro ao cadastrar usuário",
        error: data.error || "Erro na requisição",
      };
    }

    return data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return {
      success: false,
      message: "Erro de conexão. Tente novamente.",
      error: "Network error",
    };
  }
};

// Função auxiliar para fazer refresh do token se necessário (para implementação futura)
export const refreshAuth = async (): Promise<boolean> => {
  // Implementar quando houver sistema de refresh token
  return true;
};
