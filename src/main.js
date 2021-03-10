import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import Amplify, * as AmplifyModules from 'aws-amplify'
import {AmplifyPlugin} from 'aws-amplify-vue'
import {I18n} from 'aws-amplify'
import aws_exports from '@/aws-exports'
import '@aws-amplify/ui-vue'
import {messages} from '@/i18n/amplify/messages'

Amplify.configure(aws_exports)
Vue.use(AmplifyPlugin, AmplifyModules)
I18n.setLanguage('ja')
I18n.putVocabularies(messages)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
