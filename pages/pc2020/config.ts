import { DataTableHeader } from 'vuetify'
import { compareRank } from '~/utils/index'

export const baseUrl = ''

// csv title, eg: ep1
export const csvEpisodesPrefix = 'ep'

export const electionNumber = 7

export const colors = {
  'A': '#fb9fcb',
  'B': '#ff951c',
  'C': '#ffe769',
  'D': '#00a500',
  'F': 'gray',
  '?': '#000000',
  '-': '#000000',
}

export const header: Array<DataTableHeader> = [
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
    sortable: false,
  },
  {
    text: '经纪公司',
    value: 'company',
    width: '20%',
    sortable: false,
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
    sortable: false,
  },
  {
    text: '经纪公司',
    value: 'company',
    width: '25%',
    sortable: false,
  },
  {
    text: '排名变动',
    value: 'rankDelta',
    width: '15%',
  },
]
