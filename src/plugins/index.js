import vuetify from './vuetify'

/**
 * Register all application plugins
 * @function registerPlugins
 * @param {import('vue').App} app - Vue application instance
 * @throws {Error} If plugin registration fails
 * @returns {void}
 */
export function registerPlugins(app) {
  try {
    // Core plugins
    app.use(vuetify)

    // Development plugins
    if (process.env.NODE_ENV === 'development') {
      // Add any development-only plugins here
      console.log('Plugins registered successfully')
    }
  } catch (error) {
    console.error('Failed to register plugins:', error)
    throw error // Re-throw to handle it in the main application
  }
}
