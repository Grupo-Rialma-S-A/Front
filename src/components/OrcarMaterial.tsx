"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Security,
  LockOpen,
  Lock,
  Key,
  AdminPanelSettings,
  VpnKey,
  PersonAdd,
  Group,
  Assignment,
  Timeline,
} from "@mui/icons-material";

export default function ControleAcesso() {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1e3a8a",
              mb: 1,
            }}
          >
            Sistema de Custos
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "2px solid #bfdbfe",
            borderRadius: 2,
            boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              borderBottom: "2px solid #bfdbfe",
              p: 4,
              textAlign: "center",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1e3a8a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Security sx={{ fontSize: 32 }} />
              Funcionalidade em Desenvolvimento
            </Typography>
          </Box>

          {/* Card Content */}
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mb: 6,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#3b82f6",
                  mb: 3,
                  fontSize: "4rem",
                }}
              >
                🔐
              </Avatar>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1e40af",
                  mb: 2,
                }}
              >
                Em breve...
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  maxWidth: "500px",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Esta funcionalidade está em desenvolvimento e estará disponível
                em breve...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
