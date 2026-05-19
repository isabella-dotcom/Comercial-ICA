import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Criar card");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const body = await request.json();
  const supabase = createAdminClient();

  const { data: pipeline } = await supabase
    .from("pipelines")
    .select("id, stages")
    .eq("slug", body.pipelineSlug || "pacientes")
    .single();

  if (!pipeline) return jsonError("Pipeline não encontrado.");

  const firstStage = pipeline.stages[0];
  const { count } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("pipeline_id", pipeline.id);

  const code = body.code || `#${(count || 0) + 500}`;

  const { data: card, error: insertError } = await supabase
    .from("cards")
    .insert({
      pipeline_id: pipeline.id,
      code,
      name: body.name,
      stage: body.stage || firstStage,
      origin: body.origin || "Particular",
      unit: body.unit || "LUX",
      procedure: body.procedure || "—",
      value_display: body.value_display || "—",
      status: "Em andamento",
      active_label: "0 dias",
      owner_id: session!.sub,
    })
    .select()
    .single();

  if (insertError) return jsonError(insertError.message, 500);

  await supabase.from("card_history").insert({
    card_id: card.id,
    user_id: session!.sub,
    action: "Card criado",
    details: { channel: body.origin },
  });

  return jsonOk(card);
}

export async function PATCH(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const body = await request.json();
  const supabase = createAdminClient();

  if (body.action === "move") {
    const check = checkAction(session!.role, "Mover etapa");
    if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

    const { data: card, error: upErr } = await supabase
      .from("cards")
      .update({
        stage: body.stage,
        updated_at: new Date().toISOString(),
        status:
          body.stage === "Realizado" || body.stage === "Parceria firmada"
            ? "Ganho"
            : body.stage === "Perda" || body.stage === "Declinou"
              ? "Perdido"
              : "Em andamento",
      })
      .eq("id", body.cardId)
      .select()
      .single();

    if (upErr) return jsonError(upErr.message, 500);

    await supabase.from("card_history").insert({
      card_id: body.cardId,
      user_id: session!.sub,
      action: `Movido para ${body.stage}`,
      details: {
        channel: body.channel,
        note: body.note,
      },
    });

    return jsonOk(card);
  }

  if (body.action === "update") {
    const { data: card, error: upErr } = await supabase
      .from("cards")
      .update({
        notes: body.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.cardId)
      .select()
      .single();
    if (upErr) return jsonError(upErr.message, 500);
    return jsonOk(card);
  }

  if (body.action === "delete") {
    const check = checkAction(session!.role, "Excluir card");
    if (!check.allowed && check.needsRequest) {
      const { data: req } = await supabase
        .from("approval_requests")
        .insert({
          requester_id: session!.sub,
          request_type: "Excluir card",
          card_id: body.cardId,
          justification: body.justification || "Solicitação via sistema",
        })
        .select()
        .single();
      return jsonOk({ request: req, pending: true });
    }
    if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

    await supabase.from("cards").delete().eq("id", body.cardId);
    return jsonOk({ deleted: true });
  }

  return jsonError("Ação inválida.");
}
