export type UserRole = "growth" | "lana" | "ti" | "ceo";

export interface Profile {
  id: string;
  cpf: string;
  name: string;
  role: UserRole;
  label: string;
}

export interface Pipeline {
  id: string;
  slug: string;
  name: string;
  stages: string[];
}

export interface Card {
  id: string;
  pipeline_id: string;
  code: string;
  name: string;
  stage: string;
  origin: string | null;
  unit: string | null;
  procedure: string | null;
  value_display: string | null;
  value_cents: number | null;
  status: string;
  active_label: string | null;
  notes: string | null;
  owner_id: string | null;
}

export interface Task {
  id: string;
  card_id: string | null;
  task_type: string;
  owner_id: string | null;
  status: string;
  task_date: string;
  task_time: string | null;
  notes: string | null;
  card?: { code: string; name: string } | null;
  owner?: { name: string } | null;
}

export interface Budget {
  id: string;
  card_id: string | null;
  unit_key: string;
  table_name: string;
  payment_mode: string;
  procedure_name: string;
  value_display: string | null;
  status: string;
  card?: { name: string } | null;
}

export interface DocumentRow {
  id: string;
  card_id: string | null;
  file_name: string;
  file_path: string;
  folder: string | null;
  created_at: string;
  card?: { code: string; name: string } | null;
  uploader?: { name: string } | null;
}

export interface EmailRow {
  id: string;
  card_id: string | null;
  sender: string | null;
  recipient: string | null;
  theme: string | null;
  subject: string | null;
  body: string | null;
  created_at: string;
  card?: { code: string; name: string } | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  body: string;
  sender_type: "user" | "contact";
  channel: string | null;
  created_at: string;
  sent_by?: { name: string } | null;
}

export interface Conversation {
  id: string;
  card_id: string;
  channel: string | null;
  card?: Card | null;
}

export interface ApprovalRequest {
  id: string;
  requester_id: string;
  request_type: string;
  card_id: string | null;
  justification: string;
  status: string;
  created_at: string;
  requester?: { name: string } | null;
  card?: { code: string; name: string } | null;
}

export interface CardHistory {
  id: string;
  card_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  user?: { name: string } | null;
}

export interface DashboardStats {
  winRate: number;
  lossRate: number;
  inProgress: number;
  totalWonValue: number;
  recentCards: Array<{
    id: string;
    code: string;
    name: string;
    pipeline: string;
    stage: string;
    unit: string | null;
    value_display: string | null;
    active_label: string | null;
  }>;
}

export interface BootstrapData {
  user: Profile;
  profiles: Profile[];
  pipelines: Pipeline[];
  cards: Card[];
  tasks: Task[];
  budgets: Budget[];
  documents: DocumentRow[];
  emails: EmailRow[];
  conversations: Conversation[];
  messages: MessageRow[];
  requests: ApprovalRequest[];
  dashboard: DashboardStats;
  priceCatalog: import("./price-catalog").PriceCatalog;
}
