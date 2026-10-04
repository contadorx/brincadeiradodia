import type { Metadata } from "next";
import { Instalar } from "@/components/Instalar";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Instalar na tela inicial" };

export default function Pagina() {
  return <Instalar url={SITE.url} />;
}
