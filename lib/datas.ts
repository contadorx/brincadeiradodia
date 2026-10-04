export const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
export const MESES_CURTOS = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

export const meiaNoite = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const pad = (n: number) => String(n).padStart(2, "0");

/** Data local no formato AAAA-MM-DD. */
export const chaveDia = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function deChave(k: string): Date {
  const [a, m, d] = k.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export const somaDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const difDias = (a: Date, b: Date) => Math.round((meiaNoite(a).getTime() - meiaNoite(b).getTime()) / 86400000);

export const dataExtensa = (d: Date) => `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
export const dataCurta = (d: Date) => `${DIAS_CURTOS[d.getDay()]}, ${d.getDate()} de ${MESES_CURTOS[d.getMonth()]}`;
