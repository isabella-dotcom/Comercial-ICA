import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Enviar mensagem");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const body = await request.json();
  const supabase = createAdminClient();

  let conversationId = body.conversationId;

  if (!conversationId && body.cardId) {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("card_id", body.cardId)
      .maybeSingle();

    if (existing) {
      conversationId = existing.id;
    } else {
      const { data: created, error: convErr } = await supabase
        .from("conversations")
        .insert({ card_id: body.cardId, channel: body.channel || "WhatsApp" })
        .select()
        .single();
      if (convErr) return jsonError(convErr.message, 500);
      conversationId = created.id;
    }
  }

  const { data, error: insertError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      body: body.body,
      sender_type: "user",
      channel: body.channel || "Sistema",
      sent_by: session!.sub,
    })
    .select("*, sent_by:profiles(name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);
  return jsonOk(data);
}
