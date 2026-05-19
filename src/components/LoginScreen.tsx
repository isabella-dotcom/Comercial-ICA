"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCpf, normalizeCpf } from "@/lib/format";

type AuthTab = "login" | "first";

export function LoginScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("login");
  const [loginCpf, setLoginCpf] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [firstCpf, setFirstCpf] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", type: "" });
  const [firstMsg, setFirstMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setLoginMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: normalizeCpf(loginCpf), pin: loginPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginMsg({ text: data.error, type: "error" });
        if (data.error?.includes("Primeiro acesso")) {
          setFirstCpf(formatCpf(loginCpf));
          setTab("first");
        }
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleFirstAccess() {
    setLoading(true);
    setFirstMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/first-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: normalizeCpf(firstCpf),
          pin: firstPin,
          confirmPin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFirstMsg({ text: data.error, type: "error" });
        return;
      }
      setFirstMsg({ text: "Senha cadastrada. Entrando...", type: "success" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-shell" aria-label="Fluxo de login">
      <div className="login-hero">
        <LoginBrand />
        <LoginIntro />
      </div>
      <LoginPanel
        tab={tab}
        setTab={setTab}
        loginCpf={loginCpf}
        setLoginCpf={setLoginCpf}
        loginPin={loginPin}
        setLoginPin={setLoginPin}
        firstCpf={firstCpf}
        setFirstCpf={setFirstCpf}
        firstPin={firstPin}
        setFirstPin={setFirstPin}
        confirmPin={confirmPin}
        setConfirmPin={setConfirmPin}
        loginMsg={loginMsg}
        firstMsg={firstMsg}
        loading={loading}
        onLogin={handleLogin}
        onFirst={handleFirstAccess}
      />
    </section>
  );
}

function LoginBrand() {
  return (
    <LoginBrandInner />
  );
}

function LoginBrandInner() {
  return (
    <div className="brand">
      <div className="brand-mark">ICA</div>
      <div>
        <h1>ICA Comercial</h1>
        <small>CRM + Growth + Operação</small>
      </div>
    </div>
  );
}

function LoginIntro() {
  return (
    <div>
      <h1>Acesso interno com CPF e senha de 6 dígitos.</h1>
      <p>
        No primeiro acesso, cadastre uma senha numérica. Dados persistidos no
        Supabase e app hospedado na Vercel.
      </p>
      <div className="login-badges">
        <span className="login-badge">CPF como login</span>
        <span className="login-badge">PIN com 6 dígitos</span>
        <span className="login-badge">Perfis por permissão</span>
        <span className="login-badge">Backend Supabase</span>
      </div>
    </div>
  );
}

function LoginPanel(props: {
  tab: AuthTab;
  setTab: (t: AuthTab) => void;
  loginCpf: string;
  setLoginCpf: (v: string) => void;
  loginPin: string;
  setLoginPin: (v: string) => void;
  firstCpf: string;
  setFirstCpf: (v: string) => void;
  firstPin: string;
  setFirstPin: (v: string) => void;
  confirmPin: string;
  setConfirmPin: (v: string) => void;
  loginMsg: { text: string; type: string };
  firstMsg: { text: string; type: string };
  loading: boolean;
  onLogin: () => void;
  onFirst: () => void;
}) {
  return (
    <div className="login-panel">
      <div className="login-card">
        <h2>Entrar no sistema</h2>
        <p>Informe o CPF cadastrado e a senha de 6 dígitos.</p>
        <div className="login-tabs" role="tablist">
          <button
            type="button"
            className={`login-tab ${props.tab === "login" ? "active" : ""}`}
            onClick={() => props.setTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`login-tab ${props.tab === "first" ? "active" : ""}`}
            onClick={() => props.setTab("first")}
          >
            Primeiro acesso
          </button>
        </div>
        {props.tab === "login" ? (
          <LoginForm {...props} />
        ) : (
          <FirstForm {...props} />
        )}
      </div>
    </div>
  );
}

function LoginForm(props: {
  loginCpf: string;
  setLoginCpf: (v: string) => void;
  loginPin: string;
  setLoginPin: (v: string) => void;
  loginMsg: { text: string; type: string };
  loading: boolean;
  onLogin: () => void;
}) {
  return (
    <div className="auth-panel active">
      <div className="field">
        <label htmlFor="loginCpf">CPF*</label>
        <input
          id="loginCpf"
          inputMode="numeric"
          maxLength={14}
          placeholder="000.000.000-00"
          value={props.loginCpf}
          onChange={(e) => props.setLoginCpf(formatCpf(e.target.value))}
        />
      </div>
      <PinField id="loginPin" label="Senha de 6 dígitos*" value={props.loginPin} onChange={props.setLoginPin} />
      <button type="button" className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={props.loading} onClick={props.onLogin}>
        {props.loading ? "Entrando..." : "Entrar"}
      </button>
      {props.loginMsg.text ? <div className={`login-message ${props.loginMsg.type}`}>{props.loginMsg.text}</div> : null}
    </div>
  );
}

function FirstForm(props: {
  firstCpf: string;
  setFirstCpf: (v: string) => void;
  firstPin: string;
  setFirstPin: (v: string) => void;
  confirmPin: string;
  setConfirmPin: (v: string) => void;
  firstMsg: { text: string; type: string };
  loading: boolean;
  onFirst: () => void;
}) {
  return (
    <div className="auth-panel active">
      <FirstAccessFields {...props} />
    </div>
  );
}

function FirstAccessFields(props: {
  firstCpf: string;
  setFirstCpf: (v: string) => void;
  firstPin: string;
  setFirstPin: (v: string) => void;
  confirmPin: string;
  setConfirmPin: (v: string) => void;
  firstMsg: { text: string; type: string };
  loading: boolean;
  onFirst: () => void;
}) {
  return (
    <>
      <div className="field">
        <label htmlFor="firstCpf">CPF cadastrado*</label>
        <input id="firstCpf" inputMode="numeric" maxLength={14} value={props.firstCpf} onChange={(e) => props.setFirstCpf(formatCpf(e.target.value))} />
      </div>
      <PinField id="firstPin" label="Criar senha de 6 dígitos*" value={props.firstPin} onChange={props.setFirstPin} />
      <PinField id="confirmPin" label="Confirmar senha*" value={props.confirmPin} onChange={props.setConfirmPin} />
      <button type="button" className="btn success" style={{ width: "100%", justifyContent: "center" }} disabled={props.loading} onClick={props.onFirst}>
        {props.loading ? "Salvando..." : "Cadastrar senha e entrar"}
      </button>
      {props.firstMsg.text ? <AuthMessage text={props.firstMsg.text} type={props.firstMsg.type} /> : null}
    </>
  );
}

function PinField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="pin-input" type="password" inputMode="numeric" maxLength={6} placeholder="••••••" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))} />
    </div>
  );
}

function AuthMessage({ text, type }: { text: string; type: string }) {
  return <div className={`login-message ${type}`}>{text}</div>;
}

