<template>
  <v-footer app absolute class="d-flex align-center justify-center py-3 footer">
    <div class="text-center mt-2 footer-text">
      <a
        class="author-link"
        href="https://github.com/gkalian"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>gkalian</span> </a
      >, &copy; {{ new Date().getFullYear() }}
    </div>
  </v-footer>
</template>

<style scoped>
.footer {
  background-color: var(--v-theme-background) !important;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.footer-text {
  width: 100%;
  padding: 8px;
  text-align: center;
  font-family: inherit;
  color: rgba(57, 57, 57, 0.8);
  transition: all 0.3s;
}

.footer-text:hover,
.social-link:hover :deep(.v-icon) {
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.author-link {
  text-decoration: none;
  color: inherit;
}
</style>
