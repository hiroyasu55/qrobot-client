<template>
  <v-app>
    <Header />
    <router-view />
    <Loader />
  </v-app>
</template>

<style lang="scss">
$font-family: 'M PLUS Rounded 1c', 'Robot', 'ＭＳ Ｐゴシック', sans-serif;
$app-bar-top: 8px;
$app-bar-padding-top: 4px;

* {
  text-transform: none !important;
}
.v-application {
  font-family: $font-family !important;
  background-color: var(--v-background-base) !important;
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6,
  .text-body-1,
  .text-body-2 {
    font-family: $font-family !important;
  }
}
.v-app-bar {
  top: $app-bar-top !important;
}
.v-main {
  height: 100%;
}

@media screen and (min-width: 960px) {
  $app-bar-height: 64px;
  .v-main {
    padding-top: $app-bar-height + ($app-bar-top + $app-bar-padding-top) * 2 !important;
  }
}

@media screen and (max-width: 959px) {
  $app-bar-height: 56px;
  .v-main {
    padding-top: $app-bar-height + ($app-bar-top + $app-bar-padding-top) * 2 !important;
  }
}

// Utility
.pre-line {
  white-space: pre-line;
}
</style>

<script>
import Header from '@/components/layouts/Header'
import Loader from '@/components/modules/Loader'

export default {
  name: 'App',
  components: {
    Header,
    Loader,
  },
  created() {
    this.$store.dispatch('errors/clear')
  },
  methods: {},
}
</script>
