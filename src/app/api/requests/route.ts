import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { canApproveRequests } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error: insertError } = await supabase
    .from("approval_requests")
    .insert({
      requester_id: session!.sub,
      request_type: body.requestType,
      card_id: body.cardId || null,
      justification: body.justification,
    })
    .select("*, requester:profiles!approval_requests_requester_id_fkey(name), card:cards(code,name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);
  return jsonOk(data);
}

export async function PATCH(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  if (!canApproveRequests(session!.role)) {
    return jsonError("Sem permissão para aprovar solicitações.", 403);
  }

  const body = await request.json();
  const supabase = createAdminClient();

  const status = body.approve ? "approved" : "rejected";

  const { data, error: upErr } = await supabase
    .from("approval_requests")
    .update({
      status,
      reviewed_by: session!.sub,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (upErr) return jsonError(upErr.message, 500);

  if (body.approve && data.request_type === "Excluir card" && data.card_id) {
    await supabase.from("cards").delete().eq("id", data.card_id);
  }

  return jsonOk(data);
}
