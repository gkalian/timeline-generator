import "vuetify/styles";
import '@vuepic/vue-datepicker/dist/main.css'

/**
 * Vuetify instance with custom configuration
 * @type {import('vuetify').VuetifyOptions}
 */
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})
