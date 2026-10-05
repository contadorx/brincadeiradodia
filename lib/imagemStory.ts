"use client";

import { AZUL_MARCA, EIXO, FORMAS_MARCA } from "./marca";

/**
 * Imagem vertical (1080 x 1920) para story do Instagram, status do WhatsApp ou do Facebook.
 * É desenhada no próprio aparelho, com as fontes do site; nada vai para servidor.
 * O Instagram não aceita link dentro da imagem: a pessoa cola o endereço na figurinha "Link".
 * Faixas de cima e de baixo (uns 250 px) ficam sob os botões do Instagram: ali só há enfeite.
 */
export type DadosStory =
  | { tipo: "brincadeira"; nome: string; serve: string; etiquetas: string[]; endereco: string }
  | { tipo: "site"; endereco: string };

const L = 1080;
const A = 1920;
const TINTA = "#1C2333";
const SUAVE = "#5A6273";
const SOL = "#FFC845";
const SOL_CLARO = "#FFF4D6";
const PAINEL = "#F2F4F8";
const LINHA = "#DCE1EA";
const FOLHA = "#23804F";
const AZUL_CLARO = "#E8EEFC";
const TITULO = '"Bricolage Grotesque Variable", system-ui, sans-serif';
const TEXTO = '"Atkinson Hyperlegible", system-ui, sans-serif';

async function carregarFontes() {
  const amostra = "Brincadeira do Dia ÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç 0123456789";
  try {
    await Promise.all([
      document.fonts.load(`800 92px ${TITULO}`, amostra),
      document.fonts.load(`400 46px ${TEXTO}`, amostra),
      document.fonts.load(`700 34px ${TEXTO}`, amostra),
    ]);
  } catch {
    /* sem as fontes do site, o navegador usa as dele */
  }
}

function quebrar(ctx: CanvasRenderingContext2D, texto: string, largura: number, maxLinhas: number) {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of texto.split(/\s+/).filter(Boolean)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (!atual || ctx.measureText(tentativa).width <= largura) atual = tentativa;
    else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  if (linhas.length <= maxLinhas) return linhas;
  const cortadas = linhas.slice(0, maxLinhas);
  let ultima = cortadas[maxLinhas - 1];
  while (ultima.includes(" ") && ctx.measureText(`${ultima}…`).width > largura) ultima = ultima.replace(/\s+\S+$/, "");
  cortadas[maxLinhas - 1] = `${ultima.replace(/[,.;:]$/, "")}…`;
  return cortadas;
}

function caixa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Desenha a marca (os mesmos caminhos do SVG) com o canto de cima à esquerda em (x, y). */
function desenharMarca(ctx: CanvasRenderingContext2D, x: number, y: number, tamanho: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(tamanho / 64, tamanho / 64);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const f of FORMAS_MARCA) {
    const p = new Path2D(f.d);
    if (f.preenche) {
      ctx.fillStyle = f.preenche;
      ctx.fill(p);
    }
    if (f.contorno) {
      ctx.strokeStyle = f.contorno;
      ctx.lineWidth = f.espessura ?? 1;
      ctx.stroke(p);
    }
  }
  ctx.restore();
}

