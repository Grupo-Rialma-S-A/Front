import { User, AuthResult } from "@/types/user";

// Interfaces atualizadas
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
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  error?: string;
}

interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  logout?: boolean;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
  result?: {
    CodUsu: number;
    NomeUsu: string;
    TrocarSenha: string;
    Logado: string;
  };
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Interfaces para dados armazenados no localStorage
interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

interface StoredUserData {
  user: User;
  tokens: StoredTokens;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Função para salvar dados do usuário e tokens no localStorage
const saveUserData = (user: User, tokens: StoredTokens): void => {
  if (typeof window === "undefined") return;
  const userData: StoredUserData = { user, tokens };
  localStorage.setItem("rialma_user_data", JSON.stringify(userData));
};

// Função para obter dados do usuário e tokens do localStorage
const getUserData = (): StoredUserData | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("rialma_user_data");
  return data ? JSON.parse(data) : null;
};

// Função para limpar dados do localStorage
const clearUserData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rialma_user_data");
  localStorage.removeItem("rialma_user"); // Remove também o antigo formato se existir
};

// Função para renovar o access token
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const userData = getUserData();
    if (!userData || !userData.tokens.refreshToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: userData.tokens.refreshToken,
        codUser: userData.user.id,
      }),
    });

    const data: RefreshTokenResponse = await response.json();

    if (data.success && data.tokens) {
      // Atualiza os tokens no localStorage
      const newTokens: StoredTokens = {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresIn: data.tokens.expiresIn,
        tokenType: data.tokens.tokenType,
      };

      saveUserData(userData.user, newTokens);
      return true;
    } else if (data.logout) {
      // Refresh token inválido - fazer logout
      await performLogout();
      return false;
    }

    return false;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return false;
  }
};

// Função para fazer logout no servidor
const performLogout = async (): Promise<void> => {
  try {
    const userData = getUserData();
    if (userData) {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codUsu: userData.user.id,
        }),
      });
    }
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    clearUserData();
    // Redirecionar para página de login se necessário
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

// FUNÇÃO PRINCIPAL para fazer chamadas à API com gerenciamento automático de tokens
export const apiCall = async (
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<any> => {
  const { method = "GET", body, headers = {}, requireAuth = true } = options;

  // Função auxiliar para fazer a requisição
  const makeRequest = async (accessToken?: string): Promise<Response> => {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Adiciona o token de autorização se necessário
    if (requireAuth && accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  try {
    let response: Response;

    if (requireAuth) {
      const userData = getUserData();

      if (!userData || !userData.tokens.accessToken) {
        throw new Error("Usuário não autenticado");
      }

      // Primeira tentativa com o token atual
      response = await makeRequest(userData.tokens.accessToken);

      // Se retornou 401 (não autorizado), tenta renovar o token
      if (response.status === 401) {
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          // Pega os novos dados após o refresh
          const newUserData = getUserData();
          if (newUserData) {
            // Refaz a requisição com o novo token
            response = await makeRequest(newUserData.tokens.accessToken);
          } else {
            throw new Error("Erro ao obter novos tokens");
          }
        } else {
          // Refresh falhou - usuário será deslogado pela função refreshAccessToken
          throw new Error("Sessão expirada");
        }
      }
    } else {
      // Requisição que não precisa de autenticação
      response = await makeRequest();
    }

    // Parse da resposta
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || `Erro HTTP: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(`Erro na chamada da API para ${endpoint}:`, error);
    throw error;
  }
};

// Função de autenticação atualizada
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

    if (data.success && data.data && data.tokens) {
      const user: User = {
        id: data.data.codUsu,
        email: data.data.email,
        name: data.data.nomeUsu,
        role: "Membro",
        trocarSenha: data.data.trocarSenha === "S",
      };

      const tokens: StoredTokens = {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresIn: data.tokens.expiresIn,
        tokenType: data.tokens.tokenType,
      };
      // console.log("Tokens recebidos:", tokens);
      // Salva os dados completos no localStorage
      saveUserData(user, tokens);

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

// Funções auxiliares atualizadas
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const userData = getUserData();
  return !!(userData && userData.user && userData.tokens.accessToken);
};

export const getCurrentUser = (): User | null => {
  const userData = getUserData();
  return userData ? userData.user : null;
};

export const login = (user: User): void => {
  // Esta função agora é principalmente para compatibilidade
  // Os tokens devem ser salvos via saveUserData
  console.warn(
    "Use saveUserData instead of login for complete token management"
  );
};

export const logout = async (): Promise<void> => {
  await performLogout();
};

export const shouldChangePassword = (): boolean => {
  const user = getCurrentUser();
  return user?.trocarSenha === true;
};

// Interface para dados de cadastro de usuário (mantida igual)
interface CreateUserData {
  nomeUsu: string;
  email: string;
  tel?: string;
  ramal?: string;
  cel?: string;
  senha: string;
  trocarSenha?: string;
}

interface CreateUserApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  userId?: string;
  error?: string;
  executionTime?: number;
}

// Função de cadastro usando a nova apiCall
export const createUser = async (
  userData: CreateUserData
): Promise<CreateUserApiResponse> => {
  try {
    const data = await apiCall("/users", {
      method: "POST",
      body: {
        nomeUsu: userData.nomeUsu,
        email: userData.email,
        tel: userData.tel || "(11) 3333-4444",
        ramal: userData.ramal || "1234",
        cel: userData.cel,
        senha: userData.senha,
        trocarSenha: userData.trocarSenha || "N",
      },
      requireAuth: false, // Cadastro não precisa de autenticação
    });

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

// Função de refresh manual (agora usa a função interna)
export const refreshAuth = async (): Promise<boolean> => {
  return await refreshAccessToken();
};

// Exemplo de uso da nova função apiCall:
/*
// Para chamadas que precisam de autenticação:
const userData = await apiCall("/users/profile", {
  method: "GET",
  requireAuth: true
});

// Para chamadas que não precisam de autenticação:
const publicData = await apiCall("/public/data", {
  method: "GET",
  requireAuth: false
});

// Para POST com dados:
const result = await apiCall("/users/update", {
  method: "POST",
  body: { name: "Novo Nome" },
  requireAuth: true
});
*/
