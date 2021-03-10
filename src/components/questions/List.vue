<template>
  <v-main>
    <v-container>
      <v-alert v-if="errors.length > 0" type="error">
        <p v-for="(error, i) in errors" :key="i">{{ error }}</p>
      </v-alert>

      <v-row justify="center">
        <v-col cols="12" lg="10">
          <v-expansion-panels multiple accordion v-model="panels">
            <v-expansion-panel>
              <v-expansion-panel-header>検索</v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content class="pa-4">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="searchItem.word"
                      label="検索ワード"
                      append-icon="mdi-magnify"
                      dense
                      single-line
                      hide-details
                      @change="filter"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      v-model="searchItem.reputation"
                      label="評価"
                      dense
                      :items="reputationItems"
                      @change="filter"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <TagsInput
                      v-model="searchItem.tags"
                      label="タグ"
                      dense
                      chipColor="green"
                      @input="filter"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-card v-if="showCard">
            <template v-if="deviceType == 'pc'">
              <v-card-title>
                問題
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="add">追加</v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <Pagination
                  :page.sync="page"
                  :page-count.sync="pageCount"
                  :items-per-page.sync="itemsPerPage"
                  :items-length="questions.length"
                />
                <v-data-table
                  :headers="headers.pc"
                  :items="questions"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :search="search"
                  @page-count="pageCount = $event"
                  @click:row="onRowClick"
                  :footerProps="footerProps"
                  class="questions-table elevation-1"
                  hide-default-footer
                  no-data-text="データがありません。"
                  :custom-sort="customSort"
                  style="width: 100%; overflow-x: scroll; whitespace: nowrap"
                >
                  <template v-slot:[`item.id`]="{item}">
                    <div class="text-left">{{ item.id }}</div>
                  </template>
                  <template v-slot:[`item.question`]="{item}">
                    {{ shortenText(vtextToText(item.question), 20) }}
                    <span v-if="!item.questionVoiceFile" class="ml-2">!</span>
                  </template>
                  <template v-slot:[`item.reputation`]="{item}">
                    <v-rating
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      half-icon="mdi-star-half-full"
                      length="5"
                      x-small
                      color="secondary"
                      :value="item.reputation"
                    ></v-rating>
                  </template>
                  <template v-slot:[`item.status`]="{item}">
                    {{ statusText(item.status) }}
                  </template>
                </v-data-table>
              </v-card-text>
            </template>

            <template v-if="deviceType == 'mobile'">
              <v-card-text>
                <v-data-table
                  :headers="headers.mobile"
                  :items="questions"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  @page-count="pageCount = $event"
                  :search="search"
                  class="questions-table elevation-1"
                  hide-default-header
                  hide-default-footer
                >
                  <template v-slot:item="{item}">
                    <tr @click="onRowClick(item)">
                      <td>
                        <v-row class="pt-2">
                          <v-col>
                            {{ shortenText(vtextToText(item.question, 15)) }}
                          </v-col>
                        </v-row>
                        <v-row class="pb-2">
                          <v-col class="text-right">A. {{ item.answer }}</v-col>
                        </v-row>
                      </td>
                    </tr>
                  </template>
                </v-data-table>

                <Pagination
                  :page.sync="page"
                  :page-count.sync="pageCount"
                  :items-per-page.sync="itemsPerPage"
                  class="mt-2"
                />
              </v-card-text>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <QuestionDialog
      v-model="dialog"
      :mode.sync="dialogMode"
      :question.sync="question"
      @add="addQuestion"
      @update="updateQuestion"
    />
  </v-main>
</template>

<style lang="scss" scope>
.v-rating {
  .v-icon {
    padding: 2px !important;
  }
}
</style>

<script>
import QuestionDialog from './QuestionDialog'
import TagsInput from '@/components/modules/TagsInput'
import Pagination from '@/components/modules/Pagination'
import QuestionsMixin from '@/mixins/QuestionsMixin'
import {shortenText, vtextToText} from '@/utility'

