<template>
  <v-combobox
    multiple
    v-model="$_tags"
    :label="label"
    append-icon
    chips
    deletable-chips
    :dense="dense"
    :backgroundColor="backgroundColor"
    @change="changeInput"
  >
    <template #selection="{item}">
      <v-chip
        close
        :dark="chipDark"
        :light="chipLight"
        :small="chipSmall"
        :color="chipColor"
        @click:close="chipClose(item)"
        >{{ item }}</v-chip
      >
    </template>
  </v-combobox>
</template>

<style lang="scss"></style>

<script>
export default {
  name: 'TagsInput',
  model: {
    prop: 'tags',
    event: 'input',
  },
  props: {
    tags: {
      type: Array,
      default: () => [],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    dense: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    chipColor: {
      type: String,
      default: '',
    },
    chipLight: {
      type: Boolean,
      default: false,
    },
    chipDark: {
      type: Boolean,
      default: true,
    },
    chipSmall: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    $_tags: {
      get() {
        return this.tags
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    changeInput(value) {
      this.$emit('input', value)
    },
    chipClose(value) {
      this.$_tags = this.$_tags.filter((t) => t != value)
    },
  },
}
</script>
