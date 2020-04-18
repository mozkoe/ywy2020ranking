import { defineComponent, onMounted, reactive, watch } from '@vue/composition-api'
import { mdiMagnify } from '@mdi/js'
import { header, headerMobile, colors, compareRank, baseUrl, csvEpisodesPrefix, electionNumber } from './config'
import { Row } from './types'
import LineChart from './helpers/LineChart/LineChart.vue'
import LevelCircle from './helpers/LevelCircle/LevelCircle.vue'

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

export default defineComponent({
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
    })

    onMounted(async () => {
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
        r.name = row.Name
        r.company = row.Company
        r.id = rowIndex
        r.level = [{
          name: 'Level Audition',
          level: row['Level Audition'],
        }, {
          name: 'Re-Evaluation',
          level: row['Re-Evaluation'],
        }, {
          name: 'Main-Title',
          level: row['Main-Title'],
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
        r.isEliminated = r.ranking.length !== state.episodes.length

        r.rankDelta = Number.isNaN(Number(lastRank)) || Number.isNaN(Number(secondLastRank))
          ? '-'
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

      state.selectedRow = state.data.reduce((p, c) => {
        const pr = p.ranking
        const cr = c.ranking
        return compareRank(pr, cr) < 0 ? p : c
      })
      state.selectedRow.selected = true
    })

    const handleLineEnter = (row: Row) => {
      if (state.selectedRow) {
        state.selectedRow.selected = false
      }
      row.selected = true
      state.selectedRow = row
      state.svgData.splice(state.svgData.indexOf(row), 1)
      state.svgData.push(row)
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
      const url = `${baseUrl}/avatars/${state.selectedRow.name}.png`
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

      handleLineEnter,
      handleLineLeave,
      getAbsRanking,
    }
  },
})
