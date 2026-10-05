// Gera os ícones do app a partir da marca em lib/marca.ts. Rode com: npm run icones
// Usa o sharp, que não fica no package.json (só serve para isto). Se faltar: npm i --no-save sharp
//
// Saída em public/:
//   icons/favicon.svg, favicon-48.png e favicon.ico   só as pás do catavento (16, 32 e 48 px), para a aba
//   icons/icone-192.png e -512.png    fundo azul de cantos arredondados
//   icons/icone-mascaravel-*.png      fundo azul inteiro; a marca cabe no círculo seguro do Android
//   icons/apple-touch-icon.png        180 px, fundo azul inteiro (o iPhone arredonda sozinho)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { AZUL_MARCA, faviconSvg, marcaSvg } from "../lib/marca.ts";

async function carregarSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    /* tenta pelo require, que respeita NODE_PATH */
  }
  try {
    return createRequire(import.meta.url)("sharp");
  } catch {
    console.error("Este script usa o sharp. Rode antes: npm i --no-save sharp");
    process.exit(1);
  }
}

const sharp = await carregarSharp();
const PUBLICO = path.resolve("public");
const ICONES = path.join(PUBLICO, "icons");
fs.mkdirSync(ICONES, { recursive: true });

// Desenha o SVG com folga (densidade dobrada) e reduz: bordas mais limpas.
async function png(svg, tamanho, { opaco = false } = {}) {
  let img = sharp(Buffer.from(svg), { density: Math.ceil((72 * tamanho * 2) / 64) }).resize(tamanho, tamanho);
  if (opaco) img = img.flatten({ background: AZUL_MARCA });
  return img.png({ compressionLevel: 9 }).toBuffer();
}

// .ico com PNGs dentro (aceito por todos os navegadores atuais).
function ico(imagens) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(imagens.length, 4);
  let posicao = 6 + 16 * imagens.length;
  const entradas = imagens.map(({ tamanho, dados }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamanho, 0);
    e.writeUInt8(tamanho, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(dados.length, 8);
    e.writeUInt32LE(posicao, 12);
    posicao += dados.length;
    return e;
  });
  return Buffer.concat([cabecalho, ...entradas, ...imagens.map((i) => i.dados)]);
}

const aba = faviconSvg();
const comCantos = marcaSvg({ fundo: AZUL_MARCA, raio: 14, escala: 0.84 });
// No Android o ícone é cortado em círculo (raio de 40% do lado): a 0,72, as pontas das pás ficam dentro.
const mascaravel = marcaSvg({ fundo: AZUL_MARCA, escala: 0.72 });
const apple = marcaSvg({ fundo: AZUL_MARCA, escala: 0.8 });

fs.writeFileSync(path.join(ICONES, "favicon.svg"), aba + "\n");
for (const t of [192, 512]) {
  fs.writeFileSync(path.join(ICONES, `icone-${t}.png`), await png(comCantos, t));
  fs.writeFileSync(path.join(ICONES, `icone-mascaravel-${t}.png`), await png(mascaravel, t, { opaco: true }));
}
fs.writeFileSync(path.join(ICONES, "apple-touch-icon.png"), await png(apple, 180, { opaco: true }));
fs.writeFileSync(path.join(ICONES, "favicon-48.png"), await png(aba, 48));
const pequenos = await Promise.all([16, 32, 48].map(async (tamanho) => ({ tamanho, dados: await png(aba, tamanho) })));
fs.writeFileSync(path.join(PUBLICO, "favicon.ico"), ico(pequenos));
console.log("Ícones gerados em public/icons e public/favicon.ico");
