/**
 * Configurações do site. É o único arquivo que você precisa editar para
 * publicar: PIX, contato, métricas e custos.
 */
export const SITE = {
  nome: "Brincadeira do Dia",
  url: "https://brincadeiradodia.com.br",
  descricao:
    "Uma brincadeira por dia, de 10 minutos, com o que você tem em casa. Para pais e cuidadores, sem tela para a criança.",

  /** E-mail para contato que aparece na página Sobre. Deixe "" para esconder. */
  contato: "",

  /**
   * PIX para apoio voluntário.
   * Use uma CHAVE ALEATÓRIA, não o CPF: a chave fica pública no site e no QR code.
   * Enquanto `chave` estiver vazia, o bloco do PIX não aparece (o de compartilhar continua).
   */
  pix: {
    chave: "",
    /** Nome do recebedor como está no banco, sem acento (até 25 letras). */
    nomeRecebedor: "",
    /** Cidade do recebedor, sem acento (até 15 letras). */
    cidade: "MAUA",
  },

  /**
   * Cartão de apoio (compartilhar + PIX) depois de uma brincadeira registrada:
   * só aparece a partir do 10º registro e, no máximo, uma vez a cada 30 dias.
   */
  apoio: { aPartirDeRegistros: 10, intervaloDias: 30 },

  /** Transparência: o que o apoio paga. Edite os valores reais. */
  custosAno: [
    { item: "Domínio brincadeiradodia.com.br", valor: "[VALOR/ANO]" },
    { item: "Hospedagem do site", valor: "R$ 0 (plano gratuito)" },
    { item: "Servidor das métricas (já existente)", valor: "[VALOR/ANO]" },
  ],

  /**
   * Métricas anônimas com Umami (sem cookies). Preencha depois de subir o
   * Umami no VPS (veja docs/metricas.md). Vazio = nenhum script é carregado.
   */
  umami: {
    scriptUrl: "",
    websiteId: "",
    dominio: "brincadeiradodia.com.br",
  },
} as const;
