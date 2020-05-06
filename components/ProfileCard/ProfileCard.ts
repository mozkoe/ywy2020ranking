import { defineComponent } from '@vue/composition-api'
import { Row } from '~/types/rankingTypes'
import LevelCircle from '~/components/LevelCircle/LevelCircle'

interface Props {
  selectedRow: Row | null
  getAbsRanking: (rank: number | string) => unknown
  imageList: Array<string>
  episodes: Array<number>
  electionNumber: number
  imgPath?: string
}

export default defineComponent({
  props: {
    getAbsRanking: null,
    selectedRow: null,
    imageList: Array,
    episodes: Array,
    electionNumber: null,
    imgPath: null,
  },

  components: {
    LevelCircle,
  },

  setup: (props: Props) => ({
    props,
  }),
})
