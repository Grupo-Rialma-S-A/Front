// Componente Modal de Edição

"use client";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { User } from "@/types/user";
import { ChangeEvent, FormEvent } from "react";
import { Usuario } from "../ListarUsuarios";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: Usuario | null;
  editForm: {
    nomeUsu: string;
    email: string;
    cel: string;
    tel: string;
    ramal: string;
    codGrupoUsu: string;
  };
  onEditFormChange: (updatedForm: {
    nomeUsu: string;
    email: string;
    cel: string;
    ramal: string;
    tel: string;
    codGrupoUsu: string;
  }) => void;
  onCelChange: (value: string) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}

const EditUserModal = ({
  open,
  onClose,
  user,
  editForm,
  onEditFormChange,
  onCelChange,
  loading,
  onSubmit,
}: EditUserModalProps) => {
  // Validações dos campos
  const isNomeUsuValid =
    editForm.nomeUsu.trim().length >= 2 &&
    editForm.nomeUsu.trim().length <= 100;
  const isEmailValid =
    editForm.email.trim().length > 0 && editForm.email.trim().length <= 50;
  const isCelValid =
    editForm.cel.trim().length === 0 || editForm.cel.trim().length <= 20;
  const isCodGrupoUsuValid = editForm.codGrupoUsu.trim().length > 0;

  // Verificar se todos os campos obrigatórios são válidos
  const isFormValid =
    isNomeUsuValid && isEmailValid && isCelValid && isCodGrupoUsuValid;

  // Opções de status do usuário
  const statusOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "MODERADOR", label: "Moderador" },
    { value: "USUARIO", label: "Usuário" },
    { value: "GESTOR", label: "Gestor" },
    { value: "SUPERVISOR", label: "Supervisor" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ADMIN":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      case "MODERADOR":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "USUARIO":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "GESTOR":
        return { backgroundColor: "#ecfdf5", color: "#166534" };
      case "SUPERVISOR":
        return { backgroundColor: "#f3e8ff", color: "#7c2d12" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          borderBottom: "1px solid #e0e7ff",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1e3a8a",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          Editar Usuário
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#3b82f6",
            "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2 }}>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  mb: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                Nome do Usuário *
              </Typography>
              <TextField
                fullWidth
                size="small"
                required
                value={editForm.nomeUsu}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, nomeUsu: e.target.value })
                }
                disabled={loading}
                placeholder="Ex: Teste123"
                error={!isNomeUsuValid && editForm.nomeUsu.trim().length > 0}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": {
                      borderColor:
                        !isNomeUsuValid && editForm.nomeUsu.trim().length > 0
                          ? "#ef4444"
                          : "#3b82f6",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        !isNomeUsuValid && editForm.nomeUsu.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        !isNomeUsuValid && editForm.nomeUsu.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    !isNomeUsuValid && editForm.nomeUsu.trim().length > 0
                      ? "#ef4444"
                      : "#3b82f6",
                  fontSize: "0.75rem",
                }}
              >
                Mínimo 2, máximo 100 caracteres
              </Typography>
            </Grid>

            <Grid size={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  mb: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                Email *
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                required
                value={editForm.email}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, email: e.target.value })
                }
                disabled={loading}
                placeholder="teste123@gmail.com"
                error={!isEmailValid && editForm.email.trim().length > 0}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": {
                      borderColor:
                        !isEmailValid && editForm.email.trim().length > 0
                          ? "#ef4444"
                          : "#3b82f6",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        !isEmailValid && editForm.email.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        !isEmailValid && editForm.email.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    !isEmailValid && editForm.email.trim().length > 0
                      ? "#ef4444"
                      : "#3b82f6",
                  fontSize: "0.75rem",
                }}
              >
                Máximo 50 caracteres
              </Typography>
            </Grid>

            <Grid size={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  mb: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                Tipo de Usuário *
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={editForm.codGrupoUsu}
                  onChange={(e) =>
                    onEditFormChange({
                      ...editForm,
                      codGrupoUsu: e.target.value,
                    })
                  }
                  disabled={loading}
                  displayEmpty
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione um tipo
                  </MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            ...getStatusColor(option.value),
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                variant="caption"
                sx={{
                  color: "#3b82f6",
                  fontSize: "0.75rem",
                }}
              >
                Defina o nível de acesso do usuário
              </Typography>
            </Grid>

            <Grid size={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  mb: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                Celular
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={editForm.cel}
                onChange={(e) => onCelChange(e.target.value)}
                placeholder="(11) 99999-8888"
                disabled={loading}
                error={!isCelValid && editForm.cel.trim().length > 0}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": {
                      borderColor:
                        !isCelValid && editForm.cel.trim().length > 0
                          ? "#ef4444"
                          : "#3b82f6",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        !isCelValid && editForm.cel.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        !isCelValid && editForm.cel.trim().length > 0
                          ? "#dc2626"
                          : "#2563eb",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    !isCelValid && editForm.cel.trim().length > 0
                      ? "#ef4444"
                      : "#3b82f6",
                  fontSize: "0.75rem",
                }}
              >
                Opcional - Máximo 20 caracteres
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e0e7ff",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          disabled={loading}
          sx={{
            color: "#6b7280",
            borderColor: "#6b7280",
            "&:hover": {
              borderColor: "#4b5563",
              backgroundColor: "rgba(107, 114, 128, 0.1)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          size="small"
          disabled={loading || !isFormValid}
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            "&:disabled": {
              backgroundColor: "#9ca3af",
              color: "#ffffff",
            },
          }}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditUserModal;
