/*
 * Fonte única do conteúdo da página. Para usar com o casamento de vocês,
 * troque os textos e aponte os caminhos para as fotos e vídeos em public/media/.
 *
 * DADOS DE DEMONSTRAÇÃO: nomes, datas e história são fictícios.
 * Fotos: Unsplash (licença Unsplash). Vídeos gerados a partir dessas fotos.
 */

export type Categoria = 'cerimonia' | 'festa' | 'ensaio' | 'detalhes'

export type Foto = {
  id: string
  /** Imagem em tamanho cheio, usada no lightbox e no telão. */
  src: string
  /** Versão reduzida (cerca de 900px de largura), usada nas grades. */
  thumb: string
  largura: number
  altura: number
  alt: string
  categoria: Categoria
}

export type Momento = {
  ano: string
  titulo: string
  texto: string
  fotoId: string
}

export type Capitulo = {
  titulo: string
  /** Início do capítulo no filme, em segundos. */
  inicio: number
}

const pasta = '/media/demo'

function foto(n: number, largura: number, altura: number, categoria: Categoria, alt: string): Foto {
  const arquivo = `foto-${String(n).padStart(2, '0')}.jpg`
  return {
    id: `foto-${n}`,
    src: `${pasta}/${arquivo}`,
    thumb: `${pasta}/thumbs/${arquivo}`,
    largura,
    altura,
    alt,
    categoria,
  }
}

export const casal = {
  noiva: 'Marina',
  noivo: 'Caio',
  iniciais: 'M&C',
  data: '2027-03-14',
  dataPorExtenso: '14 de março de 2027',
  local: 'Fazenda Santa Clara, Itu (SP)',
  hashtag: '#MarinaECaio',
}

export const fotos: Foto[] = [
  foto(11, 1800, 2700, 'ensaio', 'Marina e Caio de mãos dadas num campo dourado ao pôr do sol'),
  foto(2, 1800, 2700, 'cerimonia', 'Beijo dos noivos sob chuva de pétalas, cercados pelas madrinhas'),
  foto(3, 1800, 1200, 'detalhes', 'Duas alianças douradas sobre tecido claro'),
  foto(7, 1800, 2700, 'cerimonia', 'Gazebo branco decorado com flores laranja para a cerimônia'),
  foto(5, 1800, 1200, 'ensaio', 'O casal caminhando no alto de uma colina com montanhas ao fundo'),
  foto(6, 1800, 2700, 'ensaio', 'Os noivos de testas encostadas, envoltos no véu, sob luz dourada'),
  foto(9, 1800, 1200, 'festa', 'Mesa comprida da recepção com flores do campo e taças'),
  foto(12, 1800, 2700, 'festa', 'Marina e Caio rindo enquanto caminham entre as palmeiras'),
  foto(15, 1800, 1050, 'cerimonia', 'Foto em preto e branco dos noivos com o véu ao vento'),
  foto(10, 1800, 1200, 'detalhes', 'Alianças apoiadas sobre um buquê de rosas claras'),
  foto(8, 1800, 1200, 'ensaio', 'O casal abraçado à beira de um lago'),
  foto(14, 1800, 2722, 'ensaio', 'Os noivos numa varanda de pedra diante de um castelo'),
  foto(13, 1800, 1202, 'detalhes', 'Arranjo de rosas preso ao arco da cerimônia'),
  foto(4, 1800, 1200, 'ensaio', 'Mãos dadas e a sombra do casal na grama'),
  foto(1, 1800, 1200, 'detalhes', 'Buquê de flores brancas e rosadas contra a luz'),
  foto(16, 1800, 1200, 'ensaio', 'O casal sobre as pedras de um lago de montanha refletido na água'),
]

export const categorias: { id: Categoria | 'todas'; rotulo: string }[] = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'cerimonia', rotulo: 'Cerimônia' },
  { id: 'festa', rotulo: 'Festa' },
  { id: 'ensaio', rotulo: 'Ensaio' },
  { id: 'detalhes', rotulo: 'Detalhes' },
]

export const historia: Momento[] = [
  {
    ano: '2019',
    titulo: 'O primeiro café',
    texto: 'Um amigo em comum marcou um café para três. Ele não apareceu, e a conversa durou a tarde inteira.',
    fotoId: 'foto-4',
  },
  {
    ano: '2022',
    titulo: 'A viagem para a serra',
    texto: 'Dez dias de estrada, uma barraca que molhou na primeira noite e a certeza de que dava para dividir a vida.',
    fotoId: 'foto-16',
  },
  {
    ano: '2025',
    titulo: 'O pedido',
    texto: 'No mesmo café de 2019, com o mesmo amigo, que dessa vez chegou na hora certa com as alianças.',
    fotoId: 'foto-10',
  },
  {
    ano: '2027',
    titulo: 'O sim',
    texto: 'Debaixo do gazebo da Fazenda Santa Clara, com as pessoas que fizeram parte de cada capítulo.',
    fotoId: 'foto-7',
  },
]

export const filme = {
  src: `${pasta}/filme-demo.mp4`,
  poster: `${pasta}/filme-poster.jpg`,
  titulo: 'O filme do casamento',
  duracao: '0:33',
  capitulos: [
    { titulo: 'Ensaio', inicio: 0 },
    { titulo: 'Alianças', inicio: 8.5 },
    { titulo: 'Cerimônia', inicio: 12.5 },
    { titulo: 'Festa', inicio: 24.5 },
    { titulo: 'Final', inicio: 28.5 },
  ] satisfies Capitulo[],
}

export const heroVideo = {
  src: `${pasta}/hero-loop.mp4`,
  poster: `${pasta}/thumbs/foto-11.jpg`,
}

export function fotoPorId(id: string): Foto {
  const encontrada = fotos.find((f) => f.id === id)
  if (!encontrada) throw new Error(`Foto não encontrada: ${id}`)
  return encontrada
}
