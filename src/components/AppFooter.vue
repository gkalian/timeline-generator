<template>
  <v-footer
    class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 footer"
  >
    <div
      class="flex-1-0-100 text-center mt-2 footer-text"
    >
    <a
        class="author-link"
        href="http://gkalian.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>gkalian</span>
      </a>, &copy; {{ (new Date()).getFullYear() }}

      <a
        v-for="item in items"
        :key="item.title"
        :href="item.href"
        :title="item.title"
        class="social-link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <v-icon
          :icon="item.icon"
          :size="item.icon === '$vuetify' ? 24 : 16"
        />
      </a>

    </div>
  </v-footer>
</template>

<script setup>
  const items = [
    {
      title: 'GitHub',
      icon: `mdi-github`,
      href: 'https://github.com/gkalian',
    },
  ]
</script>

<style scoped>
.footer {
  background-color: var(--v-theme-background) !important;
}

.footer-text{
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8px;
  text-align: center;
  font-family: inherit;
  color: rgba(57, 57, 57, 0.8);
  transition: all 0.3s;
}

.footer-text:hover, .social-link:hover :deep(.v-icon) {
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.author-link {
  text-decoration: none;
  color: inherit;
}

.social-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: rgba(57, 57, 57, 0.8);
}

.social-link :deep(.v-icon) {
  color: inherit;
}

</style>
