import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Enviar e-mail");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error: insertError } = await supabase
    .from("emails")
    .insert({
      card_id: body.cardId,
      sender: body.sender || "comercial@ica.com.br",
      recipient: body.recipient,
      theme: body.theme,
      subject: body.subject,
      body: body.body,
      budget_id: body.budgetId || null,
      sent_by: session!.sub,
    })
    .select("*, card:cards(code,name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);

  await supabase.from("card_history").insert({
    card_id: body.cardId,
    user_id: session!.sub,
    action: "E-mail registrado",
    details: { subject: body.subject, theme: body.theme },
  });

  return jsonOk(data);
}
