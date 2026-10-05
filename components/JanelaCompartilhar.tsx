"use client";

import { useEffect, useId, useRef, useState } from "react";
import { evento } from "@/lib/metricas";
import {
  baixarBlob,
  copiar,
  linkEmail,
  linkFacebook,
  linkTelegram,
  linkWhatsApp,
  type ConteudoCompartilhar,
} from "@/lib/compartilhar";
import { Aviao, Baixar, Compartilhar, Elo, Envelope, Fechar, Imagem, Mensagem, Pessoas, Pontos, Qr, Voltar } from "./Icones";

export type OrigemCompartilhar = "ficha" | "apoio-cartao" | "apoio-secao";
type Vista = "canais" | "instagram" | "qr";
type Canal = "whatsapp" | "instagram" | "facebook" | "telegram" | "email" | "copiar" | "qrcode" | "mais" | "imagem" | "qr_baixado";
type ImagemPronta = { blob: Blob; previa: string; arquivo: File; enviavel: boolean };

const CORES_QR = { dark: "#1C2333", light: "#FFFFFF" };

async function carregarQr() {
  const m = await import("qrcode");
  return (m as unknown as { default?: typeof m }).default ?? m;
}

/**
 * Botão que abre a janela de compartilhar: WhatsApp, Instagram (imagem para story + link copiado),
 * Facebook, Telegram, e-mail, copiar link, QR code e, no celular, as outras opções do aparelho.
 * Só vai o link público da página: nada do diário nem do perfil da criança.
 */
