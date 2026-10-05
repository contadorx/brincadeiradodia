// Gera public/og.png (1200 x 630), a imagem que aparece quando alguém manda um link do site
// no WhatsApp, Facebook, Telegram etc. Rode com: npm run og
// Usa o Playwright (navegador sem janela), que não fica no package.json. Se faltar:
//   npm i --no-save playwright && npx playwright install chromium
// O conteúdo fica no meio: o WhatsApp às vezes recorta a imagem em quadrado.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { marcaSvg } from "../lib/marca.ts";

async function carregarPlaywright() {
  try {
    return await import("playwright");
  } catch {
    /* tenta pelo require, que respeita NODE_PATH */
  }
  try {
    return createRequire(import.meta.url)("playwright");
  } catch {
    console.error("Este script usa o Playwright. Rode antes: npm i --no-save playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const { chromium } = await carregarPlaywright();
const fonte = (p) => pathToFileURL(path.resolve("node_modules", p)).href;

const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
@font-face{font-family:Bri;src:url(${fonte("@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:Atk;src:url(${fonte("@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2")}) format("woff2");font-weight:400}
@font-face{font-family:Atk;src:url(${fonte("@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2")}) format("woff2");font-weight:700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#2F55C9;color:#fff;font-family:Atk;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.marca{width:188px;height:188px}
h1{font:800 66px/1 Bri;letter-spacing:-.025em;margin-top:14px}
p{font-size:30px;line-height:1.3;color:#E8EEFC;max-width:600px;margin-top:16px}
.selo{margin-top:24px;background:#FFC845;color:#1C2333;font-weight:700;font-size:23px;padding:10px 22px;border-radius:999px}
.f{position:absolute}
</style>
<svg class="f" style="left:-70px;top:-60px" width="260" height="260"><circle cx="130" cy="130" r="120" fill="#FFC845"/></svg>
<svg class="f" style="right:-40px;bottom:-50px;transform:rotate(-10deg)" width="230" height="230"><rect x="10" y="10" width="210" height="210" rx="44" fill="#23804F"/></svg>
<svg class="f" style="right:90px;top:70px" width="60" height="60"><circle cx="30" cy="30" r="26" fill="none" stroke="#E8EEFC" stroke-width="7"/></svg>
<svg class="f" style="left:110px;bottom:80px;transform:rotate(14deg)" width="64" height="64"><rect x="6" y="6" width="52" height="52" rx="12" fill="none" stroke="#FFC845" stroke-width="7"/></svg>
<div class="marca">${marcaSvg({ tamanho: 188 })}</div>
<h1>Brincadeira do Dia</h1>
<p>Uma brincadeira por dia, de uns 10 minutos, com o que você tem em casa.</p>
<span class="selo">De graça, sem cadastro e sem tela para a criança</span>
</html>`;

const arquivo = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "og-")), "og.html");
fs.writeFileSync(arquivo, html);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.goto(pathToFileURL(arquivo).href);
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: path.resolve("public/og.png") });
await navegador.close();
console.log("Imagem de prévia gerada em public/og.png");
