import Link from "next/link";
import { MARCA_CABO, MARCA_CORPO, MARCA_PAS } from "@/lib/marca";

/**
 * A marca (um catavento). Decorativa: o nome do site vem sempre ao lado ou no título.
 * `girando`: segundos por volta; as pás giram (menos para quem pediu menos movimento no aparelho).
 */
export function Selo({ tamanho = 38, className, girando }: { tamanho?: number; className?: string; girando?: number }) {
  const desenho = girando
    ? `${MARCA_CABO}<g class="catavento-gira" style="animation-duration:${girando}s">${MARCA_PAS}</g>`
    : MARCA_CORPO;
  return (
    <svg
      viewBox="0 1.5 64 64"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: desenho }}
    />
  );
}

export function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2 text-tinta no-underline">
      <Selo />
      <span className="whitespace-nowrap font-display text-[18px] font-extrabold tracking-tight">Brincadeira do Dia</span>
    </Link>
  );
}
