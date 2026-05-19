"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useBootstrap } from "@/hooks/useBootstrap";
import type { Card, CardHistory, Profile } from "@/lib/types";
import {
  formatCurrency,
  formatDateBR,
  formatDateTimeBR,
  initials,
  maskCpf,
} from "@/lib/format";
import { canApproveRequests, checkAction } from "@/lib/permissions";
import type { PaymentMode } from "@/lib/prices";
import {
  calculatePriceFromCatalog,
  getProcedureNames,
  getTableNames,
} from "@/lib/price-catalog";

type UnitKey = "lux" | "cac";
type Section =
  | "dashboard"
  | "crm"
  | "tarefas"
  | "orcamentos"
  | "documentos"
  | "emails"
  | "mensagens"
  | "solicitacoes"
  | "configuracoes"
  | "usuarios";

type PipelineSlug = "pacientes" | "medicos" | "parceiros";

const NAV: { id: Section; label: string }[] = [
  { id: "dashboard", label: "▣ Dashboard" },
  { id: "crm", label: "▦ CRM" },
  { id: "tarefas", label: "✓ Tarefas" },
  { id: "orcamentos", label: "R$ Orçamentos" },
  { id: "documentos", label: "▤ Documentos" },
  { id: "emails", label: "✉ E-mails" },
  { id: "mensagens", label: "◌ Mensagens" },
  { id: "solicitacoes", label: "⚠ Solicitações" },
  { id: "configuracoes", label: "⚙ Configurações" },
  { id: "usuarios", label: "◉ Usuários" },
];

const PAGE_META: Record<Section, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Visão executiva do desempenho comercial.",
  },
  crm: { title: "CRM", subtitle: "Funis de pacientes, médicos e parceiros." },
  tarefas: { title: "Tarefas", subtitle: "Agenda operacional e follow-ups." },
  orcamentos: { title: "Orçamentos", subtitle: "Tabelas LUX e CAC com cálculo automático." },
  documentos: { title: "Documentos", subtitle: "Upload e biblioteca por card." },
  emails: { title: "E-mails", subtitle: "Registro de envios vinculados ao card." },
  mensagens: { title: "Mensagens", subtitle: "Conversas por canal e card." },
  solicitacoes: {
    title: "Solicitações",
    subtitle: "Aprovações de ações restritas.",
  },
  configuracoes: {
    title: "Configurações",
    subtitle: "Administração comercial e integrações.",
  },
  usuarios: { title: "Usuários", subtitle: "Perfis e permissões do sistema." },
};

const PERMISSION_BLURBS: Record<
  Profile["role"],
  { tag: string; tagClass: string; items: string[] }
> = {
  growth: {
    tag: "Head de Growth",
    tagClass: "purple",
    items: [
      "Gerencia funis",
      "Motivos de perda/ganho",
      "Exclui leads",
      "Aprova solicitações",
    ],
  },
  lana: {
    tag: "Encantadora",
    tagClass: "warning",
    items: [
      "Cria cards",
      "Registra contatos",
      "Não exclui nada",
      "Ações restritas viram solicitação",
    ],
  },
  ti: {
    tag: "TI/Admin",
    tagClass: "success",
    items: [
      "Acesso total",
      "Usuários e permissões",
      "Cards retroativos",
      "Integrações",
    ],
  },
  ceo: {
    tag: "CEO",
    tagClass: "",
    items: [
      "Apenas visualiza",
      "Dashboard",
      "Cards e relatórios",
      "Sem edição",
    ],
  },
};

function Tag({
  status,
  children,
}: {
  status?: string;
  children: ReactNode;
}) {
  const cls =
    status === "Ganho"
      ? "success"
      : status === "Perdido"
        ? "danger"
        : "warning";
  return <span className={`tag ${cls}`}>{children}</span>;
}

