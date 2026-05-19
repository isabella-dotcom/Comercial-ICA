import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Criar orçamento");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error: insertError } = await supabase
    .from("budgets")
    .insert({
      card_id: body.cardId,
      unit_key: body.unitKey,
      table_name: body.tableName,
      payment_mode: body.paymentMode,
      procedure_name: body.procedureName,
      value_display: body.valueDisplay,
      value_cents: body.valueCents || null,
      status: body.status || "pre_montado",
      conditions: body.conditions || null,
      internal_notes: body.internalNotes || null,
      created_by: session!.sub,
    })
    .select("*, card:cards(name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);

  if (body.cardId) {
    await supabase.from("card_history").insert({
      card_id: body.cardId,
      user_id: session!.sub,
      action: "Orçamento criado",
      details: {
        procedure: body.procedureName,
        value: body.valueDisplay,
      },
    });
  }

  return jsonOk(data);
}

export async function PATCH(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error: upErr } = await supabase
    .from("budgets")
    .update({ status: body.status })
    .eq("id", body.id)
    .select()
    .single();

  if (upErr) return jsonError(upErr.message, 500);

  if (body.status === "enviado" && data.card_id) {
    await supabase.from("card_history").insert({
      card_id: data.card_id,
      user_id: session!.sub,
      action: "Orçamento anexado/enviado",
      details: { budgetId: data.id },
    });
  }

  return jsonOk(data);
}
