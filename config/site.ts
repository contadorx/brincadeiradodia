/**
 * Configurações do site. É o único arquivo que você precisa editar para
 * publicar: responsável, contato, PIX, métricas e apoio.
 */
export const SITE = {
  nome: "Brincadeira do Dia",
  url: "https://brincadeiradodia.com.br",
  descricao:
    "Uma brincadeira por dia, de uns 10 minutos, com o que você tem em casa. Para pais e cuidadores, sem tela para a criança.",

  /**
   * Responsável pelo site (controlador dos dados, pela LGPD).
   * Aparece nos Termos de Uso e na Política de Privacidade. OBRIGATÓRIO antes de publicar.
   */
  responsavel: "Leandro Batista de Oliveira",

  /**
   * E-mail de contato: é o canal para dúvidas, sugestões e pedidos sobre dados pessoais.
   * OBRIGATÓRIO antes de publicar (a LGPD exige um canal de atendimento).
   */
  contato: "leandropucsp@gmail.com",

  /**
   * PIX para apoio voluntário.
   * Use uma CHAVE ALEATÓRIA, não o CPF: a chave fica pública no site e no QR code.
   * Enquanto `chave` estiver vazia, o bloco do PIX não aparece (o de compartilhar continua).
   */
  pix: {
    chave: "5f0cafc2-92c6-42dc-ad6a-6897f56e6af5",
    /** Nome do recebedor como está no banco, sem acento (até 25 letras; o nome completo não cabe). */
    nomeRecebedor: "LEANDRO B DE OLIVEIRA",
    /** Cidade do recebedor, sem acento (até 15 letras). */
    cidade: "MAUA",
  },

  /**
   * Cartão de apoio (compartilhar + PIX) depois de uma brincadeira registrada:
   * só aparece a partir do 10º registro e, no máximo, uma vez a cada 30 dias.
   */
  apoio: { aPartirDeRegistros: 10, intervaloDias: 30 },

  /**
   * Revisão voluntária. As brincadeiras vão ao ar com as fontes; a revisão de uma profissional
   * é um selo que chega depois ("Revisada por [nome], [profissão], em [mês/ano]").
   * Se `convidar` for true e `contato` estiver preenchido, a página Sobre convida
   * profissionais a doar uma revisão.
   */
  revisao: { convidar: true },

  /** O que o apoio ajuda a pagar (sem valores). Aparece na página Sobre. */
  apoioCobre: [
    "Domínio do site",
    "Servidores e hospedagem",
    "Pesquisa e revisão de novas brincadeiras",
    "Evolução do aplicativo",
  ],

  /**
   * Onde ficam os servidores (para a Política de Privacidade).
   * Ajuste se mudar de provedor ou de região.
   */
  provedores: {
    hospedagem: "Vercel (Estados Unidos)",
    metricas: "servidor próprio contratado na Contabo (Alemanha)",
  },

  /**
   * Métricas anônimas com Umami (sem cookies). Preencha depois de subir o
   * Umami no VPS (veja docs/metricas.md). Vazio = nenhum script é carregado.
   */
  umami: {
    scriptUrl: "",
    websiteId: "",
    /** Endereços contados, separados por vírgula (o Umami compara o endereço exato: com e sem www). */
    dominio: "brincadeiradodia.com.br,www.brincadeiradodia.com.br",
  },
} as const;

/**
 * Versão dos Termos de Uso e da Política de Privacidade.
 * Mudou o texto de forma relevante? Troque a data: na próxima visita, cada família
 * vê os termos de novo e precisa aceitar outra vez.
 */
export const VERSAO_TERMOS = "2026-10-04";
export const DATA_TERMOS = "4 de outubro de 2026";
