/**
 * Lembrete diário sem servidor: um evento de agenda que se repete todo dia.
 * A família baixa o arquivo e a própria agenda do celular avisa.
 */
export function gerarLembreteIcs(horario: string, url: string): string {
  const [h, m] = horario.split(":").map((x) => x.padStart(2, "0"));
  const hoje = new Date();
  const data = `${hoje.getFullYear()}${String(hoje.getMonth() + 1).padStart(2, "0")}${String(hoje.getDate()).padStart(2, "0")}`;
  const agora = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Brincadeira do Dia//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:lembrete-${agora}@brincadeiradodia.com.br`,
    `DTSTAMP:${agora}`,
    // Horário "flutuante" (sem fuso): vale a hora local do celular da família.
    `DTSTART:${data}T${h}${m}00`,
    "DURATION:PT15M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:Brincadeira do Dia (10 min)",
    `DESCRIPTION:Hora da brincadeira de hoje. Abra ${url}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Hora da brincadeira de hoje",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return linhas.join("\r\n") + "\r\n";
}
