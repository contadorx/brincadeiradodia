import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import { SITE } from "@/config/site";
import { Sistema } from "@/components/Sistema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nome, template: `%s · ${SITE.nome}` },
  description: SITE.descricao,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/favicon-48.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Brincadeira", statusBarStyle: "default" },
  openGraph: {
    title: SITE.nome,
    description: SITE.descricao,
    url: SITE.url,
    siteName: SITE.nome,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/icons/icone-512.png", width: 512, height: 512 }],
  },
  formatDetection: { telephone: false },
  // A prévia com rascunhos (NEXT_PUBLIC_RASCUNHOS=1) não deve aparecer no Google.
  ...(process.env.NEXT_PUBLIC_RASCUNHOS === "1" ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#2F55C9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metricas = SITE.umami.scriptUrl && SITE.umami.websiteId;
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-white antialiased">
        {children}
        <Sistema />
        {metricas ? (
          <Script
            src={SITE.umami.scriptUrl}
            data-website-id={SITE.umami.websiteId}
            data-domains={SITE.umami.dominio}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
