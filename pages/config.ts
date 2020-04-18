import { Row } from './types'

export const baseUrl = process.env.NODE_ENV === 'production'
  ? '/ywy2020'
  : ''

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
    value: 'ranking',
    sortable: true,
    sort: compareRank,
    width: '10%',
  },
  {
    text: '姓名',
    value: 'name',
    width: '20%',
  },
  {
    text: '经纪公司',
    value: 'company',
  },
  {
    text: '初评',
    value: 'level[0].level',
  },
  {
    text: '公演1',
    value: 'level[1].level',
  },
  {
    text: '主题曲',
    value: 'level[2].level',
  },
  {
    text: '排名变动',
    value: 'rankDelta',
  },
]

export const headerMobile = [
  {
    text: '排名',
    value: 'ranking',
    sortable: true,
    sort: compareRank,
    width: '20%',
  },
  {
    text: '姓名',
    value: 'name',
    width: '25%',
  },
  {
    text: '经纪公司',
    value: 'company',
    width: '25%',
  },
  {
    text: '排名变动',
    value: 'rankDelta',
    width: '15%',
  },
]
