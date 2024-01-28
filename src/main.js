import "@fontsource/poppins"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import HighchartsVue from 'highcharts-vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';

import App from './App.vue'
import router from './router'

import "@fontsource/poppins/400.css"
import "bootstrap/dist/css/bootstrap.css";
import 'v-calendar/style.css';

const app = createApp(App)

app.use(HighchartsVue)
app.use(setupCalendar, {})
app.use(createPinia())
app.use(router)

app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
