import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiSession();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("card_history")
    .select("*, user:profiles(name)")
    .eq("card_id", id)
    .order("created_at", { ascending: false });

  if (dbError) return jsonError(dbError.message, 500);
  return jsonOk(data || []);
}
