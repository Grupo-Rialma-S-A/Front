"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search,
  Refresh,
  Delete,
  Add,
  Lock,
  LockOpen,
} from "@mui/icons-material";
import { apiCall } from "@/lib/api";

interface Cargo {
  CodGrupoUsu: string;
  DescrGrupoUsu: string;
  permissoes?: string[];
}

interface CargosPermissoesProps {
  user: any;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    grupos: Cargo[];
  };
}

interface CreateGroupApiResponse {
  success: boolean;
  message: string;
  data: {
    codGrupoUsu: string;
    descrGrupoUsu: string;
  };
}

export default function CargosPermissoes({ user }: CargosPermissoesProps) {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newCargo, setNewCargo] = useState({
    CodGrupoUsu: "",
    DescrGrupoUsu: "",
  });

  useEffect(() => {
    loadCargos();
  }, []);

  const loadCargos = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      // Usando a nova função apiCall com gerenciamento automático de tokens
      const data: ApiResponse = await apiCall("/permissions/grupos", {
        method: "GET",
        requireAuth: true,
      });

      if (data.success && data.data && data.data.grupos) {
        // Adiciona campo de permissões vazio para cada cargo
        const cargosComPermissoes = data.data.grupos.map((cargo) => ({
          ...cargo,
          permissoes: [], // Campo vazio conforme solicitado
        }));

        setCargos(cargosComPermissoes);
        setMessage(
          `${data.data.grupos.length} cargo(s) carregado(s) com sucesso!`
        );
        setMessageType("success");
      } else {
        throw new Error(data.message || "Erro ao processar dados da API");
      }
    } catch (error: any) {
      console.error("Erro ao carregar cargos:", error);

      // Tratamento específico de erros de autenticação
      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
        setMessageType("error");
        // O sistema já fará o logout automático via apiCall
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para visualizar os cargos.");
        setMessageType("error");
      } else {
        setMessage("Erro ao carregar lista de cargos");
        setMessageType("error");
      }
      setCargos([]);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeText = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCreateCargo = async () => {
    try {
      setLoading(true);

      // Validar campos
      if (!newCargo.CodGrupoUsu.trim() || !newCargo.DescrGrupoUsu.trim()) {
        setMessage("Preencha todos os campos obrigatórios");
        setMessageType("error");
        return;
      }

      // Validar tamanho do código do grupo
      if (newCargo.CodGrupoUsu.length > 10) {
        setMessage("O nome do cargo deve ter no máximo 10 caracteres");
        setMessageType("error");
        return;
      }

      // Validar tamanho da descrição
      if (newCargo.DescrGrupoUsu.length > 80) {
        setMessage("A descrição deve ter no máximo 80 caracteres");
        setMessageType("error");
        return;
      }

      // Usando apiCall para criar novo grupo
      const data: CreateGroupApiResponse = await apiCall(
        "/permissions/grupo-usuario",
        {
          method: "POST",
          body: {
            codGrupoUsu: newCargo.CodGrupoUsu.toUpperCase(),
            descrGrupoUsu: newCargo.DescrGrupoUsu,
          },
          requireAuth: true,
        }
      );

      if (data.success && data.data) {
        // Criar objeto do novo cargo para adicionar à lista local
        const novoCargo: Cargo = {
          CodGrupoUsu: data.data.codGrupoUsu,
          DescrGrupoUsu: data.data.descrGrupoUsu,
          permissoes: [], // Permissões vazias
        };

        // Adicionar à lista local
        setCargos([...cargos, novoCargo]);

        // Fechar modal e limpar campos
        setOpenModal(false);
        setNewCargo({ CodGrupoUsu: "", DescrGrupoUsu: "" });

        // Mostrar mensagem de sucesso
        setMessage(
          data.message || `Cargo ${novoCargo.CodGrupoUsu} criado com sucesso!`
        );
        setMessageType("success");
      } else {
        throw new Error(data.message || "Erro ao processar resposta da API");
      }
    } catch (error: any) {
      console.error("Erro ao criar cargo:", error);

      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para realizar esta operação.");
      } else {
        setMessage(
          error instanceof Error ? error.message : "Erro ao criar cargo"
        );
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCargo = async (codGrupo: string, nomeCargo: string) => {
    try {
      setLoading(true);

      // Usando apiCall para excluir cargo
      await apiCall(`/permissions/grupo-usuario/${codGrupo}`, {
        method: "DELETE",
        requireAuth: true,
      });

      // Atualizar lista local após sucesso
      const cargosAtualizados = cargos.filter(
        (cargo) => cargo.CodGrupoUsu !== codGrupo
      );
      setCargos(cargosAtualizados);
      setMessage(`Cargo ${nomeCargo} excluído com sucesso!`);
      setMessageType("success");
    } catch (error: any) {
      console.error("Erro ao excluir cargo:", error);

      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para realizar esta operação.");
      } else {
        setMessage("Erro ao excluir cargo");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCargos = cargos.filter(
    (cargo) =>
      cargo.CodGrupoUsu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.DescrGrupoUsu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
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
            Cargos e Permissões
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
            }}
          >
            Gerencie os cargos e permissões do sistema
          </Typography>
        </Box>

        {/* Card Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            border: "1px solid #bfdbfe",
            borderRadius: "8px 8px 0 0",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                fontSize: "1rem",
              }}
            >
              Cargos Disponíveis ({filteredCargos.length})
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#6b7280", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={loadCargos}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} sx={{ color: "white" }} />
                  ) : (
                    <Refresh />
                  )
                }
                sx={{
                  backgroundColor: "#2563eb",
                  "&:hover": { backgroundColor: "#1d4ed8" },
                  fontWeight: 600,
                }}
              >
                {loading ? "Carregando..." : "Atualizar"}
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                startIcon={<Add />}
                sx={{
                  backgroundColor: "#16a34a",
                  "&:hover": { backgroundColor: "#15803d" },
                  fontWeight: 600,
                }}
              >
                Novo Cargo
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Card Content */}
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid #bfdbfe",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            p: 3,
          }}
        >
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

          {/* Loading State */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress sx={{ mb: 2, color: "#2563eb" }} />
              <Typography variant="body2" sx={{ color: "#3b82f6" }}>
                Carregando cargos...
              </Typography>
            </Box>
          ) : (
            /* Cargos List */
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredCargos.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="body1" sx={{ color: "#3b82f6" }}>
                    {searchTerm
                      ? "Nenhum cargo encontrado com os critérios de busca."
                      : "Nenhum cargo cadastrado."}
                  </Typography>
                </Box>
              ) : (
                filteredCargos.map((cargo) => (
                  <Card
                    key={cargo.CodGrupoUsu}
                    sx={{
                      border: "1px solid #bfdbfe",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(5px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                      overflow: "visible",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.01)",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 3,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 3,
                          }}
                        >
                          {/* Nome do Cargo */}
                          <Box sx={{ flex: 1 }}>
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#1e3a8a",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Nome do Cargo:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: "#111827",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                  }}
                                >
                                  {capitalizeText(cargo.CodGrupoUsu)}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>

                          {/* Descrição */}
                          <Box sx={{ flex: 2 }}>
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#1e3a8a",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Descrição:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#374151" }}
                                >
                                  {cargo.DescrGrupoUsu}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>

                          {/* Permissões */}
                          <Box sx={{ flex: 1 }}>
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#1e3a8a",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Permissões:
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                    mt: 0.5,
                                  }}
                                >
                                  {cargo.permissoes &&
                                  cargo.permissoes.length > 0 ? (
                                    cargo.permissoes.map((permissao, index) => (
                                      <Chip
                                        key={index}
                                        label={capitalizeText(permissao)}
                                        size="small"
                                        sx={{
                                          backgroundColor: "#dbeafe",
                                          color: "#1e40af",
                                          fontWeight: 500,
                                          fontSize: "0.7rem",
                                          height: "20px",
                                        }}
                                      />
                                    ))
                                  ) : (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "#6b7280",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      Nenhuma permissão definida
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Stack spacing={1} sx={{ minWidth: 120 }}>
                          <Tooltip title="Excluir cargo">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                handleDeleteCargo(
                                  cargo.CodGrupoUsu,
                                  cargo.CodGrupoUsu
                                )
                              }
                              startIcon={<Delete />}
                              sx={{
                                backgroundColor: "#dc2626",
                                "&:hover": { backgroundColor: "#b91c1c" },
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            >
                              Excluir
                            </Button>
                          </Tooltip>

                          <Tooltip title="Gerenciar permissões">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {}}
                              startIcon={<LockOpen />}
                              sx={{
                                backgroundColor: "#9333ea",
                                "&:hover": { backgroundColor: "#7e22ce" },
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            >
                              Permissões
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal para criar novo cargo */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#dbeafe", color: "#1e3a8a" }}>
          Criar Novo Cargo
        </DialogTitle>
        <DialogContent sx={{ pt: "24px!important" }}>
          <Stack spacing={2}>
            <TextField
              label="Nome do Cargo"
              value={newCargo.CodGrupoUsu}
              onChange={(e) =>
                setNewCargo({ ...newCargo, CodGrupoUsu: e.target.value })
              }
              fullWidth
              required
              inputProps={{ maxLength: 10 }}
              helperText={`${newCargo.CodGrupoUsu.length}/10 caracteres`}
              error={newCargo.CodGrupoUsu.length > 10}
            />
            <TextField
              label="Descrição"
              value={newCargo.DescrGrupoUsu}
              onChange={(e) =>
                setNewCargo({ ...newCargo, DescrGrupoUsu: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              required
              inputProps={{ maxLength: 80 }}
              helperText={`${newCargo.DescrGrupoUsu.length}/80 caracteres`}
              error={newCargo.DescrGrupoUsu.length > 80}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateCargo}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#15803d" },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Criar Cargo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
