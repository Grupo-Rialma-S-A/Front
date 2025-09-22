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
} from "@mui/material";
import { Search, Refresh, Edit, Lock, LockOpen } from "@mui/icons-material";
import { User } from "@/types/user";
import { apiCall } from "@/lib/api";
import EditUserModal from "./modals/EditUserModal";
import BlockConfirmationModal from "./modals/BlockConfirmationModal";

export interface Usuario {
  CodUsu: number;
  name: string;
  email: string;
  tel: string;
  ramal: string;
  cel: string;
  trocarSenha: string;
  DataInc: string;
  DataAlt: string | null;
  DataBloqueado: string | null;
  Logado: string | null;
  CodGrupoUsu: string;
}

interface ListarUsuariosProps {
  user: User;
}

interface ApiResponse {
  success: boolean;
  data: {
    CodUsu: number;
    NomeUsu: string;
    Email: string;
    Tel: string | null;
    Ramal: string | null;
    Cel: string | null;
    TrocarSenha: string;
    DataInc: string;
    DataAlt: string | null;
    DataBloqueado: string | null;
    Logado: string | null;
  }[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export default function ListarUsuarios({ user }: ListarUsuariosProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Estados dos modais
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [confirmAction, setConfirmAction] = useState<string>("");

  // Estados do formulário de edição
  const [editForm, setEditForm] = useState({
    nomeUsu: "",
    email: "",
    cel: "",
    tel: "",
    ramal: "",
    codGrupoUsu: "",
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      // Usando a nova função apiCall com gerenciamento automático de tokens
      const data: ApiResponse = await apiCall("/users", {
        method: "GET",
        requireAuth: true,
      });

      if (data.success && data.data) {
        // Mapear os dados da API para o formato esperado pelo componente
        const usuariosMapeados: Usuario[] = data.data.map((apiUser) => ({
          CodUsu: apiUser.CodUsu,
          name: apiUser.NomeUsu,
          email: apiUser.Email,
          tel: apiUser.Tel || "",
          ramal: apiUser.Ramal || "",
          cel: apiUser.Cel || "",
          trocarSenha: apiUser.TrocarSenha,
          DataInc: apiUser.DataInc,
          DataAlt: apiUser.DataAlt,
          DataBloqueado: apiUser.DataBloqueado,
          Logado: apiUser.Logado,
          CodGrupoUsu: "", // Deixar vazio por enquanto, conforme solicitado
        }));

        setUsuarios(usuariosMapeados);
        setMessage(`${data.total} usuário(s) carregado(s) com sucesso!`);
        setMessageType("success");
      } else {
        throw new Error(data.message || "Erro ao carregar usuários");
      }
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);

      // Tratamento específico de erros de autenticação
      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
        setMessageType("error");
        // O sistema já fará o logout automático via apiCall
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para visualizar os usuários.");
        setMessageType("error");
      } else {
        setMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar lista de usuários"
        );
        setMessageType("error");
      }
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const capitalizeUserType = (userType: string) => {
    if (!userType) return "Não definido";
    return userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
  };

  const getUserTypeColor = (userType: string) => {
    if (!userType) {
      return { backgroundColor: "#f3f4f6", color: "#374151" };
    }

    const type = userType.toUpperCase();
    switch (type) {
      case "ADMIN":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      case "DIRETOR":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "MEMBRO":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  const handleCelChange = (value: string) => {
    const formatted = formatPhone(value);
    setEditForm((prev) => ({ ...prev, cel: formatted }));
  };

  const openEditModal = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setEditForm({
      nomeUsu: usuario.name,
      email: usuario.email,
      cel: usuario.cel,
      tel: usuario.tel,
      ramal: usuario.ramal,
      codGrupoUsu: usuario.CodGrupoUsu,
    });
    setShowEditModal(true);
    setMessage("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditForm({
      nomeUsu: "",
      email: "",
      cel: "",
      tel: "",
      ramal: "",
      codGrupoUsu: "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setEditLoading(true);
    try {
      // Usando apiCall para atualizar usuário com gerenciamento automático de tokens
      await apiCall(`/users/${selectedUser.CodUsu}`, {
        method: "PUT",
        body: {
          nomeUsu: editForm.nomeUsu,
          email: editForm.email,
          cel: editForm.cel,
          tel: editForm.tel,
          ramal: editForm.ramal,
          codGrupoUsu: editForm.codGrupoUsu,
        },
        requireAuth: true,
      });

      // Atualiza o estado local após sucesso
      setUsuarios((prev) =>
        prev.map((u) =>
          u.CodUsu === selectedUser.CodUsu
            ? {
                ...u,
                name: editForm.nomeUsu,
                email: editForm.email,
                cel: editForm.cel,
                tel: editForm.tel,
                ramal: editForm.ramal,
                CodGrupoUsu: editForm.codGrupoUsu,
                DataAlt: new Date().toISOString(),
              }
            : u
        )
      );

      setMessage(`Usuário ${editForm.nomeUsu} atualizado com sucesso!`);
      setMessageType("success");
      closeEditModal();
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);

      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para realizar esta operação.");
      } else {
        setMessage("Erro ao atualizar usuário");
      }
      setMessageType("error");
    } finally {
      setEditLoading(false);
    }
  };

  const openConfirmModal = (usuario: Usuario, action: string) => {
    setSelectedUser(usuario);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction("");
  };

  const confirmToggleBlock = async () => {
    if (!selectedUser) return;

    try {
      const isBlocked = selectedUser.DataBloqueado !== null;
      const endpoint = isBlocked ? "/users/unblock" : "/users/block";

      // Usando apiCall para bloquear/desbloquear usuário com o novo formato
      await apiCall(endpoint, {
        method: "POST",
        body: {
          codUsu: selectedUser.CodUsu,
        },
        requireAuth: true,
      });

      // Atualiza o estado local após sucesso
      setUsuarios((prev) =>
        prev.map((u) =>
          u.CodUsu === selectedUser.CodUsu
            ? {
                ...u,
                DataBloqueado: isBlocked ? null : new Date().toISOString(),
              }
            : u
        )
      );

      setMessage(
        `Usuário ${selectedUser.name} ${
          isBlocked ? "desbloqueado" : "bloqueado"
        } com sucesso!`
      );
      setMessageType("success");
      closeConfirmModal();
    } catch (error: any) {
      console.error("Erro ao alterar status do usuário:", error);

      if (error.message === "Sessão expirada") {
        setMessage("Sua sessão expirou. Você será redirecionado para o login.");
      } else if (error.message === "Usuário não autenticado") {
        setMessage("Você precisa estar logado para realizar esta operação.");
      } else {
        setMessage("Erro ao alterar status do usuário");
      }
      setMessageType("error");
    }
  };

  const handleEdit = (usuario: Usuario) => {
    openEditModal(usuario);
  };

  const handleToggleBlock = async (usuario: Usuario) => {
    const action = usuario.DataBloqueado ? "desbloquear" : "bloquear";
    openConfirmModal(usuario, action);
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            Lista de Usuários
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
            }}
          >
            Gerencie os usuários do sistema
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
                Usuários Cadastrados ({filteredUsuarios.length})
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Buscar por nome ou email..."
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
                  onClick={loadUsuarios}
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
              </Box>
            </Box>
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
                  Carregando usuários...
                </Typography>
              </Box>
            ) : (
              /* Users List */
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredUsuarios.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="body1" sx={{ color: "#3b82f6" }}>
                      {searchTerm
                        ? "Nenhum usuário encontrado com os critérios de busca."
                        : "Nenhum usuário cadastrado."}
                    </Typography>
                  </Box>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <Card
                      key={usuario.CodUsu}
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
                            {/* Dados principais */}
                            <Box sx={{ flex: 1, position: "relative" }}>
                              {/* Tag de tipo de usuário posicionada absolutamente */}
                              <Chip
                                label={capitalizeUserType(usuario.CodGrupoUsu)}
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: -29,
                                  left: -29,
                                  zIndex: 1,
                                  ...getUserTypeColor(usuario.CodGrupoUsu),
                                  fontWeight: 500,
                                  fontSize: "0.7rem",
                                  height: "20px",
                                }}
                              />
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
                                    Nome:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: "#111827",
                                    }}
                                  >
                                    {usuario.name}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#1e3a8a",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    Email:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#374151" }}
                                  >
                                    {usuario.email}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>

                            {/* Contatos */}
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
                                    Celular:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#374151" }}
                                  >
                                    {usuario.cel || "-"}
                                  </Typography>
                                </Box>
                                {usuario.DataAlt && (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 600,
                                        color: "#1e3a8a",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Última alteração:
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "#6b7280",
                                        display: "block",
                                      }}
                                    >
                                      {formatDate(usuario.DataAlt)}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Box>

                            {/* Status e datas */}
                            <Box sx={{ flex: 1 }}>
                              <Stack spacing={1.5}>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#1e3a8a",
                                      fontSize: "0.75rem",
                                      mb: 0.5,
                                    }}
                                  >
                                    Status:
                                  </Typography>
                                  <Box>
                                    {usuario.DataBloqueado ? (
                                      <Chip
                                        icon={<Lock />}
                                        label="Bloqueado"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#fee2e2",
                                          color: "#991b1b",
                                          fontWeight: 500,
                                          "& .MuiChip-icon": {
                                            color: "#991b1b",
                                            fontSize: 16,
                                          },
                                        }}
                                      />
                                    ) : (
                                      <Chip
                                        icon={<LockOpen />}
                                        label="Ativo"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#dcfce7",
                                          color: "#166534",
                                          fontWeight: 500,
                                          "& .MuiChip-icon": {
                                            color: "#166534",
                                            fontSize: 16,
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#1e3a8a",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    Cadastro:
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#6b7280", display: "block" }}
                                  >
                                    {formatDate(usuario.DataInc)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Box>

                          {/* Action Buttons */}
                          <Stack spacing={1} sx={{ minWidth: 120 }}>
                            <Tooltip title="Editar usuário">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleEdit(usuario)}
                                startIcon={<Edit />}
                                sx={{
                                  backgroundColor: "#2563eb",
                                  "&:hover": { backgroundColor: "#1d4ed8" },
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              >
                                Editar
                              </Button>
                            </Tooltip>

                            <Tooltip
                              title={
                                usuario.DataBloqueado
                                  ? "Desbloquear usuário"
                                  : "Bloquear usuário"
                              }
                            >
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleToggleBlock(usuario)}
                                startIcon={
                                  usuario.DataBloqueado ? (
                                    <LockOpen />
                                  ) : (
                                    <Lock />
                                  )
                                }
                                sx={{
                                  backgroundColor: usuario.DataBloqueado
                                    ? "#16a34a"
                                    : "#dc2626",
                                  "&:hover": {
                                    backgroundColor: usuario.DataBloqueado
                                      ? "#15803d"
                                      : "#b91c1c",
                                  },
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {usuario.DataBloqueado
                                  ? "Desbloquear"
                                  : "Bloquear"}
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
          </CardContent>
        </Card>
      </Box>

      {/* Modals */}
      <EditUserModal
        open={showEditModal}
        onClose={closeEditModal}
        user={selectedUser}
        editForm={editForm}
        onEditFormChange={setEditForm}
        onCelChange={handleCelChange}
        loading={editLoading}
        onSubmit={handleEditSubmit}
      />

      <BlockConfirmationModal
        open={showConfirmModal}
        onClose={closeConfirmModal}
        user={selectedUser}
        action={confirmAction}
        onConfirm={confirmToggleBlock}
      />
    </Box>
  );
}