function enfeites(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = SOL;
  ctx.beginPath();
  ctx.arc(1010, 110, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(40, 1840);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.fillStyle = FOLHA;
  caixa(ctx, -170, -170, 340, 340, 72);
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 12;
  ctx.strokeStyle = AZUL_CLARO;
  ctx.beginPath();
  ctx.arc(120, 150, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.save();
  ctx.translate(960, 1700);
  ctx.rotate((14 * Math.PI) / 180);
  ctx.strokeStyle = SOL;
  caixa(ctx, -50, -50, 100, 100, 22);
  ctx.stroke();
  ctx.restore();
}

export async function gerarImagemStory(dados: DadosStory): Promise<Blob> {
  await carregarFontes();
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Sem canvas");
  ctx.textBaseline = "top";

  ctx.fillStyle = AZUL_MARCA;
  ctx.fillRect(0, 0, L, A);
  enfeites(ctx);

  // Catavento e nome, centralizados; o meio das pás fica na altura do meio do nome.
  ctx.font = `800 64px ${TITULO}`;
  const nome = "Brincadeira do Dia";
  const larguraNome = ctx.measureText(nome).width;
  const tamMarca = 132;
  const k = tamMarca / 64;
  const visivel = (52.5 - 11.5) * k; // largura do desenho dentro da grade de 64
  const vao = 28;
  const xVisivel = (L - (visivel + vao + larguraNome)) / 2;
  const topoNome = 304;
  desenharMarca(ctx, xVisivel - 11.5 * k, topoNome + 34 - EIXO.y * k, tamMarca);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(nome, xVisivel + visivel + vao, topoNome);

  // Conteúdo do bilhete
  const X = 72;
  const W = L - 2 * X;
  const P = 64;
  const larguraTexto = W - 2 * P;
  const etiquetas = dados.tipo === "brincadeira" ? dados.etiquetas : ["De graça", "Sem cadastro"];
  const titulo = dados.tipo === "brincadeira" ? dados.nome : "Uma brincadeira por dia";
  const corpo =
    dados.tipo === "brincadeira" ? dados.serve : "De uns 10 minutos, com o que você tem em casa. Para pais e cuidadores.";
  const rodape = "Sem tela: a criança brinca com você.";

  // Etiquetas em linhas
  ctx.font = `700 34px ${TEXTO}`;
  const etiquetasPos: { texto: string; x: number; y: number; w: number; cor: string }[] = [];
  let ex = X + P;
  let ey = 0;
  etiquetas.forEach((t, i) => {
    const w = ctx.measureText(t).width + 52;
    if (ex + w > X + W - P && ex > X + P) {
      ex = X + P;
      ey += 78;
    }
    etiquetasPos.push({ texto: t, x: ex, y: ey, w, cor: i === 0 ? SOL_CLARO : PAINEL });
    ex += w + 14;
  });
  const alturaEtiquetas = ey + 64;

  // O bilhete fica no meio do espaço entre o nome e o endereço. Se não couber, corta o corpo e
  // depois o título (com reticências).
  const TOPO = 450;
  const BASE = 1500;
  let maxTitulo = 3;
  let maxCorpo = 5;
  let linhasTitulo: string[] = [];
  let linhasCorpo: string[] = [];
  let linhasRodape: string[] = [];
  let alturaBilhete = 0;
  for (;;) {
    ctx.font = `800 92px ${TITULO}`;
    linhasTitulo = quebrar(ctx, titulo, larguraTexto, maxTitulo);
    ctx.font = `400 46px ${TEXTO}`;
    linhasCorpo = quebrar(ctx, corpo, larguraTexto, maxCorpo);
    ctx.font = `700 40px ${TEXTO}`;
    linhasRodape = quebrar(ctx, rodape, larguraTexto, 2);
    alturaBilhete =
      P + alturaEtiquetas + 40 + linhasTitulo.length * 98 + 26 + linhasCorpo.length * 62 + 40 + 3 + 36 + linhasRodape.length * 54 + P - 10;
    if (alturaBilhete <= BASE - TOPO) break;
    if (maxCorpo > 2) maxCorpo--;
    else if (maxTitulo > 2) maxTitulo--;
    else break;
  }

  const Y = Math.round(TOPO + Math.max(0, (BASE - TOPO - alturaBilhete) / 2));

  ctx.save();
  ctx.shadowColor = "rgba(22, 27, 41, 0.28)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = "#FFFFFF";
  caixa(ctx, X, Y, W, alturaBilhete, 48);
  ctx.fill();
  ctx.restore();

  let y = Y + P;
  ctx.font = `700 34px ${TEXTO}`;
  for (const e of etiquetasPos) {
    ctx.fillStyle = e.cor;
    caixa(ctx, e.x, y + e.y, e.w, 64, 32);
    ctx.fill();
    ctx.fillStyle = TINTA;
    ctx.fillText(e.texto, e.x + 26, y + e.y + 14);
  }
  y += alturaEtiquetas + 40;

  ctx.fillStyle = TINTA;
  ctx.font = `800 92px ${TITULO}`;
  for (const linha of linhasTitulo) {
    ctx.fillText(linha, X + P, y);
    y += 98;
  }
  y += 26;
  ctx.fillStyle = SUAVE;
  ctx.font = `400 46px ${TEXTO}`;
  for (const linha of linhasCorpo) {
    ctx.fillText(linha, X + P, y);
    y += 62;
  }
  y += 40;
  ctx.fillStyle = LINHA;
  ctx.fillRect(X + P, y, larguraTexto, 3);
  y += 3 + 36;
  ctx.fillStyle = TINTA;
  ctx.font = `700 40px ${TEXTO}`;
  for (const linha of linhasRodape) {
    ctx.fillText(linha, X + P, y);
    y += 54;
  }

  // Endereço, embaixo, acima da faixa dos botões do Instagram
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 42px ${TEXTO}`;
  ctx.fillText(dados.tipo === "brincadeira" ? "O passo a passo está em" : "Comece por aqui:", L / 2, 1540);
  ctx.fillStyle = SOL;
  ctx.font = `800 56px ${TITULO}`;
  ctx.fillText(dados.endereco, L / 2, 1600);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Não deu para gerar a imagem"))), "image/png"),
  );
}
