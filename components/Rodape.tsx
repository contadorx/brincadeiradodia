import Link from "next/link";

export function Rodape() {
  return (
    <footer className="nao-imprimir mt-4 flex flex-col items-center gap-2 border-t border-linha pt-5 text-center text-sm text-suave">
      <nav aria-label="Informações legais" className="flex flex-wrap justify-center gap-x-5 gap-y-1">
        <Link href="/sobre/" className="text-suave hover:text-tinta">
          Sobre e apoio
        </Link>
        <Link href="/termos/" className="text-suave hover:text-tinta">
          Termos de Uso
        </Link>
        <Link href="/privacidade/" className="text-suave hover:text-tinta">
          Política de Privacidade
        </Link>
      </nav>
      <p className="m-0">Brincadeiras para fazer sempre com um adulto acompanhando. Não substitui a orientação do pediatra.</p>
    </footer>
  );
}
