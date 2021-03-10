<template>
  <v-card width="360" class="mx-auto my-auto">
    <v-card-text>
      <p>ログアウトしました。</p>
      <p class="text-right">
        <router-link to="/login">再ログイン</router-link>
      </p>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>

<script>
import {Auth} from 'aws-amplify'

export default {
  name: 'user.logout',
  data() {
    return {}
  },
  async mounted() {
    await this.$store.dispatch('auth/logout')
  },
  methods: {
    async logout() {},
  },
}
</script>
