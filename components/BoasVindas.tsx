"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lerPerfil, salvarPerfil, type Perfil } from "@/lib/armazenamento";
import type { Faixa } from "@/lib/esquema";
import { chaveDia } from "@/lib/datas";
import { evento } from "@/lib/metricas";
import { VERSAO_TERMOS } from "@/config/site";
import { Cadeado } from "./Icones";
import { Marca } from "./Marca";
import { EscolhaFaixa } from "./EscolhaFaixa";

export function BoasVindas({ faixasComConteudo }: { faixasComConteudo: Faixa[] }) {
  const router = useRouter();
  const [existente, setExistente] = useState<Perfil | null>(null);
  // Começa sem idade marcada: a família escolhe de propósito, sem um padrão que passe despercebido.
  const [faixa, setFaixa] = useState<Faixa | null>(null);
  const [erroFaixa, setErroFaixa] = useState("");
  const [apelido, setApelido] = useState("");
  const [aceito, setAceito] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    lerPerfil().then((p) => {
      if (!p) return;
      setExistente(p);
      setFaixa(p.faixa);
      setApelido(p.apelido);
      setAceito(p.aceite?.versao === VERSAO_TERMOS);
    });
  }, []);

  const jaAceitou = existente?.aceite?.versao === VERSAO_TERMOS;
  const termosNovos = !!existente && !jaAceitou;

  async function continuar(e: React.FormEvent) {
    e.preventDefault();
    if (!faixa) setErroFaixa("Escolha a idade da criança.");
    if (!aceito) setErro("Para continuar, marque que você vai acompanhar a criança e que concorda com os termos.");
    if (!faixa || !aceito) return;
    setSalvando(true);
    await salvarPerfil({
      faixa,
      apelido: apelido.trim().slice(0, 30),
      inicio: existente?.inicio ?? chaveDia(new Date()),
      aceite: jaAceitou && existente?.aceite ? existente.aceite : { versao: VERSAO_TERMOS, em: new Date().toISOString() },
    });
    if (!existente) evento("boas_vindas_concluida", { faixa });
    router.push("/");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 pb-7 pt-5 md:grid md:max-w-5xl md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-12">
      <div className="flex flex-col gap-6 md:gap-8">
        <Marca />

        <div className="flex items-center gap-4" aria-hidden="true">
          <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-full bg-sol leading-none md:size-40">
            <span className="font-display text-[50px] font-extrabold tracking-tighter md:text-[72px]">1</span>
            <span className="mt-0.5 text-[15px] font-bold md:text-lg">por dia</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="block size-14 -rotate-[8deg] rounded-[14px] bg-azul md:size-20" />
            <span className="ml-8 block size-9 rounded-full bg-folha md:ml-12 md:size-12" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-display text-[28px] font-extrabold leading-[1.12] tracking-tight md:text-[40px]">
            {termosNovos
              ? "Atualizamos os termos"
              : existente
                ? "Ajustar a criança e a idade"
                : "Uma brincadeira por dia, de uns 10 minutos, com o que você tem em casa."}
          </h1>
          <p className="m-0 text-suave md:text-lg">
            {termosNovos
              ? "Leia e aceite a nova versão dos Termos de Uso e da Política de Privacidade para continuar."
              : "Feito para pais e cuidadores. A criança brinca com você, longe da tela."}
          </p>
        </div>
      </div>

      <form onSubmit={continuar} className="flex flex-1 flex-col gap-6 md:flex-none md:rounded-3xl md:border md:border-linha md:p-8 md:shadow-sm" noValidate>
        <div className="flex flex-col gap-2">
          <EscolhaFaixa
            legenda="Qual a idade da criança?"
            faixa={faixa}
            aoEscolher={(f) => {
              setFaixa(f);
              setErroFaixa("");
            }}
            disponiveis={faixasComConteudo}
          />
          {erroFaixa ? (
            <p role="alert" className="m-0 text-sm font-bold text-alerta">
              {erroFaixa}
            </p>
          ) : null}
        </div>

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
            aria-describedby="apelido-dica"
            className="min-h-[52px] rounded-[14px] border-[1.5px] border-borda bg-white px-4 text-[17px] text-tinta"
          />
          <p id="apelido-dica" className="m-0 text-sm text-suave">
            Use um apelido, não o nome completo.
          </p>
        </div>

        <p className="m-0 flex items-start gap-2 text-sm text-suave">
          <Cadeado tamanho={18} className="mt-px shrink-0" />
          Sem cadastro. O apelido e a idade ficam só neste aparelho.
        </p>

        {jaAceitou ? null : (
          <div className="flex flex-col gap-2">
            <label htmlFor="aceite" className="flex cursor-pointer items-start gap-3 rounded-[14px] bg-painel p-3.5 text-[15px]">
              <input
                id="aceite"
                type="checkbox"
                checked={aceito}
                onChange={(e) => {
                  setAceito(e.target.checked);
                  if (e.target.checked) setErro("");
                }}
                aria-describedby={erro ? "aceite-erro" : undefined}
                className="mt-0.5 size-[22px] shrink-0 accent-azul"
              />
              <span>
                Sou maior de idade, sou responsável pela criança e vou acompanhar as brincadeiras do começo ao fim. Li e concordo com os{" "}
                <Link href="/termos/" className="font-bold">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade/" className="font-bold">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
            {erro ? (
              <p id="aceite-erro" role="alert" className="m-0 text-sm font-bold text-alerta">
                {erro}
              </p>
            ) : null}
          </div>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="mt-auto flex min-h-[58px] items-center justify-center rounded-2xl bg-azul text-lg font-bold text-white transition-colors hover:bg-azul-escuro disabled:opacity-60 md:mt-0"
        >
          {existente ? (termosNovos ? "Aceitar e continuar" : "Salvar") : "Ver a brincadeira de hoje"}
        </button>
      </form>
    </main>
  );
}
