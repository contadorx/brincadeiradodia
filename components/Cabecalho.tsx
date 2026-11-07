import Link from "next/link";
import { Marca } from "./Marca";

type Aba = "hoje" | "explorar" | "diario" | "sobre";

const ABAS: { id: Aba; href: string; nome: string }[] = [
  { id: "hoje", href: "/", nome: "Hoje" },
  { id: "explorar", href: "/explorar/", nome: "Explorar" },
  { id: "diario", href: "/diario/", nome: "Diário" },
  { id: "sobre", href: "/sobre/", nome: "Sobre e apoio" },
];

/** Barra superior do computador e tablet. No celular quem navega é a barra inferior. */
export function Cabecalho({ atual, children }: { atual?: Aba; children?: React.ReactNode }) {
  return (
    <header className="nao-imprimir hidden border-b border-linha bg-white md:block">
      <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center gap-8 px-8">
        <Marca />
        <nav aria-label="Navegação principal" className="flex items-center gap-1">
          {ABAS.map((a) => {
            const ativa = a.id === atual;
            return (
              <Link
                key={a.id}
                href={a.href}
                aria-current={ativa ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[15px] font-bold no-underline transition-colors ${
                  ativa ? "bg-azul-claro text-azul" : "text-suave hover:bg-painel hover:text-tinta"
                }`}
              >
                {a.nome}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}

/** Contêiner padrão: coluna estreita no celular, larga no computador. */
export const CONTEUDO = "mx-auto w-full max-w-md px-5 md:max-w-5xl md:px-8";
