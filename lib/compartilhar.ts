"use client";

import { NOME_AREA, NOME_FAIXA, type Brincadeira } from "./esquema";

/** O que vai junto quando alguém compartilha uma página. Nunca leva dados do diário. */
export type ConteudoCompartilhar = {
  /** Caminho da página ("/brincadeira/cesto-de-panos/" ou "/"). O endereço completo usa o domínio aberto no navegador. */
  caminho: string;
  /** Assunto do e-mail e título do compartilhar do celular. */
  titulo: string;
  /** Frase curta no alto da janela de compartilhar. */
  chamada: string;
  /** Mensagem sem o link (o link vai no fim). */
  texto: string;
  /** A mesma mensagem com *negrito* do WhatsApp. */
  textoWhats: string;
  /** Dados da imagem para story (o endereço entra na hora). */
  story: { tipo: "brincadeira"; nome: string; serve: string; etiquetas: string[] } | { tipo: "site" };
  /** Base do nome dos arquivos baixados. */
  arquivo: string;
};

export function conteudoDaBrincadeira(b: Brincadeira): ConteudoCompartilhar {
  const idades = b.faixas.map((f) => NOME_FAIXA[f]);
  const resumo = `(${idades.join(" ou ")}, uns ${b.minutos} min)`;
  return {
    caminho: `/brincadeira/${b.id}/`,
    titulo: `${b.nome} · Brincadeira do Dia`,
    chamada: `Mande “${b.nome}” para outra família brincar também.`,
    texto: `Uma brincadeira para fazer com a criança: ${b.nome} ${resumo}. ${b.serve} O passo a passo está aqui:`,
    textoWhats: `Uma brincadeira para fazer com a criança: *${b.nome}* ${resumo}. ${b.serve} O passo a passo está aqui:`,
    story: { tipo: "brincadeira", nome: b.nome, serve: b.serve, etiquetas: [NOME_AREA[b.area], `uns ${b.minutos} min`, ...idades] },
    arquivo: b.id,
  };
}

export const CONTEUDO_SITE: ConteudoCompartilhar = {
  caminho: "/",
  titulo: "Brincadeira do Dia",
  chamada: "Mande o site para outra família. É de graça e sem anúncios.",
  texto:
    "Uma brincadeira por dia, de uns 10 minutos, para fazer com a criança com o que tem em casa. É de graça e sem tela para ela:",
  textoWhats:
    "*Brincadeira do Dia*: uma brincadeira por dia, de uns 10 minutos, para fazer com a criança com o que tem em casa. É de graça e sem tela para ela:",
  story: { tipo: "site" },
  arquivo: "site",
};

const enc = encodeURIComponent;

/** Abre o WhatsApp (app no celular, WhatsApp Web no computador) com a mensagem pronta; a pessoa escolhe o contato ou grupo. */
export const linkWhatsApp = (c: ConteudoCompartilhar, url: string) => `https://wa.me/?text=${enc(`${c.textoWhats} ${url}`)}`;
/** O Facebook só aceita o endereço; título, texto e imagem vêm da prévia da página (Open Graph). */
export const linkFacebook = (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
export const linkTelegram = (c: ConteudoCompartilhar, url: string) => `https://t.me/share/url?url=${enc(url)}&text=${enc(c.texto)}`;
export const linkEmail = (c: ConteudoCompartilhar, url: string) => `mailto:?subject=${enc(c.titulo)}&body=${enc(`${c.texto}\n${url}`)}`;

export async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function baixarBlob(nome: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function baixarArquivo(nome: string, conteudo: string, tipo: string) {
  baixarBlob(nome, new Blob([conteudo], { type: tipo }));
}
