import { defineComponent, computed, onMounted, reactive, watch, onUnmounted } from '@vue/composition-api'
import { Row, LevelEnum } from '~/types/rankingTypes'
import { colors } from '~/pages/ywy2020/config'

interface Props {
  list: Array<Row>
  selectedRow: Row | null
  maxRank: number
  handleLineEnter: (row: Row) => unknown
  handleLineLeave?: (row: Row) => unknown
  episodes: Array<number>
}

export default defineComponent({
  props: {
    list: null,
    selectedRow: null,
    maxRank: null,
    handleLineEnter: null,
    handleLineLeave: null,
    episodes: Array,
  },
  setup: (props: Props, ctx) => {
    const state = reactive({
      width: 100,
      height: 100,
      padding: 20,
      paddingTop: 45,
      paddingBottom: 30,
      updateId: 0,
    })

    const $refs: {
      svg: SVGSVGElement
    } = ctx.refs

    const getXByEpsodes = (column: number) => (
      props.episodes.length > 1
        ? (column / (props.episodes.length - 1)) * (state.width - state.padding * 2) + state.padding
        : (column / (props.episodes.length + 1)) * (state.width - state.padding * 2) + state.padding
    )
    const getYByPercentage = (percentage: number) => (percentage * (state.height - state.paddingTop - state.paddingBottom)) + state.paddingTop

    const pathGenerate = (row: Row) => row.ranking.map((v, i) => {
      const action = i === 0 ? 'M' : 'L'
      const x = getXByEpsodes(i)
      const y = getYByPercentage(v.rank / props.maxRank)
      return `${action}${x},${y}`
    }).join('')

    const getRowColor = (row: Row) => colors[row.level[row.level.length - 1].level]

    const circles = computed(() => {
      if (!props.selectedRow) {
        return []
      }

      return props.selectedRow.ranking.map((v, i) => ({
        x: getXByEpsodes(i),
        y: getYByPercentage(v.rank / props.maxRank),
        text: v.rank,
        color: getRowColor(props.selectedRow!),
        textColor: props.selectedRow!.level[props.selectedRow!.level.length - 1].level === LevelEnum.C
          ? '#444'
          : '#fff',
      }))
    })

    const handleResize = () => {
      state.width = $refs.svg.clientWidth
      state.height = $refs.svg.clientHeight
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      handleResize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    watch(() => [state.width, state.height, state.padding], () => {
      state.updateId += 1
    })

    return {
      props,
      state,
      circles,
      colors,

      getXByEpsodes,
      getYByPercentage,

      pathGenerate,
      getRowColor,
    }
  },
})
