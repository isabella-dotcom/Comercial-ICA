import type { UserRole } from "./types";

const RESTRICTED_FOR_LANA = [
  "Configurar funil",
  "Excluir card",
  "Adicionar usuário",
];

export function canEdit(role: UserRole): boolean {
  return role !== "ceo";
}

export function canApproveRequests(role: UserRole): boolean {
  return role === "growth" || role === "ti";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "ti";
}

export function canConfigureFunnel(role: UserRole): boolean {
  return role === "growth" || role === "ti";
}

export function checkAction(
  role: UserRole,
  action: string
): { allowed: boolean; needsRequest: boolean; message?: string } {
  if (role === "ceo") {
    return {
      allowed: false,
      needsRequest: false,
      message: `O perfil CEO é somente visualização e não pode executar: ${action}.`,
    };
  }

  if (
    role === "lana" &&
    RESTRICTED_FOR_LANA.some((item) => action.includes(item))
  ) {
    return {
      allowed: false,
      needsRequest: true,
      message: `Lana não tem permissão para executar: ${action}. Envie uma solicitação ao Head de Growth.`,
    };
  }

  return { allowed: true, needsRequest: false };
}

export function isWeakPin(pin: string): boolean {
  if (/^(\d)\1{5}$/.test(pin)) return true;
  return ["123456", "654321", "000000"].includes(pin);
}
