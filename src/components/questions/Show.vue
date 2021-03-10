<template>
  <v-card min-height="90vh">
    <v-card-title>
      問題 #{{ question.id }}
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="edit" class="mr-2">編集</v-btn>
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <div class="box pre-line text-body-1 mt-4 pa-2">
        {{ vtextToText(question.question) }}
      </div>
      <div class="mt-2">
        <Speaker :voiceFilePath="question.questionVoiceFile" />
      </div>
      <v-expansion-panels multiple accordion v-model="panels">
        <v-expansion-panel>
          <v-expansion-panel-header>解答</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="pa-2">
              <v-col cols="12" class="text-body-1">
                <span class="font-weight-bold">{{ question.answer }}</span>
                <span class="ml-2">（{{ question.answer_kana }}）</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-container class="px-4">
                  <!--
            <v-row>
              <v-col>
                <div class="font-weight-bold">その他の解答</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row
                  v-for="(a, i) in question.other_answers"
                  :key="i"
                  class="ml-2"
                >
                  <v-col cols="6" class="pt-0 pb-2">
                    {{ a.answer }}
                  </v-col>
                  <v-col class="pt-0 pb-2">
                    （{{ a.answer_kana }}）
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            -->
                  <v-row>
                    <v-col>
                      <div class="font-weight-bold">解説</div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pre-line ml-2">
                      {{ question.explanation }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="font-weight-bold">タグ</div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="ml-2">
                      <v-chip
                        v-for="(tag, i) in question.tags"
                        :key="i"
                        label
                        small
                        class="mr-2"
                        color="green"
                        text-color="white"
                      >
                        {{ tag }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="font-weight-bold">評価</div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-rating
                        empty-icon="mdi-star-outline"
                        full-icon="mdi-star"
                        half-icon="mdi-star-half-full"
                        length="5"
                        size="16"
                        :value="question.reputation"
                      ></v-rating>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <div class="font-weight-bold">公開</div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      {{ statusText(question.status) }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
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
import Speaker from '@/components/modules/Speaker'
import QuestionsMixin from '@/mixins/QuestionsMixin'
import {vtextToText} from '@/utility'

export default {
  name: 'questions.show',
  mixins: [QuestionsMixin],
  model: {
    prop: 'question',
  },
  props: {
    question: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    Speaker,
  },
  data() {
    return {
      panels: [],
    }
  },
  computed: {
    $_dialog: {
      get() {
        return this.dialog
      },
      set(value) {
        this.$emit('dialog', value)
      },
    },
  },
  created() {
    console.log(`[Show]created`)
    this.panels = []
  },
  async mounted() {
    console.log(`[Show]mounted`)
    if (!this.question.questionVoiceFile) {
      await this.createInitialQuestionVoiceFile()
    }
  },
  beforeDestroy() {
    console.log(`[Show]beforeDestroy`)
  },
  methods: {
    vtextToText,
    statusText(value) {
      return value === 'open'
        ? '公開'
        : value === 'draft'
        ? '下書き'
        : `[${value}]`
    },
    edit() {
      console.log(`[Show]edit`)
      this.$emit('edit')
    },
    close() {
      console.log(`[Show]close`)
      this.$emit('update:dialog', false)
      this.$emit('close')
    },
    async createInitialQuestionVoiceFile() {
      try {
        this.$store.dispatch('loader/start')
        await this.createQuestionVoiceFile(this.question)
      } finally {
        this.$store.dispatch('loader/stop')
      }
    },
  },
}
</script>
