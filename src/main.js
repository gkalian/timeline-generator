/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from "vue3-apexcharts";
import VueDatePicker from '@vuepic/vue-datepicker';

// Components
import App from './App.vue'


// Composables
import { createApp } from 'vue'

const app = createApp(App)
app.use(VueApexCharts);
app.component('VueDatePicker', VueDatePicker);

registerPlugins(app)

app.mount('#main')