export function AppShell() {
  const router = useRouter();
  const { data, loading, error, refresh } = useBootstrap();

  const [section, setSection] = useState<Section>("dashboard");
  const [pipelineSlug, setPipelineSlug] = useState<PipelineSlug>("pacientes");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"resumo" | "historico">("resumo");
  const [cardHistory, setCardHistory] = useState<CardHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [requestJustification, setRequestJustification] = useState("");

  const [newCardName, setNewCardName] = useState("");
  const [moveStage, setMoveStage] = useState("");
  const [moveChannel, setMoveChannel] = useState("WhatsApp");
  const [moveNote, setMoveNote] = useState("");

  const [taskForm, setTaskForm] = useState({
    taskType: "Ligação",
    cardId: "",
    taskDate: new Date().toISOString().slice(0, 10),
    taskTime: "",
    status: "Pendente",
    notes: "",
  });

  const [budgetUnit, setBudgetUnit] = useState<UnitKey>("lux");
  const [budgetTable, setBudgetTable] = useState("");
  const [budgetMode, setBudgetMode] = useState<PaymentMode>("avista");
  const [budgetProcedure, setBudgetProcedure] = useState("");
  const [budgetCardId, setBudgetCardId] = useState("");

  const [docFile, setDocFile] = useState<File | null>(null);
  const [docCardId, setDocCardId] = useState("");
  const [docFolder, setDocFolder] = useState("Pacientes");

  const [emailForm, setEmailForm] = useState({
    cardId: "",
    recipient: "",
    theme: "Orçamento",
    subject: "Orçamento ICA",
    body: "Olá, segue orçamento conforme solicitado.",
  });

  const [selectedConversation, setSelectedConversation] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const pipeline = useMemo(
    () => data?.pipelines.find((p) => p.slug === pipelineSlug),
    [data, pipelineSlug]
  );

  const pipelineCards = useMemo(() => {
    if (!data || !pipeline) return [];
    return data.cards.filter((c) => c.pipeline_id === pipeline.id);
  }, [data, pipeline]);

  const priceCatalog = data?.priceCatalog ?? {};
  const budgetTables = getTableNames(priceCatalog, budgetUnit);
  const budgetProcedures = getProcedureNames(priceCatalog, budgetUnit);
  const budgetCalc = calculatePriceFromCatalog(
    priceCatalog,
    budgetUnit,
    budgetTable,
    budgetMode,
    budgetProcedure
  );

  useEffect(() => {
    if (!data?.priceCatalog) return;
    const tables = getTableNames(data.priceCatalog, budgetUnit);
    const procs = getProcedureNames(data.priceCatalog, budgetUnit);
    setBudgetTable(tables[0] || "");
    setBudgetProcedure(procs[0] || "");
  }, [budgetUnit, data?.priceCatalog]);

  const loadHistory = useCallback(async (cardId: string) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/cards/${cardId}/history`);
      const json = await res.json();
      if (res.ok) setCardHistory(json);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (drawerOpen && drawerTab === "historico" && selectedCard) {
      loadHistory(selectedCard.id);
    }
  }, [drawerOpen, drawerTab, selectedCard, loadHistory]);

  function openDrawer(card: Card) {
    setSelectedCard(card);
    setDrawerTab("resumo");
    setDrawerOpen(true);
    if (pipeline) {
      setMoveStage(card.stage);
    }
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelectedCard(null);
  }

  function runGuarded(action: string, onAllowed: () => void) {
    if (!data) return;
    const check = checkAction(data.user.role, action);
    if (check.needsRequest) {
      setPendingAction(action);
      setRequestJustification("");
      setRequestModalOpen(true);
      return;
    }
    if (!check.allowed) {
      setActionMsg(check.message || "Sem permissão.");
      return;
    }
    onAllowed();
  }

  async function submitRequest() {
    if (!data || !requestJustification.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: pendingAction,
          cardId: selectedCard?.id || null,
          justification: requestJustification,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar");
      setRequestModalOpen(false);
      setActionMsg("Solicitação enviada ao Head de Growth.");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function createCard() {
    if (!newCardName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCardName, pipelineSlug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao criar card");
      setNewCardModalOpen(false);
      setNewCardName("");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function moveCardStage() {
    if (!selectedCard) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move",
          cardId: selectedCard.id,
          stage: moveStage,
          channel: moveChannel,
          note: moveNote,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao mover");
      setStageModalOpen(false);
      await refresh();
      closeDrawer();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function createTask() {
    if (!taskForm.cardId || !taskForm.taskDate) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: taskForm.cardId,
          taskType: taskForm.taskType,
          taskDate: taskForm.taskDate,
          taskTime: taskForm.taskTime || null,
          status: taskForm.status,
          notes: taskForm.notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao salvar tarefa");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveBudget() {
    if (!budgetCardId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: budgetCardId,
          unitKey: budgetUnit,
          tableName: budgetTable,
          paymentMode: budgetMode,
          procedureName: budgetProcedure,
          valueDisplay: budgetCalc.value,
          status: "pre_montado",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao salvar orçamento");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadDocument() {
    if (!docFile || !docCardId) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", docFile);
      fd.append("cardId", docCardId);
      fd.append("folder", docFolder);
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha no upload");
      setDocFile(null);
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendEmail() {
    if (!emailForm.cardId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao registrar e-mail");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendMessage() {
    if (!messageBody.trim() || !selectedConversation) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          body: messageBody,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar");
      setMessageBody("");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  async function reviewRequest(id: string, approve: boolean) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approve }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha");
      await refresh();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  const convMessages = useMemo(() => {
    if (!data || !selectedConversation) return [];
    return data.messages.filter(
      (m) => m.conversation_id === selectedConversation
    );
  }, [data, selectedConversation]);

  useEffect(() => {
    if (data?.conversations.length && !selectedConversation) {
      setSelectedConversation(data.conversations[0].id);
    }
  }, [data, selectedConversation]);

  if (loading) {
    return (
      <div className="app">
        <main className="main">
          <div className="content">
            <p>Carregando dados...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app">
        <main className="main">
          <div className="content">
            <div className="card">
              <h3>Erro ao carregar</h3>
              <p>{error || "Dados indisponíveis"}</p>
              <button type="button" className="btn primary" onClick={refresh}>
                Tentar novamente
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const meta = PAGE_META[section];
  const canApprove = canApproveRequests(data.user.role);
  const activeConv = data.conversations.find(
    (c) => c.id === selectedConversation
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">ICA</div>
          <div>
            <h1>ICA Comercial</h1>
            <small>CRM + Growth + Operação</small>
          </div>
        </div>
        <div className="nav-label">Navegação</div>
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-btn${section === item.id ? " active" : ""}`}
            onClick={() => setSection(item.id)}
          >
            {item.label}
          </button>
        ))}
        <div className="sidebar-card">
          <strong>Sessão ativa</strong>
          <p>
            {data.user.name} · {data.user.label}
          </p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="page-title">
            <h2>{meta.title}</h2>
            <p>{meta.subtitle}</p>
          </div>
          <div className="top-actions">
            <div className="session-pill" title="Usuário logado">
              <div className="session-avatar">{initials(data.user.name)}</div>
              <div>
                <strong>{data.user.name}</strong>
                <span>{maskCpf(data.user.cpf)}</span>
              </div>
            </div>
            <div className="role-pill">
              <label>Perfil</label>
              <span>{data.user.label}</span>
            </div>
            <button
              type="button"
              className="btn primary"
              onClick={() =>
                runGuarded("Criar novo card", () => setNewCardModalOpen(true))
              }
            >
              + Novo card
            </button>
            <button type="button" className="btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {actionMsg ? (
          <div className="content">
            <div className="notice">{actionMsg}</div>
          </div>
        ) : null}

        <div className="content">
          <section
            className={`section${section === "dashboard" ? " active" : ""}`}
            id="dashboard"
          >
            <div className="grid grid-4">
              <div className="card metric success">
                <span>% quantidade de ganha</span>
                <h3>{data.dashboard.winRate}%</h3>
                <p>Realizados e parcerias firmadas.</p>
              </div>
              <div className="card metric danger">
                <span>% quantidade de perda</span>
                <h3>{data.dashboard.lossRate}%</h3>
                <p>Perdas e declínios fechados.</p>
              </div>
              <div className="card metric primary">
                <span>Cards em andamento</span>
                <h3>{data.dashboard.inProgress}</h3>
                <p>Negociações ainda ativas.</p>
              </div>
              <div className="card metric warning">
                <span>Valor acumulado</span>
                <h3>{formatCurrency(data.dashboard.totalWonValue)}</h3>
                <p>Somente cards ganhos.</p>
              </div>
            </div>
            <div style={{ height: 16 }} />
            <div className="card">
              <div className="card-title">
                <div>
                  <h3>Cards recentes</h3>
                  <p>Últimas movimentações comerciais.</p>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Card</th>
                      <th>Pipeline</th>
                      <th>Status</th>
                      <th>Unidade</th>
                      <th>Valor</th>
                      <th>Tempo ativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dashboard.recentCards.map((row) => (
                      <tr key={row.id}>
                        <td>
                          {row.code} — {row.name}
                        </td>
                        <td>{row.pipeline}</td>
                        <td>
                          <Tag>{row.stage}</Tag>
                        </td>
                        <td>{row.unit || "—"}</td>
                        <td>{row.value_display || "—"}</td>
                        <td>{row.active_label || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "crm" ? " active" : ""}`}
            id="crm"
          >
            <div className="toolbar">
              <div className="tabs">
                {(
                  [
                    ["pacientes", "Pacientes"],
                    ["medicos", "Médicos prescritores"],
                    ["parceiros", "Parceiros"],
                  ] as const
                ).map(([slug, label]) => (
                  <button
                    key={slug}
                    type="button"
                    className={`tab-btn${pipelineSlug === slug ? " active" : ""}`}
                    onClick={() => setPipelineSlug(slug)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() =>
                    runGuarded("Criar card no pipeline", () =>
                      setNewCardModalOpen(true)
                    )
                  }
                >
                  + Novo lead
                </button>
              </div>
            </div>
            <div className="kanban-wrap">
              <div className="kanban">
                {pipeline?.stages.map((stage) => {
                  const colCards = pipelineCards.filter(
                    (c) => c.stage === stage
                  );
                  return (
                    <div key={stage} className="column">
                      <div className="column-head">
                        <h3>{stage}</h3>
                        <span className="count">{colCards.length}</span>
                      </div>
                      {colCards.map((card) => (
                        <article
                          key={card.id}
                          className="lead-card"
                          onClick={() => openDrawer(card)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") openDrawer(card);
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <header>
                            <div>
                              <strong>{card.name}</strong>
                              <small>{card.code}</small>
                            </div>
                            <Tag status={card.status}>{card.stage}</Tag>
                          </header>
                          <div className="tag-row">
                            <span className="tag">{card.unit || "—"}</span>
                            <span className="tag">
                              {card.value_display || "—"}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section
            className={`section${section === "tarefas" ? " active" : ""}`}
            id="tarefas"
          >
            <div className="split">
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Tarefas</h3>
                    <p>Lista de tarefas registradas.</p>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Tipo</th>
                        <th>Responsável</th>
                        <th>Status</th>
                        <th>Card</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tasks.map((t) => (
                        <tr key={t.id}>
                          <td>{formatDateBR(t.task_date)}</td>
                          <td>{t.task_time || "—"}</td>
                          <td>{t.task_type}</td>
                          <td>{t.owner?.name || "—"}</td>
                          <td>
                            <Tag>{t.status}</Tag>
                          </td>
                          <td>
                            {t.card
                              ? `${t.card.code} — ${t.card.name}`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Nova tarefa</h3>
                  </div>
                  <button
                    type="button"
                    className="btn primary"
                    disabled={submitting}
                    onClick={() =>
                      runGuarded("Criar tarefa", createTask)
                    }
                  >
                    + Salvar tarefa
                  </button>
                </div>
                <div className="form-grid">
                  <div className="field">
                    <label>Tipo*</label>
                    <select
                      value={taskForm.taskType}
                      onChange={(e) =>
                        setTaskForm((f) => ({
                          ...f,
                          taskType: e.target.value,
                        }))
                      }
                    >
                      <option>Ligação</option>
                      <option>Captação</option>
                      <option>Reunião</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Data*</label>
                    <input
                      type="date"
                      value={taskForm.taskDate}
                      onChange={(e) =>
                        setTaskForm((f) => ({
                          ...f,
                          taskDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Horário</label>
                    <input
                      type="time"
                      value={taskForm.taskTime}
                      onChange={(e) =>
                        setTaskForm((f) => ({
                          ...f,
                          taskTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="field full">
                    <label>Card*</label>
                    <select
                      value={taskForm.cardId}
                      onChange={(e) =>
                        setTaskForm((f) => ({
                          ...f,
                          cardId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecione</option>
                      {data.cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "orcamentos" ? " active" : ""}`}
            id="orcamentos"
          >
            <div className="split">
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Novo orçamento</h3>
                    <p>Unidade → tabela → modalidade → procedimento.</p>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="field full">
                    <label>Card*</label>
                    <select
                      value={budgetCardId}
                      onChange={(e) => setBudgetCardId(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {data.cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Unidade*</label>
                    <select
                      value={budgetUnit}
                      onChange={(e) =>
                        setBudgetUnit(e.target.value as UnitKey)
                      }
                    >
                      <option value="lux">
                        {priceCatalog.lux?.name ?? "Hospital Luxemburgo (LUX BH)"}
                      </option>
                      <option value="cac">
                        {priceCatalog.cac?.name ?? "Hospital Bom Samaritano (CAC GV)"}
                      </option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Tabela*</label>
                    <select
                      value={budgetTable}
                      onChange={(e) => setBudgetTable(e.target.value)}
                    >
                      {budgetTables.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Modalidade*</label>
                    <select
                      value={budgetMode}
                      onChange={(e) =>
                        setBudgetMode(e.target.value as PaymentMode)
                      }
                    >
                      <option value="avista">À vista</option>
                      <option value="parcelado">Parcelado</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Procedimento*</label>
                    <select
                      value={budgetProcedure}
                      onChange={(e) => setBudgetProcedure(e.target.value)}
                    >
                      {budgetProcedures.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Valor calculado</label>
                    <input readOnly value={budgetCalc.value} />
                  </div>
                </div>
                <div style={{ height: 14 }} />
                <button
                  type="button"
                  className="btn primary"
                  disabled={submitting}
                  onClick={() =>
                    runGuarded("Criar orçamento", saveBudget)
                  }
                >
                  Salvar pré-montado
                </button>
              </div>
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Pré-montados</h3>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Procedimento</th>
                        <th>Unidade</th>
                        <th>Valor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.budgets.map((b) => (
                        <tr key={b.id}>
                          <td>{b.card?.name || "—"}</td>
                          <td>{b.procedure_name}</td>
                          <td>{b.unit_key.toUpperCase()}</td>
                          <td>{b.value_display || "—"}</td>
                          <td>
                            <Tag>{b.status}</Tag>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "documentos" ? " active" : ""}`}
            id="documentos"
          >
            <div className="grid grid-2">
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Upload</h3>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="field full">
                    <label>Arquivo</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setDocFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div className="field full">
                    <label>Card</label>
                    <select
                      value={docCardId}
                      onChange={(e) => setDocCardId(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {data.cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Pasta</label>
                    <select
                      value={docFolder}
                      onChange={(e) => setDocFolder(e.target.value)}
                    >
                      <option>Pacientes</option>
                      <option>Médicos</option>
                      <option>Parceiros</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn primary"
                  disabled={submitting}
                  onClick={() =>
                    runGuarded("Enviar documento", uploadDocument)
                  }
                >
                  Enviar documento
                </button>
              </div>
              <div className="card">
                <div className="card-title">
                  <div>
                    <h3>Biblioteca</h3>
                  </div>
                </div>
                <div className="timeline">
                  {data.documents.map((d) => (
                    <div key={d.id} className="timeline-item">
                      <strong>{d.file_name}</strong>
                      <span>
                        {d.card?.code || "—"} ·{" "}
                        {formatDateTimeBR(d.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "emails" ? " active" : ""}`}
            id="emails"
          >
            <div className="split">
              <div className="card">
                <div className="form-grid">
                  <div className="field">
                    <label>Destinatário</label>
                    <input
                      value={emailForm.recipient}
                      onChange={(e) =>
                        setEmailForm((f) => ({
                          ...f,
                          recipient: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Card*</label>
                    <select
                      value={emailForm.cardId}
                      onChange={(e) =>
                        setEmailForm((f) => ({
                          ...f,
                          cardId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecione</option>
                      {data.cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field full">
                    <label>Assunto</label>
                    <input
                      value={emailForm.subject}
                      onChange={(e) =>
                        setEmailForm((f) => ({
                          ...f,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="field full">
                    <label>Mensagem</label>
                    <textarea
                      value={emailForm.body}
                      onChange={(e) =>
                        setEmailForm((f) => ({
                          ...f,
                          body: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn primary"
                  disabled={submitting}
                  onClick={() =>
                    runGuarded("Enviar e-mail", sendEmail)
                  }
                >
                  Enviar e registrar
                </button>
              </div>
              <div className="card">
                <div className="timeline">
                  {data.emails.map((em) => (
                    <div key={em.id} className="timeline-item">
                      <strong>{em.subject || em.theme}</strong>
                      <span>
                        {em.card?.code || "—"} ·{" "}
                        {formatDateTimeBR(em.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "mensagens" ? " active" : ""}`}
            id="mensagens"
          >
            <div className="chat">
              <aside className="chat-list">
                {data.conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`conversation${
                      selectedConversation === c.id ? " active" : ""
                    }`}
                    onClick={() => setSelectedConversation(c.id)}
                  >
                    <strong>{c.card?.name || "Card"}</strong>
                    <span>
                      {c.card?.code} · {c.channel || "Canal"}
                    </span>
                  </button>
                ))}
              </aside>
              <div className="chat-window">
                <div className="chat-head">
                  <strong>
                    {activeConv?.card?.code} — {activeConv?.card?.name}
                  </strong>
                </div>
                <div className="chat-body">
                  {convMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`bubble${m.sender_type === "user" ? " me" : ""}`}
                    >
                      {m.body}
                      <small>
                        {formatDateTimeBR(m.created_at)} ·{" "}
                        {m.sent_by?.name || m.sender_type}
                      </small>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    placeholder="Digite uma mensagem..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn primary"
                    disabled={submitting}
                    onClick={() =>
                      runGuarded("Enviar mensagem", sendMessage)
                    }
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "solicitacoes" ? " active" : ""}`}
            id="solicitacoes"
          >
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Solicitante</th>
                      <th>Tipo</th>
                      <th>Card</th>
                      <th>Justificativa</th>
                      <th>Data</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.requester?.name || "—"}</td>
                        <td>{r.request_type}</td>
                        <td>{r.card?.code || "—"}</td>
                        <td>{r.justification}</td>
                        <td>{formatDateBR(r.created_at)}</td>
                        <td>
                          {r.status === "pending" && canApprove ? (
                            <>
                              <button
                                type="button"
                                className="btn success"
                                disabled={submitting}
                                onClick={() => reviewRequest(r.id, true)}
                              >
                                Aprovar
                              </button>{" "}
                              <button
                                type="button"
                                className="btn danger"
                                disabled={submitting}
                                onClick={() => reviewRequest(r.id, false)}
                              >
                                Reprovar
                              </button>
                            </>
                          ) : (
                            <Tag>{r.status}</Tag>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "configuracoes" ? " active" : ""}`}
            id="configuracoes"
          >
            <div className="grid grid-2">
              <div className="card">
                <div className="accordion">
                  <details open>
                    <summary>Pipelines e colunas</summary>
                    <div>
                      Gerenciar Pacientes, Médicos Prescritores e Parceiros.
                    </div>
                  </details>
                  <details>
                    <summary>Motivos de perda e ganho</summary>
                    <div>
                      Configurar campos obrigatórios por etapa.
                    </div>
                  </details>
                  <details>
                    <summary>Tabelas de preço</summary>
                    <div>LUX BH e CAC GV.</div>
                  </details>
                </div>
              </div>
              <div className="card">
                <div className="accordion">
                  <details open>
                    <summary>Google Agenda</summary>
                    <div>Eventos a partir de tarefas com data e horário.</div>
                  </details>
                  <details>
                    <summary>Duotalk</summary>
                    <div>Webhooks e criação automática de cards.</div>
                  </details>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`section${section === "usuarios" ? " active" : ""}`}
            id="usuarios"
          >
            <div className="card">
              <div className="permission-grid">
                {data.profiles.map((p) => {
                  const blurbs = PERMISSION_BLURBS[p.role];
                  return (
                    <div key={p.id} className="permission-card">
                      <h4>{p.name.split(" ")[0]}</h4>
                      <span className={`tag ${blurbs.tagClass}`}>
                        {blurbs.tag}
                      </span>
                      <ul>
                        {blurbs.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <div
        className={`drawer-backdrop${drawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
        role="presentation"
      />
      <aside className={`drawer${drawerOpen ? " open" : ""}`}>
        {selectedCard ? (
          <>
            <div className="drawer-head">
              <div>
                <h2>
                  {selectedCard.code} — {selectedCard.name}
                </h2>
                <p>
                  {selectedCard.stage} · {selectedCard.unit} ·{" "}
                  {selectedCard.active_label}
                </p>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={closeDrawer}
              >
                ×
              </button>
            </div>
            <div className="drawer-body">
              <div className="drawer-tabs">
                <button
                  type="button"
                  className={`drawer-tab${drawerTab === "resumo" ? " active" : ""}`}
                  onClick={() => setDrawerTab("resumo")}
                >
                  Resumo
                </button>
                <button
                  type="button"
                  className={`drawer-tab${drawerTab === "historico" ? " active" : ""}`}
                  onClick={() => setDrawerTab("historico")}
                >
                  Histórico
                </button>
              </div>
              <div
                className={`drawer-panel${drawerTab === "resumo" ? " active" : ""}`}
              >
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Origem</strong>
                      </td>
                      <td>{selectedCard.origin}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Procedimento</strong>
                      </td>
                      <td>{selectedCard.procedure}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Valor</strong>
                      </td>
                      <td>{selectedCard.value_display}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ height: 12 }} />
                <div className="button-row">
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() =>
                      runGuarded("Mover etapa", () => setStageModalOpen(true))
                    }
                  >
                    Mover etapa
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() =>
                      runGuarded("Excluir card", () => {
                        if (
                          !confirm(
                            "Confirma a exclusão permanente deste card?"
                          )
                        )
                          return;
                        void (async () => {
                          setSubmitting(true);
                          try {
                            const res = await fetch("/api/cards", {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                action: "delete",
                                cardId: selectedCard.id,
                              }),
                            });
                            const json = await res.json();
                            if (!res.ok)
                              throw new Error(json.error || "Falha");
                            closeDrawer();
                            await refresh();
                          } catch (e) {
                            setActionMsg(
                              e instanceof Error ? e.message : "Erro"
                            );
                          } finally {
                            setSubmitting(false);
                          }
                        })();
                      })
                    }
                  >
                    Excluir card
                  </button>
                </div>
              </div>
              <div
                className={`drawer-panel${drawerTab === "historico" ? " active" : ""}`}
              >
                {historyLoading ? (
                  <p>Carregando histórico...</p>
                ) : (
                  <div className="timeline">
                    {cardHistory.map((h) => (
                      <div key={h.id} className="timeline-item">
                        <strong>{h.action}</strong>
                        <span>
                          {h.user?.name || "Sistema"} ·{" "}
                          {formatDateTimeBR(h.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </aside>

      <div
        className={`modal-backdrop${stageModalOpen || newCardModalOpen || requestModalOpen ? " open" : ""}`}
        onClick={() => {
          setStageModalOpen(false);
          setNewCardModalOpen(false);
          setRequestModalOpen(false);
        }}
        role="presentation"
      />

      {stageModalOpen && selectedCard && pipeline ? (
        <div className="modal open">
          <h3>Mover card de etapa</h3>
          <div className="form-grid">
            <div className="field">
              <label>Próxima etapa</label>
              <select
                value={moveStage}
                onChange={(e) => setMoveStage(e.target.value)}
              >
                {pipeline.stages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Canal</label>
              <select
                value={moveChannel}
                onChange={(e) => setMoveChannel(e.target.value)}
              >
                <option>WhatsApp</option>
                <option>Ligação</option>
                <option>E-mail</option>
              </select>
            </div>
            <div className="field full">
              <label>Observação</label>
              <textarea
                value={moveNote}
                onChange={(e) => setMoveNote(e.target.value)}
              />
            </div>
          </div>
          <div className="button-row">
            <button
              type="button"
              className="btn primary"
              disabled={submitting}
              onClick={moveCardStage}
            >
              Confirmar
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setStageModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      {newCardModalOpen ? (
        <div className="modal open">
          <h3>Novo card</h3>
          <div className="field">
            <label>Nome*</label>
            <input
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button
              type="button"
              className="btn primary"
              disabled={submitting}
              onClick={createCard}
            >
              Criar
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setNewCardModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      {requestModalOpen ? (
        <div className="modal open">
          <h3>Ação restrita</h3>
          <p>{pendingAction}</p>
          <div className="field">
            <label>Justificativa*</label>
            <textarea
              value={requestJustification}
              onChange={(e) => setRequestJustification(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button
              type="button"
              className="btn primary"
              disabled={submitting}
              onClick={submitRequest}
            >
              Enviar solicitação
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setRequestModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
