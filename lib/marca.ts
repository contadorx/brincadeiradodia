/**
 * A marca do site: um catavento, brinquedo de criança de sempre. O "do dia" fica com o nome ao lado.
 *
 * Desenho único, numa grade de 64 x 64, feito só de caminhos (sem textos nem ids). Daqui saem
 * o <Selo> do site, a imagem para story (lib/imagemStory.ts, que desenha os mesmos caminhos)
 * e os ícones do app (scripts/gerar-icones.mjs). Mudou o desenho? Rode `npm run icones` e `npm run og`.
 */
const TINTA = "#1C2333";
export const AZUL_MARCA = "#2F55C9";
const SOL = "#FFC845";
const FOLHA = "#23804F";
const BRANCO = "#FFFFFF";

export type Forma = { d: string; preenche?: string; contorno?: string; espessura?: number };

/** Centro das pás (eixo do giro) e centro da marca inteira, com o cabo. */
export const EIXO = { x: 32, y: 25 };
const CENTRO_Y = 33.5;

/** O cabo, que fica parado. */
export const FORMAS_CABO: readonly Forma[] = [{ d: "M32 25V60.5", contorno: TINTA, espessura: 4 }];

/**
 * As quatro pás e o pino do meio: a parte que gira. Cada pá vai do eixo ao meio de um lado e a um
 * canto, e volta ao eixo por uma curva, como o papel dobrado de um catavento de verdade.
 */
export const FORMAS_PAS: readonly Forma[] = [
  { d: "M32 25L32 6L13 6Q18.96 19.04 32 25Z", preenche: SOL, contorno: TINTA, espessura: 3 },
  { d: "M32 25L13 25L13 44Q26.04 38.04 32 25Z", preenche: BRANCO, contorno: TINTA, espessura: 3 },
  { d: "M32 25L32 44L51 44Q45.04 30.96 32 25Z", preenche: SOL, contorno: TINTA, espessura: 3 },
  { d: "M32 25L51 25L51 6Q37.96 11.96 32 25Z", preenche: FOLHA, contorno: TINTA, espessura: 3 },
  { d: "M29 25A3 3 0 1 0 35 25A3 3 0 1 0 29 25Z", preenche: TINTA },
];

export const FORMAS_MARCA: readonly Forma[] = [...FORMAS_CABO, ...FORMAS_PAS];

// Cantos e pontas arredondados em tudo (no canvas também: lib/imagemStory.ts).
const paraSvg = (formas: readonly Forma[]) =>
  formas
    .map(
      (f) =>
        `<path d="${f.d}" fill="${f.preenche ?? "none"}"${
          f.contorno ? ` stroke="${f.contorno}" stroke-width="${f.espessura}" stroke-linejoin="round" stroke-linecap="round"` : ""
        }/>`,
    )
    .join("");

export const MARCA_CABO = paraSvg(FORMAS_CABO);
export const MARCA_PAS = paraSvg(FORMAS_PAS);
export const MARCA_CORPO = MARCA_CABO + MARCA_PAS;

/**
 * SVG completo da marca.
 * fundo: cor do quadrado de fundo (sem fundo = transparente); raio: canto do fundo (0 = quadrado inteiro);
 * escala: tamanho da marca dentro do fundo (1 = ocupa a grade toda).
 */
export function marcaSvg({ fundo, raio = 0, escala = 1, tamanho = 64 }: { fundo?: string; raio?: number; escala?: number; tamanho?: number } = {}) {
  const quadro = fundo ? `<rect width="64" height="64" rx="${raio}" fill="${fundo}"/>` : "";
  // Com o cabo, a marca vai de y=4,5 a y=62,5: o centro fica em y=33,5.
  const corpo = `<g transform="translate(32 32) scale(${escala}) translate(-32 -${CENTRO_Y})">${MARCA_CORPO}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${tamanho}" height="${tamanho}">${quadro}${corpo}</svg>`;
}

/** Só as pás, sem o cabo e maiores: lê melhor no tamanho da aba do navegador (16 e 32 px). */
export function faviconSvg({ tamanho = 64 }: { tamanho?: number } = {}) {
  const corpo = `<g transform="translate(32 32) scale(1.45) translate(-${EIXO.x} -${EIXO.y})">${MARCA_PAS}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${tamanho}" height="${tamanho}">${corpo}</svg>`;
}
