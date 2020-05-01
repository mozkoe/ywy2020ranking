import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
} from '@vue/composition-api'
import { DataSortFunction } from 'vuetify'
import { mdiMagnify } from '@mdi/js'
import { header, headerMobile, colors, compareRank, baseUrl, csvEpisodesPrefix, electionNumber } from './config'
import { Row } from './types'
import LineChart from '~/components/LineChart/LineChart'
import LevelCircle from '~/components/LevelCircle/LevelCircle'
import { getObjectValueByPath } from '~/utils'

const getRank = (n: string) => {
  if (n === '-') {
    return -1
  }
  return Number(n)
}

const getLevelMaxLength = (data: Array<Row>): number => {
  const maxLength = data.map((v) => v.level.length)
    .reduce((p, c) => Math.max(p, c))

  return maxLength
}

const tableSort: DataSortFunction<Row> = (arr, sortBy, sortDesc, _locale, customSorter) => arr.sort((valueA, valueB) => {
  const compareResult = sortBy.reduce((prevSortResult, sortKey, headerIndex) => {
    if (prevSortResult !== 0) {
      return prevSortResult
    }

    const valueByKeyA = getObjectValueByPath(valueA, sortKey)
    const valueByKeyB = getObjectValueByPath(valueB, sortKey)

    const stillAliveResult = valueB.stillAlive - valueA.stillAlive

    if (stillAliveResult !== 0) {
      return stillAliveResult
    }

    const sortKeyDesc = sortDesc[headerIndex]
    if (customSorter?.[sortKey]) {
      return sortKeyDesc
        ? -customSorter[sortKey](valueByKeyA, valueByKeyB)
        : customSorter[sortKey](valueByKeyA, valueByKeyB)
    }

    if (valueByKeyA > valueByKeyB) {
      return sortKeyDesc ? -1 : 1
    }
    if (valueByKeyA < valueByKeyB) {
      return sortKeyDesc ? 1 : -1
    }
    return 0
  }, 0)

  return compareResult
})

export default defineComponent({
  // head: {},
  // head: () => ({
  //   title: '22',
  //   meta: [
  //     // hid is used as unique identifier. Do not use `vmid` for it as it will not work
  //     { hid: 'description', name: 'description', content: 'My custom description' },
  //   ],
  // }),
  components: {
    LineChart,
    LevelCircle,
  },
  setup: () => {
    const state = reactive({
      data: [] as Array<Row>,
      svgData: [] as Array<Row>,
      selectedRow: null as null | Row,
      maxRank: 100,
      search: '',
      width: 0,
      tableHeight: 500,
      showMore: false,
      episodes: [] as Array<number>,
      levelMax: 0,
      name: '',
    })

    const instance = getCurrentInstance()!

    onMounted(async () => {
      // reveal
      state.name = typeof instance.$route.query.name === 'string'
        ? instance.$route.query.name
        : ''

      // init table colunm
      if (document.body.clientWidth > 960) {
        state.showMore = true
      }

      // import ranking data source from csv file
      const dataString = (await import('./ywy2020_ranking.csv')).default

      const a = dataString.replace(/\r/g, '').split('\n').filter(Boolean).map((v) => v.split(','))
      const [csvHeader, ...data] = a

      // get episodes array
      state.episodes = csvHeader
        .filter((hearder) => hearder.startsWith(csvEpisodesPrefix))
        .map((hearder: string) => parseInt(hearder.substring(csvEpisodesPrefix.length), 10))

      const formatted: Array<Row> = data.map((line) => csvHeader.reduce((p, c, i) => {
        p[c] = line[i]
        return p
      }, {} as any)).map((row, rowIndex) => {
        const r: any = {}
        r.name = row.name
        r.company = row.company
        r.id = rowIndex
        r.level = [{
          name: 'level audition',
          level: row['level audition'],
        }, {
          name: 're evaluation',
          level: row['re evaluation'],
        }, {
          name: 'main title',
          level: row['main title'],
        }].filter((v) => !!v.level)

        r.specialNote = row.note
        r.ranking = []
        state.episodes.forEach((episode, _i) => {
          const rank = getRank(row[`ep${episode}`])
          if (rank > 0) {
            const o: any = {}
            o.episode = episode
            o.rank = rank
            r.ranking.push(o)
          }
        })

        const lastRank = r.ranking[r.ranking.length - 1]?.rank
        const secondLastRank = r.ranking[r.ranking.length - 2]?.rank

        // mark out member
        r.stillAlive = Number(row['still alive'])

        r.rankDelta = (Number.isNaN(Number(lastRank)) || Number.isNaN(Number(secondLastRank))) || !r.stillAlive
          ? undefined
          : Number(secondLastRank) - Number(lastRank)

        return {
          ...r,
          selected: false,
        }
      })

      state.maxRank = formatted
        .flatMap((v) => v.ranking.map((u) => u.rank))
        .reduce((p, c) => Math.max(p, c))

      state.data = formatted
      state.svgData = [...formatted]

      state.levelMax = getLevelMaxLength(state.data)

      const defaultSelectItem = state.data.reduce((p, c) => {
        const pr = p.ranking
        const cr = c.ranking
        return compareRank(pr, cr) < 0 ? p : c
      })

      state.selectedRow = state.name ? state.data.find((arr) => arr.name === state.name) ?? defaultSelectItem : defaultSelectItem

      state.selectedRow.selected = true
    })

    const replaceLocationByName = (name: string) => {
      if (name === state.name) {
        return
      }

      state.name = name
      instance.$router.replace({ query: { name } })
    }

    const handleLineEnter = (row: Row) => {
      if (state.selectedRow) {
        state.selectedRow.selected = false
      }
      row.selected = true
      state.selectedRow = row
      state.svgData.splice(state.svgData.indexOf(row), 1)
      state.svgData.push(row)

      replaceLocationByName(row.name)
    }

    const handleLineLeave = (row: Row) => {
      row.selected = false
      state.selectedRow = null
    }

    const imageList = reactive([] as Array<string>)

    watch(() => state.selectedRow, () => {
      if (!state.selectedRow) {
        return
      }
      const url = `${baseUrl}/ywy2020/avatars/${state.selectedRow.name}.png`
      imageList.push(url)

      while (imageList.length > 1) {
        imageList.shift()
      }
    })

    const getAbsRanking = (rank: number | string) => {
      if (typeof rank === 'string') {
        return '-'
      }
      return Math.abs(rank)
    }

    return {
      i: {
        mdiMagnify,
      },
      baseUrl,
      state,
      colors,
      header,
      headerMobile,
      imageList,
      electionNumber,

      tableSort,
      handleLineEnter,
      handleLineLeave,
      getAbsRanking,
    }
  },
})

const a = defineComponent({

})
