/**
 * Gera o "PIX copia e cola" (BR Code estático, padrão EMV do Banco Central)
 * sem valor definido: a pessoa escolhe quanto quer apoiar.
 */

function campo(id: string, valor: string): string {
  if (valor.length > 99) throw new Error(`Campo PIX ${id} longo demais`);
  return id + String(valor.length).padStart(2, "0") + valor;
}

function semAcento(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim();
}

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido pelo BR Code. */
export function crc16(texto: string): string {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function pixCopiaECola(opts: { chave: string; nome: string; cidade: string; descricao?: string }): string {
  const conta =
    campo("00", "br.gov.bcb.pix") + campo("01", opts.chave.trim()) + (opts.descricao ? campo("02", opts.descricao.slice(0, 40)) : "");
  const semCrc =
    campo("00", "01") +
    campo("01", "11") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("58", "BR") +
    campo("59", semAcento(opts.nome).slice(0, 25)) +
    campo("60", semAcento(opts.cidade).slice(0, 15)) +
    campo("62", campo("05", "***")) +
    "6304";
  return semCrc + crc16(semCrc);
}
