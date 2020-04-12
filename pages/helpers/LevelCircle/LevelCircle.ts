import { defineComponent, computed } from '@vue/composition-api'
import { colors } from '~/pages/config'

interface Props {
  level: string | undefined
}

export default defineComponent({
  props: {
    level: null,
  },
  setup: (props: Props) => {
    const bgColor = computed(() => colors[props.level as keyof typeof colors] ?? '')
    const textColor = computed(() => (props.level === 'C' ? 'black' : 'white'))
    return {
      colors,
      bgColor,
      textColor,
      props,
    }
  },
})
