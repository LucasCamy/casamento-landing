#!/usr/bin/env bash
# Gera a sequência de quadros usada na cena "O dia" (canvas controlado pelo scroll).
#
# Uso:
#   bash scripts/gerar-sequencia.sh <video.mp4>          a partir de um vídeo de vocês
#   bash scripts/gerar-sequencia.sh --fotos f1 f2 f3...  a partir de fotos (zoom lento + fusão)
#
# Saída: public/media/sequencia/0001.webp ... e o total de quadros impresso no fim.
# Depois ajuste `sequencia.total` em src/data/casamento.ts.
set -euo pipefail

SAIDA="public/media/sequencia"
LARGURA=1024
FPS=12
mkdir -p "$SAIDA"
rm -f "$SAIDA"/*.webp

if [[ "${1:-}" == "--fotos" ]]; then
  shift
  secs=4 n=$# i=0 inputs=() filtros=""
  for f in "$@"; do
    inputs+=(-framerate 25 -loop 1 -t "$secs" -i "$f")
    filtros+="[$i]scale=2048:1152:force_original_aspect_ratio=increase,crop=2048:1152,zoompan=z='min(1+0.0011*on,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${LARGURA}x576:fps=25,setsar=1[v$i];"
    i=$((i+1))
  done
  anterior="v0" offset=$(( secs - 1 ))
  for (( j=1; j<n; j++ )); do
    filtros+="[$anterior][v$j]xfade=transition=fade:duration=1:offset=${offset}[x$j];"
    anterior="x$j"; offset=$(( offset + secs - 1 ))
  done
  filtros+="[$anterior]fps=${FPS}[out]"
  ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filtros" -map "[out]" -c:v libwebp -quality 62 "$SAIDA/%04d.webp"
else
  ffmpeg -v error -y -i "$1" -vf "fps=${FPS},scale=${LARGURA}:-2" -c:v libwebp -quality 62 "$SAIDA/%04d.webp"
fi

echo "quadros: $(ls "$SAIDA"/*.webp | wc -l)  tamanho: $(du -sh "$SAIDA" | cut -f1)"
