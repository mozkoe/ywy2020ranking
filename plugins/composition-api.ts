import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)

declare module '@vue/composition-api/dist' {
  interface SetupContext {
    readonly refs: any
  }
}
