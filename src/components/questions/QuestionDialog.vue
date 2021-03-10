<template>
  <v-dialog
    v-model="$_dialog"
    @close="close"
    @click:outside="close"
    @keydown.esc="close"
    max-width="700"
  >
    <div v-if="$_dialog">
      <Show
        v-if="mode === 'show'"
        v-model="$_question"
        @edit="$emit('update:mode', 'edit')"
        @close="close"
      />
      <Edit
        v-if="mode === 'edit'"
        mode="edit"
        v-model="$_question"
        @save="save"
        @cancel="cancel"
        @close="close"
      />
      <Edit
        v-if="mode === 'add'"
        mode="add"
        v-model="$_question"
        @save="save"
        @cancel="cancel"
        @close="close"
      />
    </div>
  </v-dialog>
</template>

<style scope lang="scss">
.box {
  border: 1px solid lightgray;
}
.v-expansion-panel {
  margin-bottom: 10px !important;
  &::before {
    box-shadow: none !important;
  }
}
.v-expansion-panel-header {
  min-height: 32px !important;
  padding: 4px 8px !important;
}
.v-application--is-ltr {
  .v-expansion-panel-header__icon {
    margin-left: 10px !important;
  }
}
.v-expansion-panel-content__wrap {
  padding: 4px 8px !important;
}
.v-expansion-panel--active {
  > .v-expansion-panel-header {
    min-height: 32px !important;
  }
}
</style>

<script>
import Show from './Show'
import Edit from './Edit'

export default {
  name: 'questions.show',
  model: {
    prop: 'dialog',
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    question: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: 'show',
    },
  },
  components: {
    Show,
    Edit,
  },
  data() {
    return {
      show: false,
    }
  },
  watch: {},
  computed: {
    $_dialog: {
      get() {
        return this.dialog
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    $_question: {
      get() {
        return this.question
      },
      set(value) {
        this.$emit('update:question', value)
      },
    },
  },
  created() {
    console.log(`[QuestionDialog]created`)
    this.show = true
  },
  beforeDestroy() {
    console.log(`[QuestionDialog]beforeDestroy`)
  },
  methods: {
    close() {
      console.log(`[QuestionDialog]close mode:${this.mode}`)
      this.$emit('input', false)
      this.$emit('close')
      this.$emit('update:mode', 'show')
    },
    cancel() {
      console.log(`[QuestionDialog]cancel mode:${this.mode}`)
      this.$emit('update:mode', 'show')
    },
    save(question) {
      console.log(`[QuestionDialog]save mode:${this.mode}`)
      if (this.mode === 'add') {
        //
        this.$emit('update:question', question)
      } else {
        this.$emit('update:question', question)
        this.$emit('update', question)
      }
      this.$emit('update:mode', 'show')
    },
  },
}
</script>
