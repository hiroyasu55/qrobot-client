<template>
  <div v-if="loading" class="loader__wrapper">
    <v-progress-circular :size="250" :width="30" color="#c0c0c0" indeterminate>
    </v-progress-circular>
  </div>
</template>

<style lang="scss">
.loader__wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgb(255, 255, 255, 0.5);
}
</style>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Loader',
  // model: {
  //   prop: 'loading',
  // },
  // props: {
  //   loading: Boolean,
  // },
  computed: {
    ...mapState({
      loading: (state) => state.loader.loading,
    }),
  },
}
</script>
