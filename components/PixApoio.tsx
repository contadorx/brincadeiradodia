"use client";

import { useEffect, useState } from "react";
import { copiar } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { lerApoio, salvarApoio } from "@/lib/armazenamento";
import type { OpcaoPix } from "@/lib/apoio";
import { SITE } from "@/config/site";
import { Check } from "./Icones";

const real = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 });

async function carregarQr() {
  const m = await import("qrcode");
  return (m as unknown as { default?: typeof m }).default ?? m;
}

/**
 * PIX com atalhos de valor: a pessoa escolhe R$ 5, R$ 10, R$ 20 (config/site.ts) ou "outro valor" e copia
 * o código. Com `comQr`, mostra também o QR code do valor escolhido (só em telas largas: no celular a
 * câmera não lê a própria tela).
 */
export function PixApoio({ opcoes, origem, comQr = false }: { opcoes: OpcaoPix[]; origem: string; comQr?: boolean }) {
  const inicial = opcoes.length > 2 ? 1 : 0;
  const [escolha, setEscolha] = useState(inicial);
  const [aviso, setAviso] = useState("");
  const [falhou, setFalhou] = useState(false);
  const [qr, setQr] = useState("");
  const opcao = opcoes.at(escolha) ?? opcoes[0];

  useEffect(() => {
    if (!comQr || !window.matchMedia("(min-width: 768px)").matches) return;
    let vivo = true;
    carregarQr()
      .then((QR) => QR.toString(opcao.codigo, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#1C2333", light: "#FFFFFF" } }))
      .then((svg) => {
        if (vivo) setQr(svg);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [comQr, opcao.codigo]);

  async function copiarCodigo() {
    const ok = await copiar(opcao.codigo);
    setFalhou(!ok);
    setAviso(
      ok
        ? `Código copiado${opcao.valor ? ` (${real(opcao.valor)})` : ""}. No app do banco, escolha PIX copia e cola e cole.`
        : "Não deu para copiar sozinho. Selecione o código abaixo e copie.",
    );
    if (ok) evento("apoio_pix_copiado", { origem, valor: opcao.valor ?? "outro" });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-[15px] font-bold">Escolha um valor</legend>
        <div className="grid grid-cols-4 gap-2">
          {opcoes.map((o, i) => (
            <button
              key={o.valor ?? "outro"}
              type="button"
              aria-pressed={i === escolha}
              onClick={() => {
                setEscolha(i);
                setAviso("");
                setFalhou(false);
              }}
              className={`min-h-12 rounded-2xl border-[1.5px] px-1 text-[15px] font-bold leading-tight ${
                i === escolha ? "border-tinta bg-tinta text-white" : "border-borda bg-white text-tinta"
              }`}
            >
              {o.valor ? real(o.valor) : "Outro valor"}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={copiarCodigo}
        className="flex min-h-[52px] items-center justify-center rounded-2xl border-[1.5px] border-tinta bg-white px-4 text-base font-bold text-tinta"
      >
        {opcao.valor ? `Copiar código PIX de ${real(opcao.valor)}` : "Copiar código PIX"}
      </button>
      {!opcao.valor ? <p className="m-0 text-sm text-suave">Sem valor no código: você digita quanto quiser no app do banco.</p> : null}
      {falhou ? (
        <textarea
          readOnly
          value={opcao.codigo}
          aria-label="Código PIX copia e cola"
          onFocus={(e) => e.currentTarget.select()}
          rows={3}
          className="w-full rounded-xl border-[1.5px] border-borda bg-white p-2.5 font-mono text-xs text-tinta"
        />
      ) : null}
      {comQr && qr ? (
        <div className="hidden flex-col items-center gap-2 rounded-2xl border border-linha p-4 md:flex">
          <div
            className="w-48 max-w-full [&>svg]:h-auto [&>svg]:w-full"
            role="img"
            aria-label={`QR code do PIX${opcao.valor ? ` de ${real(opcao.valor)}` : ""}`}
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <p className="m-0 text-center text-sm text-suave">Aponte a câmera do app do banco.</p>
        </div>
      ) : null}
      <p role="status" className={aviso ? "m-0 text-[15px] font-bold" : "sr-only"}>
        {aviso}
      </p>
    </div>
  );
}

/**
 * "Já contribuí": o site para de pedir apoio por um tempo (config/site.ts) e o painel conta o clique.
 * Quem já marcou neste aparelho dentro desse tempo vê só o agradecimento, para o clique não ser contado duas vezes.
 */
export function JaContribui({ origem, aoMarcar }: { origem: string; aoMarcar?: () => void }) {
  const [estado, setEstado] = useState<"pergunta" | "agora" | "antes">("pergunta");

  useEffect(() => {
    let vivo = true;
    lerApoio()
      .then(({ declarouEm }) => {
        const dias = declarouEm ? (Date.now() - Date.parse(declarouEm)) / 86_400_000 : Infinity;
        if (vivo && dias < SITE.apoio.silencioAposApoiarDias) setEstado("antes");
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  async function marcar() {
    await salvarApoio({ declarouEm: new Date().toISOString() });
    evento("apoio_declarado", { origem });
    setEstado("agora");
    aoMarcar?.();
  }

  if (estado === "pergunta") {
    return (
      <button type="button" onClick={marcar} className="min-h-11 self-center px-3 text-[15px] font-bold text-suave underline underline-offset-2">
        Já contribuí
      </button>
    );
  }
  return (
    <p role="status" className="m-0 flex items-center justify-center gap-2 text-center text-[15px] font-bold text-folha-escuro">
      <Check tamanho={18} className="shrink-0" />
      {estado === "agora" ? "Obrigado! O site não vai pedir apoio de novo por um bom tempo." : "Você já marcou que contribuiu. Obrigado!"}
    </p>
  );
}
