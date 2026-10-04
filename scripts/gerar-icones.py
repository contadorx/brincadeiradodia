"""Gera os ícones do PWA em public/icons/. Rode com: npm run icones
Ícone: quadrado azul com um sol amarelo e o número 10 (os 10 minutos)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AZUL = (47, 85, 201)
SOL = (255, 200, 69)
TINTA = (28, 35, 51)
PASTA = Path(__file__).resolve().parent.parent / "public" / "icons"
PASTA.mkdir(parents=True, exist_ok=True)

FONTES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]


def fonte(tamanho: int):
    for f in FONTES:
        if Path(f).exists():
            return ImageFont.truetype(f, tamanho)
    return ImageFont.load_default()


def icone(tamanho: int, mascaravel: bool) -> Image.Image:
    escala = 4
    t = tamanho * escala
    img = Image.new("RGBA", (t, t), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if mascaravel:
        d.rectangle([0, 0, t, t], fill=AZUL)
        raio_sol = int(t * 0.27)
    else:
        d.rounded_rectangle([0, 0, t - 1, t - 1], radius=int(t * 0.22), fill=AZUL)
        raio_sol = int(t * 0.33)
    c = t // 2
    d.ellipse([c - raio_sol, c - raio_sol, c + raio_sol, c + raio_sol], fill=SOL)
    f = fonte(int(raio_sol * 0.95))
    caixa = d.textbbox((0, 0), "10", font=f)
    largura, altura = caixa[2] - caixa[0], caixa[3] - caixa[1]
    d.text((c - largura / 2 - caixa[0], c - altura / 2 - caixa[1]), "10", font=f, fill=TINTA)
    return img.resize((tamanho, tamanho), Image.LANCZOS)


for tamanho in (192, 512):
    icone(tamanho, False).save(PASTA / f"icone-{tamanho}.png")
    icone(tamanho, True).save(PASTA / f"icone-mascaravel-{tamanho}.png")
icone(180, True).convert("RGB").save(PASTA / "apple-touch-icon.png")
icone(48, False).save(PASTA / "favicon-48.png")
print("Ícones gerados em", PASTA)
