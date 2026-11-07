import Link from "next/link";
import { Coracao, Livro, Lupa, Sol } from "./Icones";

type Aba = "hoje" | "explorar" | "diario" | "apoiar";

const ABAS: { id: Aba; href: string; nome: string; Icone: typeof Sol }[] = [
  { id: "hoje", href: "/", nome: "Hoje", Icone: Sol },
  { id: "explorar", href: "/explorar/", nome: "Explorar", Icone: Lupa },
  { id: "diario", href: "/diario/", nome: "Diário", Icone: Livro },
  { id: "apoiar", href: "/apoiar/", nome: "Apoiar", Icone: Coracao },
];

/** Barra inferior do celular. No computador a navegação fica no Cabecalho. */
export function NavInferior({ atual }: { atual?: Aba }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="nao-imprimir fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1.5 px-2 pb-3 pt-2">
        {ABAS.map(({ id, href, nome, Icone }) => {
          const ativa = id === atual;
          return (
            <Link
              key={id}
              href={href}
              aria-current={ativa ? "page" : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[13px] font-bold no-underline ${
                ativa ? "bg-azul-claro text-azul" : "text-suave"
              }`}
            >
              <Icone tamanho={24} />
              <span>{nome}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
