import {
  defineComponent,
  onMounted,
  reactive,
} from '@vue/composition-api'

export default defineComponent({
  components: {
    // LineChart,
    // LevelCircle,
  },
  setup: () => {
    const state = reactive({
      //
    })

    onMounted(async () => {
      //
    })

    return {
      state,
    }
  },
})
