"use client";

import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import { Lock, Unlock } from "lucide-react";
import { User } from "@/types/user";
import { Usuario } from "../ListarUsuarios";
interface BlockConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  user: Usuario | null;
  action: string; // "bloquear" ou "desbloquear"
  onConfirm: () => void;
}

const BlockConfirmationModal = ({
  open,
  onClose,
  user,
  action,
  onConfirm,
}: BlockConfirmationModalProps) => {
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
          Confirmar Ação
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {user && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor:
                    action === "bloquear" ? "#fecaca" : "#bbf7d0",
                  display: "flex",
                }}
              >
                {action === "bloquear" ? (
                  <Lock size={20} style={{ color: "#dc2626" }} />
                ) : (
                  <Unlock size={20} style={{ color: "#16a34a" }} />
                )}
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#1f2937" }}
                >
                  Tem certeza que deseja {action} o usuário?
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  <strong>{user.name}</strong> ({user.email})
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: "#374151" }}>
              {action === "bloquear"
                ? "O usuário não conseguirá mais acessar o sistema até ser desbloqueado."
                : "O usuário voltará a ter acesso ao sistema."}
            </Typography>
          </>
        )}
      </DialogContent>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
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
          onClick={onConfirm}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: action === "bloquear" ? "#dc2626" : "#16a34a",
            "&:hover": {
              backgroundColor: action === "bloquear" ? "#b91c1c" : "#15803d",
            },
          }}
        >
          {action === "bloquear" ? "Bloquear" : "Desbloquear"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default BlockConfirmationModal;
