/**
 * @file main.js
 * @description Main application entry point that bootstraps Vue application
 * with Vuetify and other plugins before mounting
 */

// Core Vue
import { createApp } from 'vue'

// Main App Component
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from "vue3-apexcharts";
import VueDatePicker from '@vuepic/vue-datepicker';

/**
 * Initialize and bootstrap the Vue application
 * @function initializeApp
 * @returns {void}
 * @throws {Error} If application initialization fails
 */
const initializeApp = () => {
  try {
    const app = createApp(App)
    
    // Register plugins
    app.use(VueApexCharts);
    app.component('VueDatePicker', VueDatePicker);
    registerPlugins(app)
    
    // Mount application
    app.mount('#main')
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Application successfully mounted in development mode')
    }
  } catch (error) {
    console.error('Failed to initialize application:', error)
  }
}

initializeApp()
