<template>
  <v-main>
    <v-card width="360" class="mx-auto my-auto" hover>
      <v-card-title>Home</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn @click="test">test</v-btn>
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
