/**
 * plugins/vuetify.js
 *
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import "vuetify/styles";
import '@vuepic/vue-datepicker/dist/main.css'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})
