"use client";

import { get, set, del } from "idb-keyval";
import type { Faixa } from "./esquema";

/**
 * Tudo o que a família registra fica no próprio aparelho (IndexedDB).
 * Nada é enviado para servidor.
 */

export type Perfil = {
  faixa: Faixa;
  apelido: string;
  /** Primeiro dia de uso (AAAA-MM-DD): base da contagem de semanas. */
  inicio: string;
  /** Aceite dos Termos de Uso e da Política de Privacidade, guardado só no aparelho. */
  aceite?: { versao: string; em: string };
};

export type Reacao = "adorou" | "ok" | "nao";

export type Registro = {
  id: string;
  dia: string;
  brincadeira: string;
  reacao: Reacao;
  nota: string;
  criadoEm: string;
};

export type EstadoApoio = {
  /** Última vez que o cartão de apoio foi mostrado (ISO). */
  ultimoCartao?: string;
};

const K_PERFIL = "perfil";
const K_REGISTROS = "registros";
const K_APOIO = "apoio";
const K_SEMANA = "ultima-semana-medida";

export async function lerPerfil(): Promise<Perfil | null> {
  try {
    return (await get<Perfil>(K_PERFIL)) ?? null;
  } catch {
    return null;
  }
}
export const salvarPerfil = (p: Perfil) => set(K_PERFIL, p);

export async function lerRegistros(): Promise<Registro[]> {
  try {
    return (await get<Registro[]>(K_REGISTROS)) ?? [];
  } catch {
    return [];
  }
}
export const salvarRegistros = (r: Registro[]) => set(K_REGISTROS, r);

export async function adicionarRegistro(r: Omit<Registro, "id" | "criadoEm">): Promise<Registro[]> {
  const lista = await lerRegistros();
  const novo: Registro = {
    ...r,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    criadoEm: new Date().toISOString(),
  };
  const proxima = [novo, ...lista];
  await salvarRegistros(proxima);
  return proxima;
}

export async function apagarRegistro(id: string): Promise<Registro[]> {
  const proxima = (await lerRegistros()).filter((r) => r.id !== id);
  await salvarRegistros(proxima);
  return proxima;
}

export async function lerApoio(): Promise<EstadoApoio> {
  try {
    return (await get<EstadoApoio>(K_APOIO)) ?? {};
  } catch {
    return {};
  }
}
export const salvarApoio = (a: EstadoApoio) => set(K_APOIO, a);

export async function lerUltimaSemanaMedida(): Promise<number> {
  try {
    return (await get<number>(K_SEMANA)) ?? 0;
  } catch {
    return 0;
  }
}
export const salvarUltimaSemanaMedida = (n: number) => set(K_SEMANA, n);

/** Apaga tudo deste aparelho (página Sobre). */
export async function apagarTudo() {
  await Promise.all([del(K_PERFIL), del(K_REGISTROS), del(K_APOIO), del(K_SEMANA)]);
}

/** Cópia de segurança: exporta e importa o diário como arquivo JSON. */
export type Copia = { versao: 1; perfil: Perfil | null; registros: Registro[]; exportadoEm: string };

export async function gerarCopia(): Promise<Copia> {
  return { versao: 1, perfil: await lerPerfil(), registros: await lerRegistros(), exportadoEm: new Date().toISOString() };
}

export async function importarCopia(texto: string): Promise<number> {
  const dados = JSON.parse(texto) as Partial<Copia>;
  if (dados.versao !== 1 || !Array.isArray(dados.registros)) throw new Error("Arquivo não reconhecido.");
  const atuais = await lerRegistros();
  const ids = new Set(atuais.map((r) => r.id));
  const validos = dados.registros.filter(
    (r): r is Registro =>
      !!r && typeof r.id === "string" && typeof r.dia === "string" && typeof r.brincadeira === "string" && !ids.has(r.id),
  );
  await salvarRegistros([...validos, ...atuais].sort((a, b) => b.dia.localeCompare(a.dia)));
  if (!(await lerPerfil()) && dados.perfil) await salvarPerfil(dados.perfil);
  return validos.length;
}
