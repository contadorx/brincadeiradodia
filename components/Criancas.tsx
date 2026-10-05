"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adicionarCrianca,
  contarRegistros,
  editarCrianca,
  MAX_CRIANCAS,
  nomeDaCrianca,
  removerCrianca,
  trocarCrianca,
  type Crianca,
  type Familia,
} from "@/lib/armazenamento";
import { NOME_FAIXA, type Faixa } from "@/lib/esquema";
import { evento } from "@/lib/metricas";
import { useDados } from "@/lib/useDados";
import { Cabecalho, CONTEUDO } from "./Cabecalho";
import { Carregando } from "./Carregando";
import { EscolhaFaixa } from "./EscolhaFaixa";
import { Cadeado, Check, Voltar } from "./Icones";
import { NavInferior } from "./NavInferior";

const CORES = ["bg-sol", "bg-folha text-white", "bg-azul text-white", "bg-alerta-claro text-alerta", "bg-azul-claro text-azul", "bg-folha-claro text-folha-escuro"];

function Formulario({
  inicial,
  disponiveis,
  titulo,
  botao,
  aoSalvar,
  aoCancelar,
  extra,
}: {
  inicial: { apelido: string; faixa: Faixa | null };
  disponiveis: readonly Faixa[];
  titulo: string;
  botao: string;
  aoSalvar: (dados: { apelido: string; faixa: Faixa }) => Promise<void>;
  aoCancelar: () => void;
  extra?: React.ReactNode;
}) {
  const [apelido, setApelido] = useState(inicial.apelido);
  const [faixa, setFaixa] = useState<Faixa | null>(inicial.faixa);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const mudouFaixa = inicial.faixa !== null && faixa !== inicial.faixa;

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!faixa) {
          setErro("Escolha a idade da criança.");
          return;
        }
        setSalvando(true);
        await aoSalvar({ apelido, faixa });
        setSalvando(false);
      }}
      className="flex flex-col gap-4 rounded-2xl border border-linha bg-white p-4 md:p-5"
      aria-label={titulo}
    >
      <p className="m-0 font-display text-[19px] font-extrabold">{titulo}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`apelido-${titulo}`} className="font-bold">
          Como vocês chamam a criança? <span className="font-normal text-suave">(opcional)</span>
        </label>
        <input
          id={`apelido-${titulo}`}
          type="text"
          value={apelido}
          maxLength={30}
          autoComplete="off"
          onChange={(e) => setApelido(e.target.value)}
          className="min-h-[52px] rounded-[14px] border-[1.5px] border-borda bg-white px-4 text-[17px] text-tinta"
        />
        <p className="m-0 text-sm text-suave">Use um apelido, não o nome completo.</p>
      </div>
      <EscolhaFaixa
        legenda="Qual a idade?"
        faixa={faixa}
        disponiveis={disponiveis}
        aoEscolher={(f) => {
          setFaixa(f);
          setErro("");
        }}
      />
      {mudouFaixa ? (
        <p className="m-0 rounded-xl bg-sol-claro px-3.5 py-2.5 text-sm">
          Trocando a idade, a sequência de brincadeiras desta criança recomeça na semana 1. O diário continua.
        </p>
      ) : null}
      {erro ? (
        <p role="alert" className="m-0 text-sm font-bold text-alerta">
          {erro}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2.5">
        <button type="submit" disabled={salvando} className="min-h-12 flex-1 rounded-2xl bg-azul px-5 font-bold text-white transition-colors hover:bg-azul-escuro disabled:opacity-60">
          {botao}
        </button>
        <button type="button" onClick={aoCancelar} className="min-h-12 rounded-2xl border-[1.5px] border-borda px-5 font-bold text-tinta">
          Cancelar
        </button>
      </div>
      {extra}
    </form>
  );
}

function Remover({ nome, aoRemover }: { nome: string; aoRemover: () => Promise<void> }) {
  const [armado, setArmado] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 border-t border-linha pt-3">
      <button
        type="button"
        onClick={async () => {
          if (!armado) {
            setArmado(true);
            return;
          }
          await aoRemover();
        }}
        className={`min-h-11 self-start rounded-xl border-[1.5px] px-4 font-bold ${armado ? "border-alerta bg-alerta-claro text-alerta" : "border-borda text-tinta"}`}
      >
        {armado ? `Confirmar: remover ${nome}` : `Remover ${nome} deste aparelho`}
      </button>
      {armado ? <p className="m-0 text-sm text-alerta">O diário de {nome} também será apagado. Não dá para desfazer.</p> : null}
    </div>
  );
}

