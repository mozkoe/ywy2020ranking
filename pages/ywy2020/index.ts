import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
} from '@vue/composition-api'
import { mdiMagnify } from '@mdi/js'
import { Row } from '~/types/rankingTypes'
import LineChart from '~/components/LineChart/LineChart'
import LevelCircle from '~/components/LevelCircle/LevelCircle'
import ProfileCard from '~/components/ProfileCard/ProfileCard'
import Footer from '~/components/Footer/Footer.vue'
import { getRank, getLevelMaxLength, tableSort, compareRank } from '~/utils'
import { header, headerMobile, colors, baseUrl, csvEpisodesPrefix, electionNumber } from './config'

export default defineComponent({
  head: () => ({
    title: '爱奇艺 青春有你 2 - 排行榜',
    meta: [
      {
        hid: 'ywy2020',
        name: '青春有你第2季 最新排名信息',
        content: "获取 爱奇艺 - 青春有你第2季 最新排名信息, iQiyi's Youth With You 2020 Ranking",
      },
    ],
    link: [
      { rel: 'icon', href: '/ywy2020/favicon.ico' },
    ],
    script: [
      { src: 'https://hm.baidu.com/hm.js?f8d25318c527676058ae4b7bae24f2cb', async: true, defer: true },
    ], // ywy2020
  }),
  components: {
    LineChart,
    LevelCircle,
    ProfileCard,
    Footer,
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
