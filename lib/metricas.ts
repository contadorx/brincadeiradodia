"use client";

/**
 * Eventos anônimos para o painel do Umami. Nunca envie nome, apelido,
 * anotações ou qualquer dado que identifique a família ou a criança.
 * Se o Umami não estiver configurado, as chamadas não fazem nada.
 */

/** Marcos do diário: a 1ª, a 5ª e a 10ª brincadeira salva pela família (linha de base do hábito). */
export const MARCOS_DIARIO = [1, 5, 10] as const;
export type MarcoDiario = (typeof MARCOS_DIARIO)[number];

export type NomeEvento =
  | "boas_vindas_concluida"
  | "brincadeira_aberta"
  | "brincadeira_iniciada"
  | "brincadeira_concluida"
  | `diario_marco_${MarcoDiario}`
  | "nivel_trocado"
  | "brincadeira_trocada"
  | "filtro_usado"
  | "app_instalado"
  | "lembrete_baixado"
  | "diario_exportado"
  | "diario_importado"
  | "apoio_cartao_mostrado"
  | "apoio_pix_copiado"
  | "apoio_declarado"
  | "apoio_dispensado"
  | "revisao_convite_clicado"
  | "compartilhar_aberto"
  | "compartilhado"
  | "uso_semana"
  | "crianca_adicionada"
  | "crianca_trocada"
  | "crianca_removida";

type Dados = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (nome: string, dados?: Dados) => void };
  }
}

export function evento(nome: NomeEvento, dados?: Dados) {
  try {
    window.umami?.track(nome, dados);
  } catch {
    /* métricas nunca podem quebrar o app */
  }
}
