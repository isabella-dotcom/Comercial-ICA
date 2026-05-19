import { jsonError, jsonOk, requireApiSession } from "@/lib/api";
import { loadBootstrap } from "@/lib/bootstrap";

export async function GET() {
  const { session, error } = await requireApiSession();
  if (error) return error;
  try {
    const data = await loadBootstrap(session!.sub);
    return jsonOk(data);
  } catch (e) {
    console.error(e);
    return jsonError(
      e instanceof Error ? e.message : "Erro ao carregar dados.",
      500
    );
  }
}
