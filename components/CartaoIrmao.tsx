import { SITE } from "@/config/site";
import { Avancar } from "./Icones";

/**
 * Ponte para o site irmão de jogos (7 a 12 anos). Aparece no Hoje, no Explorar e no Sobre, e só
 * quando `irmao.url` está preenchida em config/site.ts. `compacto`: uma linha, para o fim do Hoje.
 */
export function CartaoIrmao({ compacto = false }: { compacto?: boolean }) {
  if (!SITE.irmao.url) return null;
  if (compacto) {
    return (
      <a
        href={SITE.irmao.url}
        className="nao-imprimir flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-sol-claro px-4 py-3 font-bold text-tinta no-underline"
      >
        <span>
          Criança de 7 a 12 anos? Conheça o <span className="text-azul">{SITE.irmao.nome}</span>
        </span>
        <Avancar tamanho={20} className="shrink-0" />
      </a>
    );
  }
  return (
    <aside
      aria-label={`Site irmão: ${SITE.irmao.nome}`}
      className="nao-imprimir flex flex-col gap-2 rounded-2xl bg-sol-claro p-4 md:flex-row md:items-center md:gap-6 md:p-5"
    >
      <div className="flex flex-1 flex-col gap-1">
        <p className="m-0 font-display text-[18px] font-extrabold">Tem criança de 7 a 12 anos em casa?</p>
        <p className="m-0 text-[15px]">
          O {SITE.irmao.nome} é o nosso site irmão: jogos clássicos de raciocínio para jogar junto, frente a frente ou cada um na sua casa.
        </p>
      </div>
      <a
        href={SITE.irmao.url}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-white px-4 font-bold text-tinta no-underline ring-1 ring-borda hover:ring-azul md:self-center"
      >
        Conhecer o {SITE.irmao.nome}
        <Avancar tamanho={18} />
      </a>
    </aside>
  );
}
