import {
  defineComponent,
  reactive,
} from '@vue/composition-api'
import Footer from '~/components/Footer/Footer.vue'

export default defineComponent({
  components: {
    Footer,
  },
  head: () => ({
    link: [
      { rel: 'icon', href: '/favicon.ico' },
    ],
    script: [
      { src: 'https://hm.baidu.com/hm.js?f85040ca1e4d2e5c7cd8d89f6a774f9d', async: true, defer: true },
    ], // index
  }),
  setup: () => {
    const state = reactive({
      //
    })

    return {
      state,
    }
  },
})
