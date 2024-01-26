import "bootstrap/dist/css/bootstrap.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import HighchartsVue from 'highcharts-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(HighchartsVue)
app.use(createPinia())
app.use(router)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
