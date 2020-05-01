const purgecss = require('@fullhuman/postcss-purgecss')

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - mozkoe's ranking site",
    title: "iQiyi's Youth With You 2020 Ranking" || process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
    script: process.env.NODE_ENV === 'production' ? [
      // { src: 'https://hm.baidu.com/hm.js?f85040ca1e4d2e5c7cd8d89f6a774f9d' }, // index
      // { src: 'https://hm.baidu.com/hm.js?f8d25318c527676058ae4b7bae24f2cb' }, // ywy2020
    ] : undefined,
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/composition-api.ts',
    '~/plugins/tailwind.ts',
  ],

  router: {
    base: process.env.NODE_ENV === 'production'
      ? '/ywy2020'
      : '',
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      icons: 'mdiSvg',
    },
    treeShake: true,
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // eslint-disable-next-line no-unused-vars
    extend(config, { isClient, loaders: { imgUrl } }) {
      // url-loader rule rewrite, img 10 KB
      if (isClient) {
        imgUrl.limit = 10000
      }

      config.module.rules.push({
        test: /.csv$/,
        use: 'raw-loader',
      })

      const sass = config.module.rules.find((v) => v.test && v.test.toString().includes('sass'))
      const postcss = sass.oneOf[1].use.find((v) => v.loader === 'postcss-loader')
      const postcssIndex = sass.oneOf[1].use.indexOf(postcss)

      const mySass = {
        test: /tailwind\.tailwind/,
        use: [
          ...sass.oneOf[1].use.slice(0, postcssIndex),
          {
            loader: 'postcss-loader',
            options: {
              ...postcss.options,
              plugins: [
                ...postcss.options.plugins,
                purgecss({
                  content: [
                    './pages/**/*.vue',
                    './pages/**/*.tsx',
                  ],
                  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                }),
              ],
            },
          },
          ...sass.oneOf[1].use.slice(postcssIndex + 1),
        ],
      }

      config.module.rules.push(mySass)
    },

    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-preset-env': this.preset,
        'tailwindcss': {},
        'cssnano': { preset: 'default' }, // disabled in dev mode
      },
      order: 'presetEnvAndCssnanoLast',
      preset: {
        stage: 2,
      },
    },
  },
}
