import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Enviar documento");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const cardId = formData.get("cardId") as string;
  const folder = (formData.get("folder") as string) || "Pacientes";
  const recipientId = formData.get("recipientId") as string | null;

  if (!file || !cardId) return jsonError("Arquivo e card são obrigatórios.");

  const supabase = createAdminClient();
  const path = `${cardId}/${Date.now()}-${file.name}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return jsonError(
      `Falha no upload. Crie o bucket "documents" no Supabase Storage. ${uploadError.message}`,
      500
    );
  }

  const { data, error: insertError } = await supabase
    .from("documents")
    .insert({
      card_id: cardId,
      file_name: file.name,
      file_path: path,
      folder,
      recipient_id: recipientId,
      uploaded_by: session!.sub,
    })
    .select("*, card:cards(code,name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);

  await supabase.from("card_history").insert({
    card_id: cardId,
    user_id: session!.sub,
    action: "Documento enviado",
    details: { fileName: file.name },
  });

  return jsonOk(data);
}
