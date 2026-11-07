"use client";

import Link from "next/link";
import { nomeDaCrianca, trocarCrianca, type Familia } from "@/lib/armazenamento";
import { NOME_FAIXA } from "@/lib/esquema";
import { evento } from "@/lib/metricas";

/** Botões para trocar a criança ativa. Só aparece quando a família tem mais de uma criança. */
export function TrocaCrianca({ familia, rotulo, aoTrocar }: { familia: Familia | null; rotulo: string; aoTrocar: () => void }) {
  if (!familia || familia.criancas.length < 2) return null;
  return (
    <div className="nao-imprimir flex flex-col gap-2">
      <p id="troca-crianca" className="m-0 text-sm font-bold text-suave">
        {rotulo}
      </p>
      <div role="group" aria-labelledby="troca-crianca" className="flex flex-wrap gap-2">
        {familia.criancas.map((c) => {
          const ativa = c.id === familia.ativa;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={ativa}
              onClick={async () => {
                if (ativa) return;
                await trocarCrianca(c.id);
                evento("crianca_trocada", { faixa: c.faixa });
                aoTrocar();
              }}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[15px] font-bold transition-colors ${
                ativa ? "border-azul bg-azul text-white" : "border-borda bg-white text-tinta hover:border-azul"
              }`}
            >
              {nomeDaCrianca(c, familia)}
              <span className={`text-[13px] font-normal ${ativa ? "text-white/85" : "text-suave"}`}>{NOME_FAIXA[c.faixa]}</span>
            </button>
          );
        })}
        <Link href="/criancas/" className="inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-bold">
          Gerenciar
        </Link>
      </div>
    </div>
  );
}