export default {
  name: 'Question',
  components: {
    TagsInput,
    Pagination,
    QuestionDialog,
  },
  mixins: [QuestionsMixin],
  data() {
    return {
      errors: [],
      panels: [],
      headers: {
        pc: [
          {text: '#', value: 'id', width: 20},
          {text: '問題', value: 'question', width: 400},
          {text: '解答', value: 'answer', width: 200},
          {text: '評価', value: 'reputation', width: 30},
          {text: '状態', value: 'status', width: 100},
        ],
        mobile: [
          {text: '#', value: 'id'},
          {text: 'Q', value: 'question'},
          {text: 'A', value: 'answer'},
          // {text: 'R', value: 'reputation'},
        ],
      },
      footerProps: {
        'items-per-page-text': '表示数',
        'items-per-page-options': [10, 20, 50],
        'show-first-last-page': true,
        'show-current-page': true,
      },
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      questions: [],
      question: null,
      search: '',
      searchItem: {
        word: '',
        reputation: 0,
        tags: [],
      },
      windowWidth: 0,
      deviceType: 'pc',
      dialog: false,
      dialogMode: 'show',
      editDialog: false,
    }
  },
  computed: {
    showCard() {
      return true
    },
    reputationItems() {
      const items = [5, 4, 3, 2, 1].map((value) => {
        return {text: '' + value, value}
      })
      items.push({text: 'ALL', value: -1})
      return items
    },
  },
  watch: {},
  async mounted() {
    this.errors = []
    window.onresize = this.onResize
    this.onResize()
    this.questions = await this.loadQuestions({})
  },
  methods: {
    shortenText,
    vtextToText,
    statusText(value) {
      return value === 'open'
        ? '公開'
        : value === 'draft'
        ? '下書き'
        : `[${value}]`
    },
    onResize() {
      this.windowWidth = window.innerWidth
      this.deviceType = window.innerWidth < 600 ? 'mobile' : 'pc'
    },
    async loadQuestions(params = {}) {
      try {
        this.$store.dispatch('loader/start')
        let questions = await this.listQuestions()
        if (params.reputation && params.reputation > 0) {
          questions = questions.filter(
            (q) => q.reputation === params.reputation
          )
        }
        if (params.tags && params.tags.length > 0) {
          questions = questions.filter(
            (q) =>
              (q.tags || []).filter((t) => params.tags.includes(t)).length > 0
          )
        }
        questions.sort((q1, q2) => q1.id - q2.id)
        return questions
      } catch (e) {
        console.error(e)
        this.errors.push('Internal error.')
        return []
      } finally {
        this.$store.dispatch('loader/stop')
      }
    },

    async filter() {
      console.log(
        `[List]filter rep=${this.searchItem.reputation} tags=${this.searchItem.tags}`
      )
      const params = {
        reputation: this.searchItem.reputation,
        tags: this.searchItem.tags,
      }
      this.loading = true
      this.questions = await this.loadQuestions(params)
      this.search = this.searchItem.word
      this.loading = false
    },

    customSort(items, index, isDesc) {
      items.sort((q1, q2) => {
        const name = index[0]
        let comp
        if (name === 'answer') {
          comp = q1.answer_kana < q2.answer_kana
        } else if (name === 'reputation') {
          comp = q1.reputation > q2.reputation
        } else {
          comp = q1[name] < q2[name]
        }
        return isDesc[0] ? (comp ? 1 : -1) : comp ? -1 : 1
      })
      return items
    },
    onRowClick(question) {
      this.question = question
      this.dialogMode = 'show'
      this.dialog = true
    },
    addQuestion(question) {
      this.questions.push(question)
    },
    updateQuestion(question) {
      const newQuestions = [...this.questions]
      const index = newQuestions.findIndex((q) => q.id === question.id)
      newQuestions[index] = question
      this.questions = newQuestions
    },
    add() {
      this.dialogMode = 'add'
      this.dialog = true
    },
  },
}
</script>
