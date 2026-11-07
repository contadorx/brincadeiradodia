import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { Clausula, PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o Brincadeira do Dia trata dados pessoais, de acordo com a LGPD: sem cadastro, diário só no aparelho e métricas anônimas.",
};

export default function Pagina() {
  const responsavel = SITE.responsavel || "o responsável pelo site";
  const contato = SITE.contato ? <span className="font-bold select-all">{SITE.contato}</span> : "o e-mail indicado na página Sobre";

  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      resumo={
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          <li>Não tem cadastro, login, cookies nem anúncios.</li>
          <li>A idade, o apelido e o diário da criança ficam só no seu aparelho. Nós não temos acesso a eles.</li>
          <li>Contamos visitas e uso das brincadeiras de forma anônima, para saber se o site está ajudando.</li>
          <li>Você pode apagar tudo a qualquer momento, pelo botão na página Sobre.</li>
        </ul>
      }
    >
      <Clausula n="1" titulo="Quem é o controlador e como falar com ele">
        <p>
          O controlador dos dados pessoais tratados pelo Brincadeira do Dia é {responsavel}, pessoa física. O canal para qualquer assunto sobre
          privacidade e dados pessoais é {contato}.
        </p>
        <p>
          Por ser agente de tratamento de pequeno porte (Resolução CD/ANPD nº 2/2022) e não realizar tratamento de alto risco, o site não indica
          encarregado (DPO). Os pedidos são atendidos pelo canal acima.
        </p>
      </Clausula>

      <Clausula n="2" titulo="O que fica só no seu aparelho">
        <p>
          Para funcionar sem cadastro, o site guarda no armazenamento do seu navegador (IndexedDB), no próprio aparelho: a faixa de idade, o apelido
          (se você informar), as brincadeiras registradas no diário com a reação e as anotações, e preferências como o nível escolhido.
        </p>
        <p>
          Essas informações não são enviadas para nenhum servidor e nós não temos acesso a elas. Elas saem do aparelho somente se você usar a opção
          Exportar do diário, e nesse caso o arquivo fica com você.
        </p>
        <p>
          Recomendamos usar um apelido, e não o nome completo da criança, e não escrever nas anotações informações de saúde ou que identifiquem a
          família. Para apagar tudo, use o botão Apagar meus dados deste aparelho, na <Link href="/sobre/">página Sobre</Link>, ou limpe os dados do
          site nas configurações do navegador.
        </p>
      </Clausula>

      <Clausula n="3" titulo="Dados que nós tratamos">
        <p>
          <strong>Métricas de uso anônimas.</strong> Usamos uma ferramenta de estatística instalada em servidor próprio (Umami), sem cookies. Ela
          registra páginas visitadas, ações como &quot;brincadeira começada&quot; ou &quot;terminada&quot;, tipo de aparelho e navegador e região
          aproximada. Pela configuração da ferramenta, o endereço IP é usado apenas no momento da visita, para estimar a região e gerar uma identificação
          temporária da sessão, e não é guardado. Nunca enviamos apelido, anotações ou qualquer dado da criança. Finalidade: entender se o site ajuda e
          melhorar as brincadeiras. Base legal: legítimo interesse (art. 7º, IX, da LGPD). Guardamos as estatísticas, de forma agregada, por até 24
          meses.
        </p>
        <p>
          <strong>Registros técnicos da hospedagem.</strong> O provedor que hospeda o site registra dados técnicos de acesso, como IP, data e hora,
          para segurança e funcionamento do serviço. Base legal: legítimo interesse e cumprimento de obrigação legal (art. 7º, II e IX).
        </p>
        <p>
          <strong>Apoio por PIX.</strong> Quando você faz um PIX, os bancos envolvidos tratam seus dados. No extrato, recebemos o nome de quem enviou e
          parte do CPF, como em qualquer PIX. Usamos essas informações apenas para controle financeiro e para cumprir obrigações legais e fiscais, pelo
          prazo que a lei exigir. Não usamos para contato nem para divulgação. Base legal: cumprimento de obrigação legal e exercício regular de
          direitos (art. 7º, II e VI).
        </p>
        <p>
          <strong>Contato por e-mail.</strong> Se você nos escrever, usamos seu e-mail e sua mensagem apenas para responder. Apagamos a conversa
          quando ela deixar de ser necessária, em até 12 meses. Base legal: legítimo interesse (art. 7º, IX).
        </p>
      </Clausula>

      <Clausula n="4" titulo="Dados de crianças">
        <p>
          O site é destinado a adultos. Não coletamos dados de crianças nos nossos servidores. As informações que você registra sobre a criança ficam
          apenas no seu aparelho, como explicado no item 2.
        </p>
      </Clausula>

      <Clausula n="5" titulo="Com quem os dados são compartilhados">
        <p>
          Não vendemos nem compartilhamos dados para publicidade. Os dados do item 3 passam pelos provedores que operam o serviço para nós: hospedagem
          do site em {SITE.provedores.hospedagem} e estatísticas em {SITE.provedores.metricas}. Por isso pode haver transferência internacional de
          dados, feita com provedores que assumem compromissos contratuais de proteção de dados. No caso do PIX, os dados circulam pelo sistema
          bancário.
        </p>
      </Clausula>

      <Clausula n="6" titulo="Cookies e armazenamento no navegador">
        <p>
          Não usamos cookies. O site usa o armazenamento do navegador apenas para as informações do item 2 e para guardar uma cópia das páginas, o que
          permite abrir o site sem internet.
        </p>
      </Clausula>

      <Clausula n="7" titulo="Segurança">
        <p>
          O site funciona com conexão segura (HTTPS) e, por não ter cadastro, não guarda senhas. Como o diário fica no seu aparelho, a proteção dele
          depende também do bloqueio de tela e dos cuidados com o aparelho.
        </p>
      </Clausula>

      <Clausula n="8" titulo="Seus direitos">
        <p>Pela LGPD (art. 18), você pode pedir, pelo canal do item 1:</p>
        <ul>
          <li>confirmação de que tratamos dados seus e acesso a eles;</li>
          <li>correção de dados incompletos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;</li>
          <li>portabilidade, informação sobre com quem compartilhamos e eliminação dos dados, quando cabível;</li>
          <li>revisão de qualquer tratamento baseado em consentimento e oposição a tratamentos baseados em legítimo interesse.</li>
        </ul>
        <p>
          Respondemos em até 15 dias. Lembre que não temos acesso aos dados guardados no seu aparelho: esses você mesmo pode ver, exportar e apagar a
          qualquer momento. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), em gov.br/anpd.
        </p>
      </Clausula>

      <Clausula n="9" titulo="Mudanças nesta Política">
        <p>
          Podemos atualizar esta Política. A data e a versão ficam no topo da página. Quando a mudança for relevante, o site pede um novo aceite na
          próxima vez que você abrir.
        </p>
      </Clausula>
    </PaginaLegal>
  );
}
