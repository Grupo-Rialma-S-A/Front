export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user" | "Membro";
  trocarSenha: boolean;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cargo: string;
  departamento: string;
  telefone: string;
}