export function BotaoCompartilhar({
  conteudo,
  origem,
  className,
  children,
}: {
  conteudo: ConteudoCompartilhar;
  origem: OrigemCompartilhar;
  className?: string;
  children: React.ReactNode;
}) {
  const janela = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const [aberta, setAberta] = useState(false);
  const [vista, setVista] = useState<Vista>("canais");
  const [url, setUrl] = useState("");
  const [nativo, setNativo] = useState(false);
  const [aviso, setAviso] = useState("");
  const [imagem, setImagem] = useState<ImagemPronta | null>(null);
  const [erroImagem, setErroImagem] = useState(false);
  const [qr, setQr] = useState("");

  useEffect(() => {
    setNativo(typeof navigator.share === "function");
  }, []);

  // O conteúdo só existe com a janela aberta (deixa as páginas mais leves); abre depois de desenhado,
  // para o foco cair no primeiro botão.
  // Navegadores muito antigos (iPhone antes do iOS 15.4) não têm <dialog>: a janela abre sem o fundo
  // escuro e fecha pelo X.
  useEffect(() => {
    const d = janela.current;
    if (!aberta || !d || d.open) return;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
  }, [aberta]);

  // Se a página mudar com a janela aberta, a rolagem não pode ficar travada.
  useEffect(() => () => document.documentElement.classList.remove("sem-rolagem"), []);

  // Libera a prévia da imagem quando o componente sai da tela.
  useEffect(() => () => {
    if (imagem) URL.revokeObjectURL(imagem.previa);
  }, [imagem]);

  const registrar = (canal: Canal) => evento("compartilhado", { canal, origem });
  // Nos links (WhatsApp, Facebook, Telegram) a janela fecha depois do clique: se o link sumisse da
  // página durante o clique, o navegador poderia não abrir o aplicativo.

  function abrir() {
    setUrl(new URL(conteudo.caminho, window.location.origin).href);
    setVista("canais");
    setAviso("");
    setAberta(true);
    document.documentElement.classList.add("sem-rolagem");
    evento("compartilhar_aberto", { origem });
  }

  function fechar() {
    const d = janela.current;
    if (!d) return;
    if (typeof d.close === "function") d.close();
    else {
      d.removeAttribute("open");
      aoFechar();
    }
  }

  function aoFechar() {
    setAberta(false);
    document.documentElement.classList.remove("sem-rolagem");
    setVista("canais");
    setAviso("");
  }

  function voltar() {
    setVista("canais");
    setAviso("");
  }

  async function copiarLink(canal: Canal = "copiar") {
    const ok = await copiar(url);
    setAviso(ok ? "Link copiado. É só colar onde quiser." : `Não deu para copiar. O endereço é ${url}`);
    if (ok && canal === "copiar") registrar("copiar");
    return ok;
  }

  async function irInstagram() {
    setVista("instagram");
    setAviso("");
    registrar("instagram");
    // O link vai já para a área de transferência: no story, é só colar na figurinha Link.
    copiar(url).then((ok) => {
      if (ok) setAviso("Link copiado.");
    });
    if (imagem) return;
    try {
      const { gerarImagemStory } = await import("@/lib/imagemStory");
      const blob = await gerarImagemStory({ ...conteudo.story, endereco: window.location.host });
      const arquivo = new File([blob], `brincadeira-do-dia-${conteudo.arquivo}.png`, { type: "image/png" });
      let enviavel = false;
      try {
        enviavel = typeof navigator.canShare === "function" && navigator.canShare({ files: [arquivo] });
      } catch {
        enviavel = false;
      }
      setImagem({ blob, previa: URL.createObjectURL(blob), arquivo, enviavel });
      setErroImagem(false);
    } catch {
      setErroImagem(true);
    }
  }

  async function enviarImagem() {
    if (!imagem) return;
    copiar(url);
    if (imagem.enviavel) {
      try {
        await navigator.share({ files: [imagem.arquivo] });
        registrar("imagem");
        setAviso("Pronto. No story, toque no ícone de figurinhas, escolha Link e cole o endereço.");
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    baixarBlob(imagem.arquivo.name, imagem.blob);
    registrar("imagem");
    setAviso("Imagem baixada. No celular, crie um story com ela e cole o link na figurinha Link.");
  }

  async function irQr() {
    setVista("qr");
    setAviso("");
    registrar("qrcode");
    if (qr) return;
    try {
      const QR = await carregarQr();
      setQr(await QR.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: CORES_QR }));
    } catch {
      setAviso("Não deu para criar o QR code agora.");
    }
  }

  async function baixarQr() {
    try {
      const QR = await carregarQr();
      const dados = await QR.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M", color: CORES_QR });
      const blob = await (await fetch(dados)).blob();
      baixarBlob(`qr-brincadeira-do-dia-${conteudo.arquivo}.png`, blob);
      registrar("qr_baixado");
    } catch {
      setAviso("Não deu para baixar o QR code agora.");
    }
  }

  async function maisOpcoes() {
    try {
      await navigator.share({ title: conteudo.titulo, text: conteudo.texto, url });
      registrar("mais");
      fechar();
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) await copiarLink();
    }
  }

  const titulo = vista === "instagram" ? "Instagram" : vista === "qr" ? "QR code" : "Compartilhar";
  const canal = "flex min-h-[92px] flex-col items-center justify-start gap-1.5 rounded-2xl px-1 pt-2 pb-1.5 text-center text-[13px] font-bold leading-tight text-tinta no-underline transition-colors hover:bg-painel";
  const bolinha = "grid size-[52px] shrink-0 place-items-center rounded-full";
  const botao = "flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-base font-bold";

  return (
    <>
      <button type="button" onClick={abrir} className={className} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={janela}
        aria-labelledby={idTitulo}
        onClose={aoFechar}
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
        className="janela"
      >
        {aberta ? (
          <div className="flex flex-col gap-4 px-5 pt-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center gap-1">
              {vista !== "canais" ? (
                <button type="button" onClick={voltar} aria-label="Voltar às opções" className="-ml-2 grid size-11 place-items-center rounded-full text-tinta hover:bg-painel">
                  <Voltar tamanho={22} />
                </button>
              ) : null}
              <h2 id={idTitulo} className="m-0 font-display text-[22px] font-extrabold">
                {titulo}
              </h2>
              <button type="button" onClick={fechar} aria-label="Fechar" className="-mr-1 ml-auto grid size-11 place-items-center rounded-full bg-painel text-tinta hover:bg-linha">
                <Fechar tamanho={20} />
              </button>
            </div>

            {vista === "canais" ? (
              <>
                <p className="m-0 -mt-2 text-[15px] text-suave">{conteudo.chamada}</p>
                <ul className="m-0 grid list-none grid-cols-4 gap-x-1 gap-y-2 p-0">
                  <li>
                    <a href={linkWhatsApp(conteudo, url)} target="_blank" rel="noopener noreferrer" className={canal} onClick={() => { registrar("whatsapp"); setTimeout(fechar, 0); }}>
                      <span className={`${bolinha} bg-folha-claro text-folha`}><Mensagem tamanho={24} /></span>
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <button type="button" className={`${canal} w-full`} onClick={irInstagram}>
                      <span className={`${bolinha} bg-sol-claro text-alerta`}><Imagem tamanho={24} /></span>
                      Instagram
                    </button>
                  </li>
                  <li>
                    <a href={linkFacebook(url)} target="_blank" rel="noopener noreferrer" className={canal} onClick={() => { registrar("facebook"); setTimeout(fechar, 0); }}>
                      <span className={`${bolinha} bg-azul-claro text-azul`}><Pessoas tamanho={24} /></span>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href={linkTelegram(conteudo, url)} target="_blank" rel="noopener noreferrer" className={canal} onClick={() => { registrar("telegram"); setTimeout(fechar, 0); }}>
                      <span className={`${bolinha} bg-azul-claro text-azul`}><Aviao tamanho={24} /></span>
                      Telegram
                    </a>
                  </li>
                  <li>
                    <button type="button" className={`${canal} w-full`} onClick={() => copiarLink()}>
                      <span className={`${bolinha} bg-painel`}><Elo tamanho={24} /></span>
                      Copiar link
                    </button>
                  </li>
                  <li>
                    <button type="button" className={`${canal} w-full`} onClick={irQr}>
                      <span className={`${bolinha} bg-painel`}><Qr tamanho={24} /></span>
                      QR code
                    </button>
                  </li>
                  <li>
                    <a href={linkEmail(conteudo, url)} className={canal} onClick={() => registrar("email")}>
                      <span className={`${bolinha} bg-painel`}><Envelope tamanho={24} /></span>
                      E-mail
                    </a>
                  </li>
                  {nativo ? (
                    <li>
                      <button type="button" className={`${canal} w-full`} onClick={maisOpcoes}>
                        <span className={`${bolinha} bg-painel`}><Pontos tamanho={24} /></span>
                        Mais opções
                      </button>
                    </li>
                  ) : null}
                </ul>
                <p className="m-0 text-sm text-suave">Vai só o link da página. Nada do diário nem do perfil da criança.</p>
              </>
            ) : null}

            {vista === "instagram" ? (
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-4">
                  <div className="grid h-[160px] w-[90px] shrink-0 place-items-center overflow-hidden rounded-xl bg-azul-claro">
                    {imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagem.previa} alt="Prévia da imagem para o story" width={90} height={160} className="h-full w-full object-cover" />
                    ) : (
                      <span className="px-2 text-center text-xs text-suave">{erroImagem ? "Sem imagem" : "Preparando…"}</span>
                    )}
                  </div>
                  <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-[15px]">
                    <li>{imagem?.enviavel === false ? "Baixe a imagem e abra o Instagram no celular." : "Toque em Compartilhar imagem e escolha Instagram e depois Story."}</li>
                    <li>No story, toque no ícone de figurinhas, escolha <strong>Link</strong> e cole o endereço. Ele já está copiado.</li>
                  </ol>
                </div>
                {erroImagem ? (
                  <p className="m-0 text-[15px]">Não deu para criar a imagem neste aparelho. Use o link: no story, na bio ou numa mensagem direta.</p>
                ) : (
                  <button type="button" onClick={enviarImagem} disabled={!imagem} className={`${botao} bg-azul text-white disabled:opacity-60`}>
                    {imagem?.enviavel === false ? <Baixar tamanho={20} /> : <Compartilhar tamanho={20} />}
                    {imagem?.enviavel === false ? "Baixar imagem" : "Compartilhar imagem"}
                  </button>
                )}
                <button type="button" onClick={() => copiarLink("instagram")} className={`${botao} border-[1.5px] border-tinta bg-white text-tinta`}>
                  <Elo tamanho={20} />
                  Copiar o link de novo
                </button>
                <p className="m-0 text-sm text-suave">A mesma imagem serve para o status do WhatsApp e o story do Facebook. O link também pode ir na bio ou numa mensagem direta.</p>
              </div>
          ) : null}

          {vista === "qr" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="grid size-[232px] place-items-center rounded-2xl border border-linha bg-white p-2">
                {qr ? (
                  <div className="size-full [&>svg]:size-full" role="img" aria-label={`QR code com o endereço ${url}`} dangerouslySetInnerHTML={{ __html: qr }} />
                ) : (
                  <span className="text-sm text-suave">Preparando…</span>
                )}
              </div>
              <p className="m-0 text-center text-[15px]">Peça para a outra pessoa apontar a câmera do celular para o código.</p>
              <p className="m-0 break-all text-center text-sm text-suave">{url.replace(/^https?:\/\//, "")}</p>
              <button type="button" onClick={baixarQr} className={`${botao} border-[1.5px] border-tinta bg-white text-tinta`}>
                <Baixar tamanho={20} />
                Baixar o QR code
              </button>
              <p className="m-0 text-center text-sm text-suave">Serve para imprimir num cartaz ou num bilhete da escola.</p>
            </div>
          ) : null}

          {/* Sempre na página (só some da vista quando vazio), para o leitor de tela anunciar as mudanças. */}
          <p role="status" className={aviso ? "m-0 text-[15px] font-bold text-tinta" : "sr-only"}>
            {aviso}
          </p>
        </div>
        ) : null}
      </dialog>
    </>
  );
}
