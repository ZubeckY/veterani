import colors from 'vuetify/es5/util/colors'
const is_prod = false

const port = 3000
const host = is_prod ? '31.129.98.120' : '0.0.0.0'
const link = is_prod ? 'http://31.129.98.120' : 'http://localhost'

const server_port = 4000
const server_link = link + ':' + server_port + '/api/'

export default {
  head: {
    title: 'client',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  server: {
    host: host,
    port: port
  },

  components: true,

  css: [
    'assets/styles/main.css',
  ],

  plugins: [
    {src: '@/plugins/v-mask'},
  ],

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: '/',
    proxy: true
  },

  proxy: {
    '/api/': {target: server_link, pathRewrite: {'^/api/': ''}},
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {}
}
