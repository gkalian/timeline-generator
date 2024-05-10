<template>
  <v-footer height="40" app class="d-flex align-center justify-center text-caption text-disabled ml-4">
    <div>

        <a
          class="text-decoration-none on-surface"
          href="http://gkalian.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span class="d-none d-sm-inline-block text-disabled"> gkalian</span>
        </a>
        &copy; {{ (new Date()).getFullYear() }}

      <a
        v-for="item in items"
        :key="item.title"
        :href="item.href"
        :title="item.title"
        class="d-inline-block mx-2 social-link"
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

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))

    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
