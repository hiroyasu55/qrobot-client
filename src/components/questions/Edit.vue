<template>
  <v-card min-height="90vh">
    <v-card-title>
      <template v-if="mode === 'add'">問題作成</template>
      <template v-if="mode === 'edit'">問題 #{{ question.id }} </template>

      <v-spacer></v-spacer>
      <template v-if="mode === 'add'">
        <v-btn color="primary" :disabled="!canSave" class="mr-2" @click="save">
          作成
        </v-btn>
      </template>
      <template v-if="mode === 'edit'">
        <v-btn color="primary" :disabled="!canSave" class="mr-2" @click="save">
          更新
        </v-btn>
      </template>
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <v-alert v-if="errors.length > 0" dense type="error" class="ma-4">
        <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
      </v-alert>
      <v-row>
        <v-col>
          <div class="font-weight-bold">問題</div>
          <v-textarea
            v-model="newQuestion.question"
            dense
            outlined
            :backgroundColor="bgColor('question')"
            :rules="[rules.required]"
            class="mb-0"
          ></v-textarea>
          <div class="mt-2">
            <Speaker
              :voiceFilePath="tempQuestionVoiceFilePath"
              :beforePlay="speakerBeforePlay"
            />
          </div>

          <v-expansion-panels multiple accordion v-model="answerPanels">
            <v-expansion-panel>
              <v-expansion-panel-header>（整形後）</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-textarea
                  outlined
                  disabled
                  :value="vtextToText(newQuestion.question || '')"
                ></v-textarea>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <div class="font-weight-bold">解答</div>
          <v-text-field
            v-model="newQuestion.answer"
            dense
            :backgroundColor="bgColor('answer')"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="font-weight-bold">（かな）</div>
          <v-text-field
            v-model="newQuestion.answer_kana"
            dense
            :backgroundColor="bgColor('answer_kana')"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="font-weight-bold">解説</div>
          <v-textarea
            v-model="newQuestion.explanation"
            dense
            outlined
            :backgroundColor="bgColor('explanation')"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="font-weight-bold">タグ</div>
          <TagsInput
            v-model="newQuestion.tags"
            dense
            chipColor="green"
            :backgroundColor="bgColor('tags')"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <div class="font-weight-bold">評価</div>
          <v-select
            v-model="newQuestion.reputation"
            dense
            :items="reputationItems"
            :backgroundColor="bgColor('reputation')"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <div class="font-weight-bold">公開</div>
          <v-select
            v-model="newQuestion.status"
            dense
            :items="statusItems"
            :backgroundColor="bgColor('status')"
            width="100"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scope lang="scss">
.box {
  border: 1px solid #c0c0c0;
}
.v-text-field__details {
  display: none;
}
</style>

<script>
import TagsInput from '@/components/modules/TagsInput'
import Speaker from '@/components/modules/Speaker'
import QuestionsMixin from '@/mixins/QuestionsMixin'
import VoiceMixin from '@/mixins/VoiceMixin'
import moment from 'moment'
import {vtextToText} from '@/utility'

