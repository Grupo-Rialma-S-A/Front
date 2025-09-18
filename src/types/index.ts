export * from "./user";

export interface DashboardOption {
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface MessageState {
  message: string;
  type: "success" | "error" | "";
}
