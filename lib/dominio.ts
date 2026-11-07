/**
 * Constantes e tipos do conteúdo que o navegador usa: áreas, faixas, etiquetas, lugares, avisos.
 * Este arquivo não importa o zod, para o validador ficar só no build e não pesar no celular.
 * O esquema que valida cada brincadeira está em lib/esquema.ts (só no build).
 */

/** Áreas do desenvolvimento. A ordem é a dos dias da semana (0 = domingo). */
export const AREAS = [
  "explorar",
  "linguagem",
  "autocontrole",
  "raciocinio",
  "corpo",
  "fazdeconta",
  "musica",
] as const;

export const NOME_AREA: Record<(typeof AREAS)[number], string> = {
  explorar: "Explorar",
  linguagem: "Linguagem",
  autocontrole: "Atenção e autocontrole",
  raciocinio: "Raciocínio e números",
  corpo: "Corpo e coordenação",
  fazdeconta: "Faz de conta",
  musica: "Música e cozinha",
};

/** Faixas de idade oferecidas na escolha inicial. */
export const FAIXAS = ["1-2", "2-3", "3-4", "4-5", "5-6"] as const;
export const NOME_FAIXA: Record<(typeof FAIXAS)[number], string> = {
  "1-2": "1 a 2 anos",
  "2-3": "2 a 3 anos",
  "3-4": "3 a 4 anos",
  "4-5": "4 a 5 anos",
  "5-6": "5 a 6 anos",
};

/**
 * Cuidado extra que aparece sozinho em toda ficha da faixa 1 a 2 anos, além do aviso da brincadeira.
 * Nesta idade tudo vai à boca, o equilíbrio ainda falha e a criança não avisa o perigo.
 */
export const AVISO_1_2 =
  "De 1 a 2 anos, tudo vai à boca: só objetos maiores que um rolo de papel higiênico, inteiros e limpos, conferidos antes e depois. Brincadeira no chão, sem subir em nada.";

/** Materiais que aparecem no filtro "O que você tem em casa?". */
export const ETIQUETAS = [
  "papel",
  "brinquedos",
  "fita",
  "massinha",
  "agua",
  "livro",
  "cozinha",
] as const;
export const NOME_ETIQUETA: Record<(typeof ETIQUETAS)[number], string> = {
  papel: "Papel e caneta",
  brinquedos: "Brinquedos",
  fita: "Fita crepe",
  massinha: "Massinha",
  agua: "Bacia com água",
  livro: "Um livro",
  cozinha: "Frutas e pão",
};

export const LUGARES = ["casa", "rua", "banho", "carro"] as const;
export const NOME_LUGAR: Record<(typeof LUGARES)[number], string> = {
  casa: "Em casa",
  rua: "Na rua",
  banho: "No banho",
  carro: "No carro",
};

/**
 * Origem da ideia (veja o Plano de Conteúdo). Não é nota de eficácia: diz de onde a
 * ideia veio. A ficha é sempre uma versão nossa, e a `base` explica a diferença.
 * A = inspirada em atividade estudada com crianças (diga população, contexto e o que mudou);
 * B = inspirada em sugestão de atividade de uma instituição (dica, não marco do desenvolvimento);
 * C = brincadeira tradicional brasileira ou variação dela;
 * D = só há um objetivo da BNCC relacionado (currículo, não recomendação da atividade).
 */
export const EVIDENCIAS = ["A", "B", "C", "D"] as const;
export const NOME_EVIDENCIA: Record<(typeof EVIDENCIAS)[number], string> = {
  A: "Inspirada em atividade estudada com crianças",
  B: "Inspirada em sugestão de instituição de referência",
  C: "Inspirada em brincadeira tradicional brasileira",
  D: "Relacionada a objetivo da BNCC, o currículo da educação infantil",
};

/**
 * Brincadeiras que mudaram de id. O diário guarda o id antigo; aqui ele aponta para o novo.
 * Os endereços antigos são redirecionados em vercel.json.
 */
export const IDS_ANTIGOS: Record<string, string> = {
  "chocalho-de-pote": "tambor-de-pote",
};

/** rascunho = não aparece no site publicado; publicada = aparece. */
export const STATUS = ["rascunho", "publicada"] as const;

export type Area = (typeof AREAS)[number];
export type Faixa = (typeof FAIXAS)[number];
export type Etiqueta = (typeof ETIQUETAS)[number];
export type Lugar = (typeof LUGARES)[number];
export type Evidencia = (typeof EVIDENCIAS)[number];
export type Status = (typeof STATUS)[number];

/**
 * O pedaço de cada brincadeira que Hoje e Explorar usam (cartão do dia, lista e filtros).
 * Passos, conversa, fontes e o resto ficam na ficha, que carrega só a dela.
 */
export type Resumo = {
  id: string;
  nome: string;
  area: Area;
  ordem: number;
  faixas: Faixa[];
  minutos: number;
  lugares: Lugar[];
  serve: string;
  materiais: string[];
  etiquetas: Etiqueta[];
  status: Status;
};
