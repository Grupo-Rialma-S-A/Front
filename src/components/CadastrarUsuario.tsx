"use client";

import { useState, FormEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Clear,
} from "@mui/icons-material";
import { apiCall } from "@/lib/api";
import { User } from "@/types/user";

interface CadastrarUsuarioProps {
  user: User;
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

export default function CadastrarUsuario({ user }: CadastrarUsuarioProps) {
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

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
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
        cel: cel || undefined,
        senha,
        trocarSenha,
      };

      // Usando a nova função apiCall com gerenciamento automático de tokens
      const result: CreateUserApiResponse = await apiCall("/users", {
        method: "POST",
        body: userData,
        requireAuth: true, // Esta operação requer autenticação
      });

      if (result.success) {
        setMessage(`Usuário ${nomeUsu} cadastrado com sucesso!`);
        setMessageType("success");

        // Limpa o formulário após sucesso
        setNomeUsu("");
        setEmail("");
        setCel("");
        setSenha("");
      } else {
        setMessage(
          result.message || result.error || "Erro ao cadastrar usuário"
        );
        setMessageType("error");
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);

      // Tratamento específico de erros
      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
        setMessageType("error");
        // O sistema já fará o logout automático via apiCall
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para realizar esta operação.");
        setMessageType("error");
      } else {
        setMessage(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
        setMessageType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setNomeUsu("");
    setEmail("");
    setCel("");
    setSenha("");
    setMessage("");
    setMessageType("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ maxWidth: "600px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e3a8a",
              mb: 0.5,
            }}
          >
            Cadastrar Usuário
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
            }}
          >
            Adicione um novo usuário ao sistema
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid #bfdbfe",
            borderRadius: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              borderBottom: "1px solid #bfdbfe",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonAdd sx={{ fontSize: 20 }} />
              Dados do Usuário
            </Typography>
          </Box>

          {/* Card Content */}
          <CardContent sx={{ p: 3 }}>
            {/* Messages */}
            {message && (
              <Alert
                severity={messageType === "error" ? "error" : "success"}
                sx={{ mb: 3 }}
                onClose={() => setMessage("")}
              >
                {message}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Nome do Usuário */}
                <Box>
                  <TextField
                    fullWidth
                    label="Nome do Usuário *"
                    value={nomeUsu}
                    onChange={(e) => setNomeUsu(e.target.value)}
                    placeholder="Ex: Teste123"
                    disabled={loading}
                    required
                    inputProps={{
                      minLength: 2,
                      maxLength: 100,
                    }}
                    helperText="Mínimo 2, máximo 100 caracteres"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "& fieldset": { borderColor: "#3b82f6" },
                        "&:hover fieldset": { borderColor: "#2563eb" },
                        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                      },
                      "& .MuiInputLabel-root": { color: "#1e3a8a" },
                      "& .MuiFormHelperText-root": { color: "#3b82f6" },
                    }}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teste123@gmail.com"
                    disabled={loading}
                    required
                    inputProps={{
                      maxLength: 50,
                    }}
                    helperText="Máximo 50 caracteres"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "& fieldset": { borderColor: "#3b82f6" },
                        "&:hover fieldset": { borderColor: "#2563eb" },
                        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                      },
                      "& .MuiInputLabel-root": { color: "#1e3a8a" },
                      "& .MuiFormHelperText-root": { color: "#3b82f6" },
                    }}
                  />
                </Box>

                {/* Celular */}
                <Box>
                  <TextField
                    fullWidth
                    label="Celular"
                    value={cel}
                    onChange={(e) => handleCelChange(e.target.value)}
                    placeholder="(11) 99999-8888"
                    disabled={loading}
                    inputProps={{
                      maxLength: 20,
                    }}
                    helperText="Opcional - Máximo 20 caracteres"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "& fieldset": { borderColor: "#3b82f6" },
                        "&:hover fieldset": { borderColor: "#2563eb" },
                        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                      },
                      "& .MuiInputLabel-root": { color: "#1e3a8a" },
                      "& .MuiFormHelperText-root": { color: "#3b82f6" },
                    }}
                  />
                </Box>

                {/* Senha */}
                <Box>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Senha *"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    inputProps={{
                      minLength: 6,
                      maxLength: 128,
                    }}
                    helperText="Mínimo 6, máximo 128 caracteres"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            edge="end"
                            sx={{ color: "#3b82f6" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "& fieldset": { borderColor: "#3b82f6" },
                        "&:hover fieldset": { borderColor: "#2563eb" },
                        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                      },
                      "& .MuiInputLabel-root": { color: "#1e3a8a" },
                      "& .MuiFormHelperText-root": { color: "#3b82f6" },
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    pt: 2,
                    borderTop: "1px solid #bfdbfe",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleClearForm}
                    disabled={loading}
                    startIcon={<Clear />}
                    sx={{
                      borderColor: "#6b7280",
                      color: "#6b7280",
                      "&:hover": {
                        borderColor: "#4b5563",
                        backgroundColor: "rgba(107, 114, 128, 0.04)",
                      },
                      fontWeight: 600,
                    }}
                  >
                    Limpar
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} sx={{ color: "white" }} />
                      ) : (
                        <PersonAdd />
                      )
                    }
                    sx={{
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      fontWeight: 600,
                      minWidth: 160,
                    }}
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Usuário"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
