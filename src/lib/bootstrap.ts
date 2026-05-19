import { createAdminClient } from "./supabase/admin";
import type { BootstrapData, Card, Pipeline } from "./types";
import { formatCurrency } from "./format";

export async function loadBootstrap(userId: string): Promise<BootstrapData> {
  const supabase = createAdminClient();

  const [
    { data: user },
    { data: profiles },
    { data: pipelines },
    { data: cards },
    { data: tasks },
    { data: budgets },
    { data: documents },
    { data: emails },
    { data: conversations },
    { data: messages },
    { data: requests },
  ] = await Promise.all([
    supabase.from("profiles").select("id,cpf,name,role,label").eq("id", userId).single(),
    supabase.from("profiles").select("id,cpf,name,role,label").order("name"),
    supabase.from("pipelines").select("*").order("sort_order"),
    supabase.from("cards").select("*").order("updated_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*, cards(code,name)")
      .order("task_date", { ascending: false }),
    supabase
      .from("budgets")
      .select("*, card:cards(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("*, cards(code,name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("emails")
      .select("*, card:cards(code,name)")
      .order("created_at", { ascending: false }),
    supabase.from("conversations").select("*, card:cards(*)"),
    supabase
      .from("messages")
      .select("*, sent_by:profiles(name)")
      .order("created_at", { ascending: true }),
    supabase
      .from("approval_requests")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (!user) throw new Error("Usuário não encontrado");

  const cardList = (cards || []) as Card[];
  const pipelineList = (pipelines || []) as Pipeline[];

  const won = cardList.filter((c) => c.status === "Ganho");
  const lost = cardList.filter((c) => c.status === "Perdido");
  const inProgress = cardList.filter((c) => c.status === "Em andamento");
  const total = cardList.length || 1;

  const pipelineMap = Object.fromEntries(pipelineList.map((p) => [p.id, p]));

  const recentCards = cardList.slice(0, 10).map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    pipeline: pipelineMap[c.pipeline_id]?.name || "—",
    stage: c.stage,
    unit: c.unit,
    value_display: c.value_display,
    active_label: c.active_label,
  }));

  const dashboard = {
    winRate: Math.round((won.length / total) * 100),
    lossRate: Math.round((lost.length / total) * 100),
    inProgress: inProgress.length,
    totalWonValue: won.reduce((s, c) => s + (c.value_cents || 0), 0),
    recentCards,
  };

  return {
    user,
    profiles: profiles || [],
    pipelines: pipelineList,
    cards: cardList,
    tasks: (tasks || []).map((t) => {
      const row = t as Record<string, unknown> & {
        cards?: { code: string; name: string } | null;
      };
      const { cards: cardJoin, ...rest } = row;
      return { ...(rest as unknown as import("./types").Task), card: cardJoin ?? null };
    }),
    budgets: (budgets || []).map((b) => ({
      ...b,
      card: Array.isArray(b.card) ? b.card[0] : b.card,
    })),
    documents: (documents || []).map((d) => ({
      ...d,
      card: Array.isArray(d.card) ? d.card[0] : d.card,
      uploader: Array.isArray(d.uploader) ? d.uploader[0] : d.uploader,
    })),
    emails: (emails || []).map((e) => ({
      ...e,
      card: Array.isArray(e.card) ? e.card[0] : e.card,
    })),
    conversations: (conversations || []).map((c) => ({
      ...c,
      card: Array.isArray(c.card) ? c.card[0] : c.card,
    })),
    messages: (messages || []).map((m) => ({
      ...m,
      sent_by: Array.isArray(m.sent_by) ? m.sent_by[0] : m.sent_by,
    })),
    requests: (requests || []).map((r) => ({
      ...r,
      requester: Array.isArray(r.requester) ? r.requester[0] : r.requester,
      card: Array.isArray(r.card) ? r.card[0] : r.card,
    })),
    dashboard: {
      ...dashboard,
      totalWonValueLabel: formatCurrency(dashboard.totalWonValue),
    } as BootstrapData["dashboard"] & { totalWonValueLabel?: string },
  };
}