export default {
  name: 'questions.edit',
  model: {
    prop: 'question',
  },
  props: {
    question: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: 'add',
    },
  },
  components: {
    Speaker,
    TagsInput,
  },
  mixins: [QuestionsMixin, VoiceMixin],
  data() {
    return {
      dialog: false,
      errors: [],
      newQuestion: {
        type: 'question',
        question: '',
        answer: '',
        answer_kana: '',
        explanation: '',
        other_answers: [],
        tags: [],
        reputation: 1,
        status: 'draft',
      },
      changedInputs: {},
      answerPanels: [0],
      tempQuestionVoiceFilePath: '',
      formerQuestion: '',
      rules: {
        required: (value) => !!value || '必須入力です。',
      },
      statusItems: [
        {text: '下書き', value: 'draft'},
        {text: '公開', value: 'open'},
      ],
    }
  },
  computed: {
    canSave() {
      if (
        ['question', 'answer', 'answer_kana'].filter(
          (key) => !this.newQuestion[key].length
        ).length
      )
        return false
      if (this.mode === 'edit') {
        return Object.keys(this.changedInputs).length > 0
      }
      return true
    },
    reputationItems() {
      return [5, 4, 3, 2, 1].map((value) => {
        return {text: String(value), value}
      })
    },
  },
  watch: {
    newQuestion: {
      handler(obj) {
        if (this.mode === 'edit') {
          this.changedInputs = []
          Object.keys(obj)
            .filter((key) => {
              return String(obj[key]) !== String(this.question[key])
            })
            .map((key) => {
              this.changedInputs[key] = true
            })
          // console.log('watch', this.changedInputs)
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.mode === 'edit') {
      this.newQuestion = {...this.question}
    }
    this.formerQuestion = this.newQuestion.question
    console.log(`[Edit]created`, this.newQuestion)
  },
  async mounted() {
    console.log(`[Edit]mounted`)
    if (!this.tempQuestionVoiceFilePath.length) {
      if (this.mode === 'add') {
        const tempFilePath = `tempVoices/new_${moment().format(
          'YYYYMMDDHHmmssSSS'
        )}.mp3`
        await this.createVoiceFile(tempFilePath, '', {
          ssml: true,
        })
        this.tempQuestionVoiceFilePath = tempFilePath
        console.log(`[Edit]create tempfile ${this.tempQuestionVoiceFilePath}`)
      } else {
        const name =
          this.question.questionVoiceFile.replace(/^.*(Q\d+)\.mp3$/, '$1') +
          moment().format('YYYYMMDDHHmmssSSS')
        const tempFilePath = `tempVoices/${name}.mp3`
        const result = await this.copyVoiceFile(
          this.question.questionVoiceFile,
          tempFilePath
        )
        this.tempQuestionVoiceFilePath = tempFilePath
        console.log(`[Edit]copy temp to ${this.tempQuestionVoiceFilePath}`)
      }
    }
  },
  async beforeDestroy() {
    if (this.tempQuestionVoiceFilePath.length) {
      await this.deleteVoiceFile(this.tempQuestionVoiceFilePath)
      console.log(`[edit]temp file deleted.`)
    }
  },
  methods: {
    vtextToText,
    bgColor(key) {
      return this.mode === 'edit' && this.changedInputs[key]
        ? '#ffffc0'
        : 'white'
    },
    async speakerBeforePlay() {
      console.log('[edit]before play')
      await this.updateTempQuestionVoiceFile()
    },
    async updateTempQuestionVoiceFile() {
      if (this.newQuestion.question !== this.formerQuestion) {
        console.log('[edit]question changed, re-create voice.')
        await this.createVoiceFile(
          this.tempQuestionVoiceFilePath,
          this.newQuestion.question,
          {ssml: true}
        )
        this.formerQuestion = this.newQuestion.question
      }
    },
    async add(newQuestion) {
      try {
        console.log('[Detail]add', newQuestion)
        await this.addQuestion(newQuestion)
      } catch (e) {
        console.warn('[Detail]add', e)
        throw e
      } finally {
        this.$emit('mode', 'show')
        await this.loadQuestion()
      }
    },
    async update(newQuestion) {
      try {
        console.log('[Detail]update', newQuestion)
        await this.updateQuestion(newQuestion)
      } catch (e) {
        console.warn('[Detail]update', e)
        throw e
      } finally {
        this.$emit('mode', 'show')
        // await this.loadQuestion()
      }
    },
    async save() {
      try {
        console.log(`[Detail]save mode:${this.mode}`)
        this.$store.dispatch('loader/start')
        await this.updateTempQuestionVoiceFile()

        if (this.mode === 'add') {
          await this.addQuestion(this.newQuestion)
        } else {
          await this.updateQuestion(this.newQuestion)
        }
        this.$emit('input', this.newQuestion)

        if (this.tempQuestionVoiceFilePath.length) {
          if (!this.newQuestion.questionVoiceFile) {
            this.newQuestion.questionVoiceFile = `voices/Q${(
              '00000000' + this.newQuestion.id
            ).slice(-8)}.mp3`
          }
          await this.copyVoiceFile(
            this.tempQuestionVoiceFilePath,
            this.newQuestion.questionVoiceFile
          )
        }

        this.$emit('save', this.newQuestion)
      } catch (e) {
        this.errors.push('Internal error.')
        throw e
      } finally {
        this.$store.dispatch('loader/stop')
      }
    },
    cancel() {
      console.log(`[Edit]cancel`)
      this.$emit('cancel')
    },
    close() {
      console.log(`[Edit]close`)
      this.$emit('close')
    },
  },
}
</script>
