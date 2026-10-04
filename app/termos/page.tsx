import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { Clausula, PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Regras de uso do Brincadeira do Dia: supervisão de um adulto, segurança, limites de responsabilidade e apoio voluntário.",
};

export default function Pagina() {
  const responsavel = SITE.responsavel || "o responsável pelo site";
  if (!SITE.responsavel || !SITE.contato) {
    console.warn("\n[aviso] Preencha `responsavel` e `contato` em config/site.ts antes de publicar os Termos de Uso.\n");
  }
  const contato = SITE.contato ? <span className="font-bold select-all">{SITE.contato}</span> : "o e-mail indicado na página Sobre";

  return (
    <PaginaLegal
      titulo="Termos de Uso"
      resumo={
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          <li>O site é gratuito, para adultos, e dá sugestões de brincadeiras para fazer com a criança.</li>
          <li>
            <strong>Toda brincadeira é feita com um adulto acompanhando do começo ao fim.</strong> O adulto avalia o lugar, os materiais e se a
            criança está bem para brincar.
          </li>
          <li>O site não é serviço de saúde e não substitui pediatra, psicólogo, fonoaudiólogo ou terapeuta ocupacional.</li>
          <li>O apoio por PIX é voluntário e não dá direito a nenhuma contrapartida.</li>
        </ul>
      }
    >
      <Clausula n="1" titulo="Quem somos e o que é o site">
        <p>
          O Brincadeira do Dia ({SITE.url.replace("https://", "")}) é mantido por {responsavel}, pessoa física, sem fins comerciais. O site oferece, de
          graça, sugestões de brincadeiras curtas para pais, mães e cuidadores fazerem com crianças pequenas, com orientações de segurança e um diário
          que fica guardado só no aparelho de quem usa.
        </p>
        <p>Ao usar o site, você concorda com estes Termos e com a <Link href="/privacidade/">Política de Privacidade</Link>.</p>
      </Clausula>

      <Clausula n="2" titulo="Para quem é">
        <p>
          O site é feito para pessoas maiores de 18 anos responsáveis por crianças. A criança não deve usar o site sozinha: quem lê as orientações e
          conduz a brincadeira é sempre o adulto.
        </p>
      </Clausula>

      <Clausula n="3" titulo="Supervisão e segurança">
        <p>Ao fazer qualquer brincadeira sugerida, o adulto responsável se compromete a:</p>
        <ol>
          <li>acompanhar a criança o tempo todo, do começo ao fim, sem deixá-la sozinha com os materiais;</li>
          <li>ler o aviso de segurança de cada brincadeira antes de começar;</li>
          <li>
            conferir o lugar e os materiais: peças pequenas que caibam na boca, água (mesmo em pouca quantidade), alimentos, objetos cortantes, quinas,
            altura e piso escorregadio;
          </li>
          <li>
            adaptar a brincadeira, ou não fazê-la, se a criança tiver alergia, restrição alimentar, condição de saúde, necessidade específica, ou se não
            estiver bem naquele dia;
          </li>
          <li>interromper a brincadeira diante de qualquer sinal de desconforto, cansaço ou risco.</li>
        </ol>
        <p>
          As faixas de idade são indicativas. Cada criança tem seu ritmo, e o adulto é quem melhor conhece a criança para decidir o que é adequado.
        </p>
      </Clausula>

      <Clausula n="4" titulo="O que o site não é">
        <p>
          As brincadeiras são conteúdo educativo e de lazer, inspirado em material público sobre desenvolvimento infantil. O site não faz avaliação,
          diagnóstico, tratamento ou acompanhamento do desenvolvimento, e não garante nenhum resultado. Ele não substitui a orientação de pediatras e de
          outros profissionais de saúde ou educação. Se algo no desenvolvimento da criança preocupar você, procure o pediatra.
        </p>
        <p>
          As instituições citadas como fonte de inspiração não revisaram nem endossam o site.
        </p>
      </Clausula>

      <Clausula n="5" titulo="Responsabilidades">
        <p>
          Cuidamos para que as brincadeiras sejam adequadas à idade indicada e tenham avisos de segurança claros, e revisamos o conteúdo quando recebemos
          correções. Mesmo assim, as brincadeiras acontecem fora do nosso controle, no ambiente e com os materiais escolhidos por quem as conduz.
        </p>
        <p>
          Por isso, na extensão permitida pela lei, o responsável pelo site não responde por danos que decorram de: falta de supervisão de um adulto;
          descumprimento das orientações e dos avisos de segurança; uso de materiais inadequados ou em mau estado; condições do local; ou uso do conteúdo
          para finalidade diferente da prevista nestes Termos. Nada nestes Termos exclui direitos que a lei garante a você e que não possam ser
          afastados por contrato.
        </p>
        <p>
          O site pode ficar fora do ar, mudar ou deixar de existir sem aviso. Como o diário fica só no seu aparelho, faça a cópia (exportar) se não
          quiser perdê-lo ao trocar de aparelho ou limpar os dados do navegador.
        </p>
      </Clausula>

      <Clausula n="6" titulo="Apoio voluntário">
        <p>
          O site é e continuará gratuito. Quem quiser pode apoiar com um PIX de qualquer valor. O apoio é uma doação voluntária: não é compra, não dá
          acesso a nenhum recurso extra, não gera contrapartida e não é dedutível do imposto de renda. Os valores ajudam a pagar o domínio, os
          servidores, a pesquisa e a revisão de novas brincadeiras e a evolução do aplicativo.
        </p>
      </Clausula>

      <Clausula n="7" titulo="Conteúdo e direitos autorais">
        <p>
          Os textos das brincadeiras são próprios. Você pode usá-los em casa e compartilhar o link do site à vontade. Para reproduzir o conteúdo em outro
          lugar, peça autorização pelo contato abaixo. Links para sites de terceiros são oferecidos como referência; não respondemos pelo conteúdo deles.
        </p>
      </Clausula>

      <Clausula n="8" titulo="Mudanças nestes Termos">
        <p>
          Podemos atualizar estes Termos. A data e a versão ficam no topo desta página. Quando a mudança for relevante, o site pede um novo aceite na
          próxima vez que você abrir.
        </p>
      </Clausula>

      <Clausula n="9" titulo="Lei aplicável e contato">
        <p>
          Estes Termos seguem as leis do Brasil. Dúvidas, sugestões, correções de conteúdo ou relatos de qualquer problema com uma brincadeira: {contato}.
        </p>
      </Clausula>
    </PaginaLegal>
  );
}
