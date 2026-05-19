import bcrypt from "bcryptjs";
import { jsonError, jsonOk } from "@/lib/api";
import { createSession } from "@/lib/auth";
import { normalizeCpf } from "@/lib/format";
import { isWeakPin } from "@/lib/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { cpf: rawCpf, pin, confirmPin } = await request.json();
    const cpf = normalizeCpf(rawCpf);
    const pinStr = String(pin || "").replace(/\D/g, "");
    const confirm = String(confirmPin || "").replace(/\D/g, "");

    if (cpf.length !== 11) return jsonError("Informe um CPF com 11 números.");
    if (pinStr.length !== 6 || confirm.length !== 6) {
      return jsonError("A senha e a confirmação precisam ter exatamente 6 dígitos.");
    }
    if (pinStr !== confirm) return jsonError("As senhas não conferem.");
    if (isWeakPin(pinStr)) {
      return jsonError(
        "Use uma senha menos óbvia. Evite sequências ou números repetidos."
      );
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

    const pinHash = await bcrypt.hash(pinStr, 12);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ pin_hash: pinHash })
      .eq("id", user.id);

    if (updateError) return jsonError("Não foi possível cadastrar a senha.", 500);

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
