import "@fontsource/inter"
import "@fontsource/poppins"

import { createApp } from 'vue'
import HighchartsVue from 'highcharts-vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';

import App from './App.vue'
import router from './router'

import "@fontsource/inter/600.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import 'v-calendar/style.css';
import "bootstrap/dist/css/bootstrap.css";
import "./main.scss"


const app = createApp(App)

app.use(HighchartsVue)
app.use(setupCalendar, {})
app.use(router)

app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
