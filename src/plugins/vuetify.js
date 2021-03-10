import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

/*
theme: {
  themes: {
    dark: {
      secondary: '#4345c5',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
    },
  },
},
*/
Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    light: true,
    themes: {
      light: {
        primary: colors.pink.lighten1,
        secondary: colors.yellow.darken4,
        accent: colors.pink.accent3,
        info: colors.blue.base,
        success: colors.green.base,
        warning: colors.yellow.base,
        error: colors.red.base,
        background: colors.blueGrey.lighten3,
      },
    },
    options: {
      customProperties: true,
    },
  },
})
