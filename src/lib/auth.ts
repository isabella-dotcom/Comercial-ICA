import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Profile } from "./types";

const COOKIE_NAME = "ica_session";

export interface SessionPayload {
  sub: string;
  cpf: string;
  role: Profile["role"];
  name: string;
  label: string;
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não configurado");
  return new TextEncoder().encode(secret);
}

export async function createSession(profile: Profile) {
  const token = await new SignJWT({
    cpf: profile.cpf,
    role: profile.role,
    name: profile.name,
    label: profile.label,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(profile.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: payload.sub as string,
      cpf: payload.cpf as string,
      role: payload.role as SessionPayload["role"],
      name: payload.name as string,
      label: payload.label as string,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");
  return session;
}
