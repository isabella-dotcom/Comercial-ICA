import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { checkAction } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { session, error } = await requireApiSession();
  if (error) return error;

  const check = checkAction(session!.role, "Criar tarefa");
  if (!check.allowed) return jsonError(check.message || "Sem permissão", 403);

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error: insertError } = await supabase
    .from("tasks")
    .insert({
      card_id: body.cardId || null,
      task_type: body.taskType,
      owner_id: body.ownerId || session!.sub,
      status: body.status || "Pendente",
      task_date: body.taskDate,
      task_time: body.taskTime || null,
      notes: body.notes || null,
      created_by: session!.sub,
    })
    .select("*, card:cards(code,name), owner:profiles!tasks_owner_id_fkey(name)")
    .single();

  if (insertError) return jsonError(insertError.message, 500);
  return jsonOk(data);
}
