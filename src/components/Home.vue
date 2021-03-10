<template>
  <v-main>
    <v-card width="600" class="mx-auto my-auto" hover>
      <v-card-title>Home</v-card-title>
      <v-card-text>
        <div class="text-h1">Q-ROBOT</div>
        <v-row>
          <v-col>
            <p class="text-center">
              <router-link to="/questions">問題一覧</router-link>
            </p>
          </v-col>
        </v-row>
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
export default {
  name: 'Home',
  computed: {
    canTest() {
      return false
    },
  },
  data() {
    return {
      message: 'Hello!',
    }
  },
  async created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    // ...mapActions({
    //   increment: 'counter/increment',
    // }),
    async test() {
      try {
        // const result = await this.voiceDummy({})
        // console.log(result)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
