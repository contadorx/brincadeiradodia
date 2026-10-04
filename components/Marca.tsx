import Link from "next/link";

export function Selo({ tamanho = 34 }: { tamanho?: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center rounded-full bg-sol font-display font-extrabold text-tinta"
      style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho * 0.41) }}
    >
      10
    </span>
  );
}

export function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline">
      <Selo />
      <span className="whitespace-nowrap font-display text-[18px] font-extrabold tracking-tight">Brincadeira do Dia</span>
    </Link>
  );
}
