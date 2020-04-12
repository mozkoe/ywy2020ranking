import { Row } from './types'

export const episodes = [2, 4, 6, 10]

export const colors = {
  'A': '#fb9fcb',
  'B': '#ff951c',
  'C': '#fff200',
  'D': '#00a500',
  'F': 'gray',
  '?': '#000000',
  '-': '#000000',
}

export const compareRank = (a: Row['ranking'], b: Row['ranking']) => {
  const fa = a[a.length - 1]
  const fb = b[b.length - 1]
  if (!fa) {
    return 1
  }

  if (!fb) {
    return -1
  }

  if (fa.episode !== fb.episode) {
    return fb.episode - fa.episode
  }

  return fa.rank - fb.rank
}

export const header = [
  {
    text: '排名',
    // value: 'latestRank',
    // value: 'currentRank',
    value: 'ranking',
    sortable: true,
    sort: compareRank,
  },
  { text: '本名', value: 'name' },
  { text: '经济公司', value: 'company' },
  { text: '初评', value: 'level[0].level' },
  { text: '公演 1', value: 'level[1].level' },
  { text: '主题曲', value: 'level[2].level' },
  { text: '排名变动', value: 'rankDelta' },
]
