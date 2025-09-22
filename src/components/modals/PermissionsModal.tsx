"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { X, Shield } from "lucide-react";
import { User } from "@/types/user";
import { Usuario } from "../ListarUsuarios";
interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
  user: Usuario | null;
}

const PermissionsModal = ({ open, onClose, user }: PermissionsModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#1e3a8a",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Permissões do Usuário
          </Typography>
          {user && (
            <Typography
              variant="body2"
              sx={{ color: "#3730a3", fontSize: "0.875rem" }}
            >
              {user.name} ({user.email})
            </Typography>
          )}
        </Box>
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

      <DialogContent sx={{ p: 4, minHeight: 300 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 6,
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              mb: 3,
            }}
          >
            <Shield size={48} style={{ color: "#7c3aed" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#1f2937",
              mb: 1,
            }}
          >
            Módulo de Permissões
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              mb: 1,
            }}
          >
            Esta funcionalidade será implementada em breve.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#9ca3af",
              maxWidth: 400,
            }}
          >
            Aqui você poderá gerenciar todas as permissões e níveis de acesso do
            usuário no sistema.
          </Typography>
        </Box>
      </DialogContent>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          Fechar
        </Button>
      </Box>
    </Dialog>
  );
};

export default PermissionsModal;
