import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { SITE } from "@/config/site";
import { codigoPix } from "@/lib/apoio";
import { CartaoApoio } from "@/components/CartaoApoio";
import { ApagarDados } from "@/components/ApagarDados";
import { NavInferior } from "@/components/NavInferior";
import { Voltar } from "@/components/Icones";
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
            Uma brincadeira por dia, de 10 a 15 minutos, para pais e cuidadores fazerem com a criança usando o que já têm em casa. O site é para os
            adultos. A criança brinca com vocês, longe da tela.
          </p>
          <p className="m-0">
            Cada dia da semana trabalha uma área: domingo é explorar, segunda é linguagem, terça é atenção e autocontrole, quarta é raciocínio e números,
            quinta é corpo e coordenação, sexta é faz de conta e sábado é música e cozinha. A partir da terceira semana, sugerimos a versão mais
            difícil das mesmas brincadeiras.
          </p>
        </Secao>

        <Secao id="base" titulo="De onde vêm as brincadeiras">
          <p className="m-0">
            As brincadeiras são escritas por nós, inspiradas em material público sobre desenvolvimento infantil. Nenhuma dessas instituições revisou ou
            endossa o site.
          </p>
          <ul className="m-0 flex flex-col gap-1.5 pl-5">
            <li>
              <a href="https://developingchild.harvard.edu/resources/handouts-tools/activities-guide-enhancing-and-practicing-executive-function-skills/" target="_blank" rel="noopener">
                Harvard Center on the Developing Child: guia de atividades de funções executivas
              </a>
            </li>
            <li>
              <a href="https://www.cdc.gov/act-early/milestones/3-years.html" target="_blank" rel="noopener">
                CDC: marcos do desenvolvimento aos 3 anos
              </a>
            </li>
            <li>
              <a href="https://idec.org.br/dicas-e-direitos/uso-de-telas-na-infancia-11-recomendacoes" target="_blank" rel="noopener">
                Sociedade Brasileira de Pediatria (via Idec): até 1 hora de tela por dia dos 2 aos 5 anos, com um adulto junto
              </a>
            </li>
          </ul>
        </Secao>

        <Secao id="seguranca" titulo="Segurança">
          <p className="m-0">
            Toda brincadeira é para fazer com um adulto do lado. Leia o aviso de segurança da ficha antes de começar, principalmente sobre peças pequenas,
            água e comida.
          </p>
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
            terminadas. Não usamos cookies, não guardamos nomes nem anotações e não há anúncios.
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

        <Link href="/instalar/" className="font-bold">
          Como instalar o app e criar um lembrete
        </Link>
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
            <h2 className="m-0 font-display text-[19px] font-extrabold">Para onde vai o apoio</h2>
            <dl className="m-0 flex flex-col">
              {SITE.custosAno.map((c) => (
                <div key={c.item} className="flex justify-between gap-4 border-t border-linha py-2">
                  <dt>{c.item}</dt>
                  <dd className="m-0 text-right font-bold tabular-nums">{c.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        </div>
      </main>
      <NavInferior />
    </>
  );
}
