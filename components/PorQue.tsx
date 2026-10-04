import { SITE } from "@/config/site";
import { NOME_EVIDENCIA, type Brincadeira } from "@/lib/esquema";
import { Check, Livro } from "./Icones";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-10" → "nov/2026" */
function mesAno(iso: string) {
  return `${MESES.at(Number(iso.slice(5, 7)) - 1)}/${iso.slice(0, 4)}`;
}

export function SeloRascunho() {
  return (
    <span className="inline-flex min-h-[30px] items-center rounded-full bg-alerta-claro px-3 text-[13px] font-bold text-alerta">
      Rascunho, ainda sem revisão
    </span>
  );
}

/** De onde veio a brincadeira, quem revisou e como relatar um problema. */
export function PorQue({ b }: { b: Brincadeira }) {
  const assunto = encodeURIComponent(`Problema na brincadeira: ${b.nome} (${b.id})`);
  const r = b.revisao;
  return (
    <section aria-labelledby="porque" className="flex flex-col gap-2 rounded-2xl border border-linha p-3.5 text-[15px] md:p-4">
      <h2 id="porque" className="m-0 font-display text-[17px] font-extrabold">
        Por que esta brincadeira
      </h2>
      <p className="m-0 flex items-start gap-2 font-bold">
        <Livro tamanho={19} className="mt-0.5 shrink-0 text-azul" />
        {NOME_EVIDENCIA[b.evidencia]}
      </p>
      <p className="m-0 text-suave">{b.base}.</p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
        {b.fontes.map((f) => (
          <li key={f.url}>
            <a href={f.url} target="_blank" rel="noopener">
              {f.titulo}
            </a>
          </li>
        ))}
      </ul>
      {r ? (
        <p className="m-0 flex items-start gap-2 font-bold text-folha-escuro">
          <Check tamanho={19} className="mt-0.5 shrink-0" />
          {r.mostrarNome && r.nome
            ? `Revisada por ${r.nome}, ${r.profissao.toLowerCase()}, em ${mesAno(r.em)}`
            : `Revisada por ${r.profissao.toLowerCase()} em ${mesAno(r.em)}`}
        </p>
      ) : null}
      <p className="m-0 text-[13px] text-suave">A brincadeira e o texto são nossos. As fontes inspiraram a ideia e não revisaram o site.</p>
      {SITE.contato ? (
        <p className="m-0 text-sm">
          <a href={`mailto:${SITE.contato}?subject=${assunto}`}>Relatar um problema nesta brincadeira</a>
        </p>
      ) : null}
    </section>
  );
}
