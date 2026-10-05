import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { SITE } from "@/config/site";
import { codigoPix } from "@/lib/apoio";
import { revisoras } from "@/lib/conteudo";
import { CartaoApoio } from "@/components/CartaoApoio";
import { ApagarDados } from "@/components/ApagarDados";
import { NavInferior } from "@/components/NavInferior";
import { Check, Voltar } from "@/components/Icones";
import { Rodape } from "@/components/Rodape";
import { Cabecalho, CONTEUDO } from "@/components/Cabecalho";

export const metadata: Metadata = {
  title: "Sobre e apoio",
  description: "Como o Brincadeira do Dia funciona, de onde vêm as brincadeiras, privacidade e como apoiar.",
};

function Secao({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="flex scroll-mt-4 flex-col gap-2">
      <h2 id={`${id}-t`} className="m-0 font-display text-[21px] font-extrabold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export default async function Pagina() {
  const equipe = revisoras();
  const convite = SITE.revisao.convidar && !!SITE.contato;
  const pix = codigoPix();
  const qr = pix
    ? await QRCode.toString(pix, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#1C2333", light: "#FFFFFF" } })
    : null;

  return (
    <>
      <Cabecalho atual="sobre" />
      <main className={`pb-nav flex flex-col gap-7 pt-3.5 md:pt-8 ${CONTEUDO}`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-1 self-start font-bold text-tinta no-underline md:hidden">
          <Voltar tamanho={22} />
          Hoje
        </Link>
        <h1 className="m-0 -mt-3 font-display text-[30px] font-extrabold tracking-tight md:mt-0 md:text-[40px]">Sobre o Brincadeira do Dia</h1>
        <div className="flex flex-col gap-7 md:grid md:grid-cols-12 md:items-start md:gap-12">
        <div className="flex max-w-[65ch] flex-col gap-7 md:col-span-7">

        <Secao id="o-que-e" titulo="O que é">
          <p className="m-0">
            Uma brincadeira por dia, de 5 a 15 minutos (uns 10, em geral), para pais e cuidadores fazerem com a criança usando o que já têm em casa.
            O site é para os adultos. A criança brinca com vocês, longe da tela. O tempo é só uma estimativa: parem quando a criança quiser.
          </p>
          <p className="m-0">
            Cada dia da semana trabalha uma área: domingo é explorar, segunda é linguagem, terça é atenção e autocontrole, quarta é raciocínio e números,
            quinta é corpo e coordenação, sexta é faz de conta e sábado é música e cozinha. As brincadeiras de cada área se revezam de semana em
            semana. Quando uma delas volta, vem igual: vocês escolhem a versão mais fácil, a original ou a mais difícil, conforme o interesse da
            criança. Repetir do mesmo jeito também vale.
          </p>
          <p className="m-0">
            A brincadeira do dia é só uma sugestão. Dá para repetir a favorita ou escolher outra em <Link href="/explorar/">Explorar</Link>.
          </p>
        </Secao>

        <Secao id="base" titulo="Como escolhemos as brincadeiras">
          <p className="m-0">
            Cada brincadeira parte de uma fonte publicada e é escrita por nós, com texto próprio. Na página de cada uma, em &quot;De onde veio a
            ideia&quot;, mostramos a fonte e o tipo de origem. A origem diz de onde a ideia veio; não é nota de eficácia:
          </p>
          <ul className="m-0 flex flex-col gap-1.5 pl-5">
            <li>
              <strong>Inspirada em atividade estudada com crianças:</strong> a ideia vem de um jogo ou método usado em pesquisa. A ficha diz quem
              participou do estudo e o que muda na nossa versão. O estudo não testou a ficha do site.
            </li>
            <li>
              <strong>Inspirada em sugestão de instituição de referência:</strong> a atividade aparece nas dicas para a idade de instituições como o
              CDC, o Harvard Center on the Developing Child ou o Ministério da Saúde. Os marcos do desenvolvimento (o que a maioria das crianças faz
              numa idade) servem só de contexto, nunca de exigência.
            </li>
            <li>
              <strong>Inspirada em brincadeira tradicional brasileira:</strong> a brincadeira está no guia de culturas populares para a primeira
              infância do Ministério da Cidadania. Quando a ficha é uma variação, ela avisa.
            </li>
            <li>
              <strong>Relacionada a objetivo da BNCC:</strong> a ideia é nossa e se liga a um objetivo do currículo da educação infantil. A BNCC
              não recomenda nem avaliou a brincadeira.
            </li>
          </ul>
          <p className="m-0">
            Toda brincadeira passa por um checklist de segurança e só entra no site com a fonte indicada. Depois de publicada, ela pode ganhar a
            revisão de uma profissional voluntária; as que envolvem água, comida, faca ou plantas são as primeiras da fila. As revisadas mostram quem
            revisou e quando. As outras avisam que ainda não passaram por revisão profissional.
          </p>
          <p className="m-0">Nenhuma das instituições ou pesquisas citadas testou, revisou ou aprovou o site. As principais fontes:</p>
          <ul className="m-0 flex flex-col gap-1.5 pl-5">
            <li>
              Harvard Center on the Developing Child: atividades de funções executivas para{" "}
              <a href="https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-18-to-36-month-olds.pdf" target="_blank" rel="noopener">
                18 a 36 meses
              </a>
              ,{" "}
              <a href="https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf" target="_blank" rel="noopener">
                3 a 5 anos
              </a>{" "}
              e{" "}
              <a href="https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf" target="_blank" rel="noopener">
                5 a 7 anos
              </a>
            </li>
            <li>
              CDC: dicas de atividades nas páginas de marcos do desenvolvimento aos{" "}
              <a href="https://www.cdc.gov/act-early/milestones/2-years.html" target="_blank" rel="noopener">
                2
              </a>
              ,{" "}
              <a href="https://www.cdc.gov/act-early/milestones/3-years.html" target="_blank" rel="noopener">
                3
              </a>
              ,{" "}
              <a href="https://www.cdc.gov/act-early/milestones/4-years.html" target="_blank" rel="noopener">
                4
              </a>{" "}
              e{" "}
              <a href="https://www.cdc.gov/act-early/milestones/5-years.html" target="_blank" rel="noopener">
                5 anos
              </a>
            </li>
            <li>
              <a href="https://www.blueprintsprograms.org/programs/1500999999/red-light-purple-light-a-self-regulation-intervention/" target="_blank" rel="noopener">
                Red Light, Purple Light: jogos de autocontrole estudados em turmas de pré-escola de 3 a 5 anos
              </a>
            </li>
            <li>
              Leitura compartilhada:{" "}
              <a href="https://doi.org/10.1542/peds.2017-0723" target="_blank" rel="noopener">
                estudo em creches de Boa Vista (Weisleder e outros, 2018)
              </a>{" "}
              e{" "}
              <a href="https://doi.org/10.1111/cdev.13225" target="_blank" rel="noopener">
                revisão de 19 estudos (Dowdall e outros, 2020)
              </a>
            </li>
            <li>
              <a href="https://doi.org/10.1111/j.1467-8624.2007.01131.x" target="_blank" rel="noopener">
                Jogos de tabuleiro com números para pré-escolares (Ramani e Siegler, 2008)
              </a>
            </li>
            <li>
              <a href="https://bvsms.saude.gov.br/bvs/publicacoes/guia_atividade_fisica_populacao_brasileira.pdf" target="_blank" rel="noopener">
                Ministério da Saúde: Guia de Atividade Física para a População Brasileira (2021)
              </a>
            </li>
            <li>
              <a href="https://www.sbp.com.br/fileadmin/user_upload/manual_orientacao_sbp_cen_.pdf" target="_blank" rel="noopener">
                Sociedade Brasileira de Pediatria e Instituto Alana: benefícios da natureza no desenvolvimento (2019)
              </a>
            </li>
            <li>
              <a href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/early-maths" target="_blank" rel="noopener">
                Education Endowment Foundation: matemática na educação infantil (2020)
              </a>
            </li>
            <li>
              <a href="https://movimentopelabase.org.br/wp-content/uploads/2021/11/jogos-brincadeiras-culturas-populares-primeira-infancia.pdf" target="_blank" rel="noopener">
                Ministério da Cidadania: Jogos e brincadeiras das culturas populares na Primeira Infância
              </a>
            </li>
            <li>
              <a href="https://basenacionalcomum.mec.gov.br/" target="_blank" rel="noopener">
                BNCC: objetivos da educação infantil (MEC)
              </a>
              , citados em cada ficha pelo código
            </li>
            <li>
              <a href="https://idec.org.br/dicas-e-direitos/uso-de-telas-na-infancia-11-recomendacoes" target="_blank" rel="noopener">
                Sociedade Brasileira de Pediatria (via Idec): até 1 hora de tela por dia dos 2 aos 5 anos, com um adulto junto
              </a>
            </li>
          </ul>
        </Secao>

        {equipe.length || convite ? (
          <Secao id="revisao" titulo="Revisões voluntárias">
            {equipe.length ? (
              <>
                <p className="m-0">Obrigado a quem doou revisão para o Brincadeira do Dia:</p>
                <ul className="m-0 flex flex-col gap-1 pl-5">
                  {equipe.map((r) => (
                    <li key={`${r.nome}-${r.profissao}`}>
                      <strong>{r.nome}</strong>, {r.profissao.toLowerCase()} ({r.quantas} {r.quantas === 1 ? "brincadeira" : "brincadeiras"})
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {convite ? (
              <p className="m-0">
                É profissional de psicologia, psicopedagogia, terapia ocupacional, fonoaudiologia ou pediatria? Doe uma revisão: você confere uma ou
                mais brincadeiras e, se autorizar, seu nome aparece na ficha e nesta página. Começamos pelas que envolvem água, comida, faca e
                plantas. Escreva para{" "}
                <span className="font-bold select-all">{SITE.contato}</span>.
              </p>
            ) : null}
          </Secao>
        ) : null}

        <Secao id="seguranca" titulo="Segurança">
          <p className="m-0">
            <strong>Toda brincadeira é para fazer com um adulto acompanhando do começo ao fim.</strong> A criança não deve brincar sozinha com os
            materiais sugeridos, nem usar o site sozinha.
          </p>
          <p className="m-0">
            Antes de começar, leia todos os passos e o aviso de segurança da brincadeira e olhe o lugar: peças pequenas, água, comida, objetos
            cortantes, quinas e piso escorregadio. Adapte ou deixe para outro dia se a criança tiver alguma restrição de saúde, alergia ou não estiver
            bem.
          </p>
          <p className="m-0">Regras que valem para todas as fichas:</p>
          <ul className="m-0 flex flex-col gap-1.5 pl-5">
            <li>
              <strong>Água:</strong> o adulto fica ao alcance dos braços o tempo todo, sem olhar o celular. Pouca água também afoga. Esvazie tudo
              no fim.
            </li>
            <li>
              <strong>Comida:</strong> só alimentos que a criança já come e tolera, numa textura que ela consegue mastigar, respeitando alergias e
              restrições. Ela come sentada, com um adulto junto, sem correr nem brincar com a boca cheia. Uva e tomate-cereja vão cortados em
              quatro, no comprimento.
            </li>
            <li>
              <strong>Peças pequenas:</strong> usamos um teste caseiro, o do rolo de papel higiênico: o objeto inteiro não pode passar por dentro
              dele. É uma triagem, não uma certificação. Evite também o que esfarela, solta pedaços ou pode ser apertado até caber na boca, e
              confira se tudo continua inteiro no fim.
            </li>
            <li>
              <strong>Carro:</strong> só brincadeiras de voz. A criança fica na cadeirinha, com o cinto, e o motorista participa só com a voz, sem
              olhar para trás nem fazer gestos.
            </li>
            <li>
              <strong>Toque e perseguição:</strong> abraço, cócegas e pega-pega só se a criança quiser. Parem quando ela disser não ou se afastar.
            </li>
            <li>
              <strong>Som:</strong> volume confortável, longe dos ouvidos. Ninguém precisa gritar nem bater forte.
            </li>
          </ul>
          <p className="m-0">
            O site não substitui a orientação do pediatra. Se alguma coisa no desenvolvimento da criança preocupar vocês, converse com ele. A Caderneta da
            Criança traz os marcos esperados para cada idade.
          </p>
        </Secao>

        <Secao id="privacidade" titulo="Privacidade">
          <p className="m-0">
            Não tem cadastro. A idade, o apelido e o diário ficam guardados só neste aparelho e não são enviados para lugar nenhum.
          </p>
          <p className="m-0">
            Para saber se o site está ajudando, contamos de forma anônima quantas vezes as páginas são abertas e quantas brincadeiras são começadas e
            terminadas. Não usamos cookies, não guardamos nomes nem anotações e não há anúncios.{" "}
            <Link href="/privacidade/">Leia a Política de Privacidade</Link>.
          </p>
          <ApagarDados />
        </Secao>

        {SITE.contato ? (
          <Secao id="contato" titulo="Contato">
            <p className="m-0">
              Sugestões de brincadeiras e correções: <span className="font-bold select-all">{SITE.contato}</span>
            </p>
          </Secao>
        ) : null}

        <div className="flex flex-col gap-1">
          <Link href="/criancas/" className="font-bold">
            Crianças: trocar, editar ou adicionar
          </Link>
          <Link href="/instalar/" className="font-bold">
            Como instalar o app e criar um lembrete
          </Link>
        </div>
        </div>

        <div id="apoio" className="flex scroll-mt-4 flex-col gap-4 md:sticky md:top-6 md:col-span-5">
          <CartaoApoio pix={pix} url={SITE.url} modo="secao" />
          {qr ? (
            <div className="flex flex-col items-center gap-2 rounded-3xl border border-linha p-5">
              <div className="w-56 max-w-full" dangerouslySetInnerHTML={{ __html: qr }} role="img" aria-label="QR code do PIX para apoiar o site" />
              <p className="m-0 text-center text-sm text-suave">Aponte a câmera do app do banco. Você escolhe o valor.</p>
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-display text-[19px] font-extrabold">O que o apoio ajuda a pagar</h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {SITE.apoioCobre.map((item) => (
                <li key={item} className="flex items-center gap-3 border-t border-linha py-2.5">
                  <Check tamanho={18} className="shrink-0 text-folha" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="m-0 text-sm text-suave">O apoio é voluntário e não muda nada no uso do site: tudo continua gratuito para todas as famílias.</p>
          </div>
        </div>
        </div>
        <Rodape />
      </main>
      <NavInferior />
    </>
  );
}
