import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import { header, colors, episodes, compareRank } from './config'
import { Row } from './types'
import LineChart from './helpers/LineChart/LineChart.vue'
import LevelCircle from './helpers/LevelCircle/LevelCircle.vue'

const getRank = (n: string) => {
  if (n === '-') {
    return -1
  }
  return Number(n)
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
    })

    onMounted(async () => {
      const dataString = await (await import('./ywy_rank_ep10.csv')).default
      const a = dataString.replace(/\r/g, '').split('\n').filter(Boolean).map((v) => v.split(','))
      const [csvHeader, ...data] = a

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
        episodes.forEach((episode, _i) => {
          const rank = getRank(row[`ep${episode}`])
          if (rank > 0) {
            const o: any = {}
            o.episode = episode
            // o.x = i
            o.rank = rank
            r.ranking.push(o)
          }
        })

        r.universalRank = r.ranking

        const lastRank = r.ranking[r.ranking.length - 1]?.rank
        const secondLastRank = r.ranking[r.ranking.length - 2]?.rank
        r.rankDelta = Number.isNaN(Number(lastRank)) || Number.isNaN(Number(secondLastRank))
          ? '-'
          : Number(lastRank) - Number(secondLastRank)

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

    return {
      state,
      colors,
      header,
      episodes,

      handleLineEnter,
      handleLineLeave,
    }
  },
})