export function Criancas({ disponiveis }: { disponiveis: readonly Faixa[] }) {
  const router = useRouter();
  const { familia, pronto, recarregar } = useDados();
  const [editando, setEditando] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const [contagem, setContagem] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pronto) contarRegistros().then(setContagem);
  }, [pronto, familia]);

  if (!pronto || !familia) return <Carregando />;
  const f: Familia = familia;

  async function brincarCom(c: Crianca) {
    await trocarCrianca(c.id);
    evento("crianca_trocada", { faixa: c.faixa });
    router.push("/");
  }

  return (
    <>
      <Cabecalho />
      <main className={`pb-nav flex flex-col gap-5 pt-3.5 md:pt-8 ${CONTEUDO}`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-1 self-start font-bold text-tinta no-underline md:hidden">
          <Voltar tamanho={22} />
          Hoje
        </Link>
        <div className="flex max-w-2xl flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight md:text-[40px]">Crianças</h1>
            <p className="m-0 text-suave md:text-lg">
              Cada criança tem a idade, o diário e a sequência de brincadeiras próprios. Escolha com quem vai brincar agora.
            </p>
          </div>

          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {f.criancas.map((c, i) => {
              const nome = nomeDaCrianca(c, f);
              const ativa = c.id === f.ativa;
              const n = contagem[c.id] ?? 0;
              if (editando === c.id) {
                return (
                  <li key={c.id}>
                    <Formulario
                      titulo={`Editar ${nome}`}
                      botao="Salvar"
                      inicial={{ apelido: c.apelido, faixa: c.faixa }}
                      disponiveis={disponiveis}
                      aoCancelar={() => setEditando(null)}
                      aoSalvar={async (dados) => {
                        await editarCrianca(c.id, dados);
                        setEditando(null);
                        recarregar();
                      }}
                      extra={
                        f.criancas.length > 1 ? (
                          <Remover
                            nome={nome}
                            aoRemover={async () => {
                              await removerCrianca(c.id);
                              evento("crianca_removida", { total: f.criancas.length - 1 });
                              setEditando(null);
                              recarregar();
                            }}
                          />
                        ) : null
                      }
                    />
                  </li>
                );
              }
              return (
                <li
                  key={c.id}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border-[1.5px] p-3.5 md:p-4 ${ativa ? "border-azul bg-azul-claro" : "border-linha bg-white"}`}
                >
                  <span aria-hidden="true" className={`grid size-12 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold ${CORES[i % CORES.length]}`}>
                    {nome.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[17px] font-bold">{nome}</span>
                    <span className="text-sm text-suave">
                      {NOME_FAIXA[c.faixa]} · {n} {n === 1 ? "brincadeira" : "brincadeiras"} no diário
                    </span>
                  </div>
                  <div className="flex w-full gap-2 sm:w-auto">
                    {ativa ? (
                      <span className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 px-2 text-[15px] font-bold text-azul sm:flex-none">
                        <Check tamanho={18} />
                        Brincando agora
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => brincarCom(c)}
                        className="min-h-11 flex-1 rounded-xl bg-azul px-4 text-[15px] font-bold text-white transition-colors hover:bg-azul-escuro sm:flex-none"
                      >
                        Brincar com {nome}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAdicionando(false);
                        setEditando(c.id);
                      }}
                      aria-label={`Editar ${nome}`}
                      className="min-h-11 rounded-xl border-[1.5px] border-borda bg-white px-4 text-[15px] font-bold text-tinta"
                    >
                      Editar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {adicionando ? (
            <Formulario
              titulo="Nova criança"
              botao="Adicionar e brincar"
              inicial={{ apelido: "", faixa: null }}
              disponiveis={disponiveis}
              aoCancelar={() => setAdicionando(false)}
              aoSalvar={async (dados) => {
                const nova = await adicionarCrianca(dados);
                evento("crianca_adicionada", { faixa: dados.faixa, total: nova.criancas.length });
                router.push("/");
              }}
            />
          ) : f.criancas.length < MAX_CRIANCAS ? (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setAdicionando(true);
              }}
              className="flex min-h-[54px] items-center justify-center rounded-2xl border-[1.5px] border-dashed border-azul font-bold text-azul transition-colors hover:bg-azul-claro"
            >
              + Adicionar criança
            </button>
          ) : (
            <p className="m-0 text-sm text-suave">Este aparelho guarda até {MAX_CRIANCAS} crianças.</p>
          )}

          <p className="m-0 flex items-start gap-2 text-sm text-suave">
            <Cadeado tamanho={18} className="mt-px shrink-0" />
            Sem cadastro. Os apelidos, as idades e os diários ficam só neste aparelho.
          </p>
        </div>
      </main>
      <NavInferior />
    </>
  );
}
