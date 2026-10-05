"use client";

import { FAIXAS, NOME_FAIXA, type Faixa } from "@/lib/esquema";

/** Botões de faixa de idade. Faixas sem brincadeiras aparecem como "em breve". */
export function EscolhaFaixa({
  legenda,
  faixa,
  aoEscolher,
  disponiveis,
}: {
  legenda: string;
  faixa: Faixa | null;
  aoEscolher: (f: Faixa) => void;
  disponiveis: readonly Faixa[];
}) {
  const semCincoASeis = !disponiveis.includes("5-6") && disponiveis.includes("4-5");
  return (
    <fieldset className="m-0 flex flex-col border-0 p-0">
      <legend className="mb-2.5 p-0 text-[17px] font-bold">{legenda}</legend>
      <div className="grid grid-cols-3 gap-2">
        {FAIXAS.map((f) => {
          const disponivel = disponiveis.includes(f);
          const ativa = f === faixa;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={ativa}
              disabled={!disponivel}
              onClick={() => aoEscolher(f)}
              className={`flex min-h-[52px] flex-col items-center justify-center rounded-[14px] border-[1.5px] px-1 text-[15px] font-bold leading-tight transition-colors ${
                ativa ? "border-azul bg-azul text-white" : disponivel ? "border-borda bg-white text-tinta hover:border-azul" : "border-linha bg-painel text-suave"
              }`}
            >
              {NOME_FAIXA[f]}
              {!disponivel ? <span className="text-xs font-normal">em breve</span> : null}
            </button>
          );
        })}
      </div>
      <p className="m-0 mt-2 text-sm text-suave">
        Escolha pela idade que a criança tem hoje: 3 a 4 anos é de 3 anos até antes de fazer 4. Para bebês com menos de 1 ano,
        ainda não temos brincadeiras.
      </p>
      {semCincoASeis ? (
        <p className="m-0 mt-2 text-sm text-suave">
          Já fez 5 anos? As brincadeiras de 5 a 6 anos estão chegando. Por enquanto, escolha 4 a 5 anos e use o nível “Mais difícil”.
        </p>
      ) : null}
    </fieldset>
  );
}
