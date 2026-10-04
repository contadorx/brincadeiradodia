"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lerPerfil, salvarPerfil, type Perfil } from "@/lib/armazenamento";
import { FAIXAS, NOME_FAIXA, type Faixa } from "@/lib/esquema";
import { chaveDia } from "@/lib/datas";
import { evento } from "@/lib/metricas";
import { Cadeado } from "./Icones";
import { Marca } from "./Marca";

export function BoasVindas({ faixasComConteudo }: { faixasComConteudo: Faixa[] }) {
  const router = useRouter();
  const [existente, setExistente] = useState<Perfil | null>(null);
  const [faixa, setFaixa] = useState<Faixa>(faixasComConteudo[0] ?? "3-4");
  const [apelido, setApelido] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    lerPerfil().then((p) => {
      if (!p) return;
      setExistente(p);
      setFaixa(p.faixa);
      setApelido(p.apelido);
    });
  }, []);

  async function continuar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    await salvarPerfil({
      faixa,
      apelido: apelido.trim().slice(0, 30),
      inicio: existente?.inicio ?? chaveDia(new Date()),
    });
    if (!existente) evento("boas_vindas_concluida", { faixa });
    router.push("/");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 pb-7 pt-5">
      <Marca />

      <div className="flex items-center gap-4" aria-hidden="true">
        <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-full bg-sol leading-none">
          <span className="font-display text-[50px] font-extrabold tracking-tighter">10</span>
          <span className="mt-0.5 text-[15px] font-bold">minutos</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="block size-14 -rotate-[8deg] rounded-[14px] bg-azul" />
          <span className="ml-8 block size-9 rounded-full bg-folha" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-display text-[28px] font-extrabold leading-[1.12] tracking-tight">
          {existente ? "Ajustar a criança e a idade" : "Uma brincadeira por dia, de 10 minutos, com o que você tem em casa."}
        </h1>
        <p className="m-0 text-suave">Feito para pais e cuidadores. A criança brinca com você, longe da tela.</p>
      </div>

      <form onSubmit={continuar} className="flex flex-1 flex-col gap-6">
        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="mb-2.5 p-0 text-[17px] font-bold">Qual a idade da criança?</legend>
          <div className="grid grid-cols-3 gap-2">
            {FAIXAS.map((f) => {
              const disponivel = faixasComConteudo.includes(f);
              const ativa = f === faixa;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={ativa}
                  disabled={!disponivel}
                  onClick={() => setFaixa(f)}
                  className={`flex min-h-[52px] flex-col items-center justify-center rounded-[14px] border-[1.5px] px-1 text-[15px] font-bold leading-tight ${
                    ativa ? "border-azul bg-azul text-white" : disponivel ? "border-borda bg-white text-tinta" : "border-linha bg-painel text-suave"
                  }`}
                >
                  {NOME_FAIXA[f]}
                  {!disponivel ? <span className="text-xs font-normal">em breve</span> : null}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="apelido" className="text-[17px] font-bold">
            Como vocês chamam a criança? <span className="font-normal text-suave">(opcional)</span>
          </label>
          <input
            id="apelido"
            type="text"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            maxLength={30}
            autoComplete="off"
            className="min-h-[52px] rounded-[14px] border-[1.5px] border-borda bg-white px-4 text-[17px] text-tinta"
          />
        </div>

        <p className="m-0 flex items-start gap-2 text-sm text-suave">
          <Cadeado tamanho={18} className="mt-px shrink-0" />
          Sem cadastro. O apelido e a idade ficam só neste celular.
        </p>

        <button
          type="submit"
          disabled={salvando}
          className="mt-auto flex min-h-[58px] items-center justify-center rounded-2xl bg-azul text-lg font-bold text-white disabled:opacity-60"
        >
          {existente ? "Salvar" : "Ver a brincadeira de hoje"}
        </button>
      </form>
    </main>
  );
}
