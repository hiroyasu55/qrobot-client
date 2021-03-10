<template>
  <v-main>
    <v-card width="360" class="mx-auto my-auto" hover>
      <v-card-title>Page not found</v-card-title>
      <v-card-text>
        <p>お探しのページは見つかりません。</p>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<style lang="scss" scoped>
.v-main {
  height: 100%;
}
</style>

<script>
import {setTitle} from '@/utility'

export default {
  name: 'notfound',
  created() {
    setTitle('Page not found')
  },
}
</script>
