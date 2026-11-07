import { brincadeirasNoSite } from "./conteudo";

/**
 * Lotes de revisão voluntária (os mesmos de docs/revisoes.md). Começam pelo que tem mais risco
 * (água, comida, faca de mesa, plantas) e cobrem toda a faixa de 1 a 2 anos. Cada lote leva uns
 * 5 minutos por ficha.
 */
export type Lote = { id: string; tema: string; para: string; foco: string; ids: readonly string[] };

export const LOTES: readonly Lote[] = [
  {
    id: "A",
    tema: "Água",
    para: "Pediatria ou enfermagem pediátrica",
    foco: "afogamento, temperatura da água, chão molhado, sabão nos olhos",
    ids: ["brinquedos-no-banho", "passa-a-agua", "afunda-ou-boia", "banho-dos-brinquedos", "bolhas-de-sabao", "gelo-que-derrete", "o-que-dissolve"],
  },
  {
    id: "B",
    tema: "Comida e faca de mesa",
    para: "Pediatria, nutrição infantil ou fonoaudiologia (alimentação)",
    foco: "engasgo, alergias, textura para a idade, faca de mesa",
    ids: ["fruta-amassada", "amassa-e-mexe", "lanche-semaforo", "ajudante-de-cozinha", "salada-de-frutas", "sanduiche-pela-receita", "dividir-o-lanche", "iogurte-em-camadas"],
  },
  {
    id: "C",
    tema: "Plantas e passeios",
    para: "Pediatria, enfermagem ou educação infantil",
    foco: "plantas tóxicas, sementes e raízes, sol e bichos",
    ids: ["cada-chao-de-um-jeito", "passeio-de-olhar-e-ouvir", "arte-com-a-natureza", "feijao-no-algodao", "cebolinha-que-cresce"],
  },
  {
    id: "D",
    tema: "1 a 2 anos: exploração e movimento",
    para: "Terapia ocupacional ou fisioterapia pediátrica",
    foco: "peças pequenas, quedas, o que vai à boca",
    ids: ["cesto-de-panos", "bolhas-para-pegar", "torre-e-derruba", "potes-dentro-de-potes", "trilha-de-almofadas", "empurra-a-caixa", "joga-no-cesto", "paninho-de-limpar"],
  },
  {
    id: "E",
    tema: "1 a 2 anos: fala, livros e música",
    para: "Fonoaudiologia",
    foco: "peças pequenas, volume do som, linguagem para a idade",
    ids: ["siga-o-dedo-no-livro", "aponta-e-espera", "cade-o-nariz", "album-da-familia", "chapeu-copo-e-livro", "musicas-com-gestos", "batuque-de-panela", "dancar-juntos"],
  },
  {
    id: "F",
    tema: "1 a 2 anos: brincar junto e faz de conta",
    para: "Psicologia, psicopedagogia ou terapia ocupacional",
    foco: "pano no rosto, objetos que vão à boca, o que se pede da criança",
    ids: ["cade-achou", "rola-a-bola", "copia-o-gesto", "qual-voce-quer", "dentro-e-fora", "cada-um-na-sua-caixa", "comidinha-do-ursinho", "ursinho-vai-dormir"],
  },
  // G a I: as fichas novas de ordem 5 e 6 que têm mais risco e as de 1 a 2 anos.
  {
    id: "G",
    tema: "Água, comida e plantas (fichas novas)",
    para: "Pediatria, enfermagem pediátrica ou nutrição infantil",
    foco: "afogamento, mosquito em água parada, engasgo, alergias, plantas tóxicas, forno",
    ids: ["regador-de-garrafa", "pluviometro-de-garrafa", "barco-de-papel-aluminio", "rasga-a-alface", "gomos-de-mexerica", "espetinho-de-padrao", "pao-de-queijo-em-fileiras"],
  },
  {
    id: "H",
    tema: "1 a 2 anos: explorar e se mexer (fichas novas)",
    para: "Terapia ocupacional ou fisioterapia pediátrica",
    foco: "peças pequenas, quedas, o que vai à boca, primeiros passos",
    ids: ["abre-e-fecha", "tunel-da-bolinha", "embaixo-de-qual-pote", "cada-peca-no-seu-lugar", "vem-andando", "vou-te-pegar", "ajudante-da-mesa"],
  },
  {
    id: "I",
    tema: "1 a 2 anos: fala, música e faz de conta (fichas novas)",
    para: "Fonoaudiologia, psicologia ou educação infantil",
    foco: "balanço no colo, esconder-se, objetos à boca, linguagem para a idade",
    ids: ["levanta-a-aba", "que-bicho-e", "esconde-esconde-de-bebe", "conversa-com-o-bichinho", "passeio-do-carrinho", "roda-e-senta", "cavalinho-no-joelho"],
  },
];

export type FichaDoLote = { id: string; nome: string; revisada: boolean };
export type LoteComPlacar = Omit<Lote, "ids"> & { fichas: FichaDoLote[]; revisadas: number };

/** Placar das revisões, calculado no build: quantas estão revisadas no site e em cada lote. */
export function placarRevisao() {
  const todas = brincadeirasNoSite();
  const porId = new Map(todas.map((b) => [b.id, b]));
  const lotes: LoteComPlacar[] = LOTES.map(({ ids, ...lote }) => {
    const fichas = ids.flatMap((id) => {
      const b = porId.get(id);
      return b ? [{ id, nome: b.nome, revisada: !!b.revisao }] : [];
    });
    return { ...lote, fichas, revisadas: fichas.filter((f) => f.revisada).length };
  });
  const prioridade = lotes.reduce((n, l) => n + l.fichas.length, 0);
  return {
    total: todas.length,
    revisadas: todas.filter((b) => b.revisao).length,
    prioridade,
    prioridadeRevisadas: lotes.reduce((n, l) => n + l.revisadas, 0),
    lotes,
    nomes: Object.fromEntries(todas.map((b) => [b.id, b.nome])) as Record<string, string>,
  };
}
