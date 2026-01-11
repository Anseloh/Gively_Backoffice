/* eslint-disable no-extend-native */
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueParticles from 'vue-particles'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import * as VueGoogleMaps from "vue2-google-maps";
// eslint-disable-next-line import/extensions
import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'

// JSON view display
import JSONView from "vue-json-component";

import VueCompositionAPI from '@vue/composition-api'

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// Axios Mock Adapter
import '@/@fake-db/db'
// // common UI elements. others should be added individually in the view
Vue.use(VuePlyr, {
  plyr: {}
})

Vue.use(JSONView)

// BootstrapVue Global registration, no need to declare components individually in different views
Vue.use(BootstrapVue)

Vue.use(VueParticles)

// Composition API
Vue.use(VueCompositionAPI)

// Google maps
Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyC0YDG3sDu58lOVPlnSWBis_mT7Xp6rgi8",
        libraries: 'places'
    },
    installComponents: true,
});


// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log('preloader')
  const loader = document.getElementById('loader');
  if(loader){
      loader.style.display = 'block';
  }
  
  next();
  // add spinner
})
router.afterEach((to, from) => {
  console.log('close preloader')
  const loader = document.getElementById('loader');
  if(loader){
      loader.style.display = 'none';
  }
  // clear spinner
},)


new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
