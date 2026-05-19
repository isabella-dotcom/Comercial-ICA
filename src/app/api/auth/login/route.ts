import bcrypt from "bcryptjs";
import { jsonError, jsonOk } from "@/lib/api";
import { createSession } from "@/lib/auth";
import { normalizeCpf } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { cpf: rawCpf, pin } = await request.json();
    const cpf = normalizeCpf(rawCpf);
    const pinStr = String(pin || "").replace(/\D/g, "");

    if (cpf.length !== 11) return jsonError("Informe um CPF com 11 números.");
    if (pinStr.length !== 6) {
      return jsonError("A senha precisa ter exatamente 6 dígitos numéricos.");
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("cpf", cpf)
      .single();

    if (error || !user) {
      return jsonError("CPF não encontrado na base de usuários.");
    }
    if (!user.pin_hash) {
      return jsonError(
        "Este usuário ainda não cadastrou a senha. Use Primeiro acesso.",
        403
      );
    }

    const valid = await bcrypt.compare(pinStr, user.pin_hash);
    if (!valid) return jsonError("Senha incorreta.");

    await createSession({
      id: user.id,
      cpf: user.cpf,
      name: user.name,
      role: user.role,
      label: user.label,
    });

    return jsonOk({
      user: {
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        role: user.role,
        label: user.label,
      },
    });
  } catch (e) {
    console.error(e);
    return jsonError("Erro interno.", 500);
  }
}
