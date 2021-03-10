import {API} from 'aws-amplify'
import moment from 'moment'
import VoiceMixin from '@/mixins/VoiceMixin'
import config from '@/config'

async function $_getSequence() {
  const params = {
    TableName: config.SEQUENCES_TABLE,
    Key: {name: config.QUESTIONS_TABLE},
    ExpressionAttributeNames: {
      '#seq': 'seq',
    },
    ExpressionAttributeValues: {
      ':addValue': 1,
    },
    UpdateExpression: 'SET #seq = seq + :addValue',
    ReturnValues: 'UPDATED_NEW',
  }
  // const response = await API.get(config.API_GATEWAY, path, getParams)
  // return response.Attributes.seq
}

function $_itemToQuestion(item) {
  const question = {...item}
  question.createdAt = moment(question.createdAt)
  question.updatedAt = moment(question.updatedAt)
  return question
}

function $_questionToItem(quesiton) {
  const item = {...quesiton}
  if (item.createdAt) item.createdAt = item.createdAt.toISOString()
  if (item.updatedAt) item.updatedAt = item.updatedAt.toISOString()
  return item
}

const now = moment()

export default {
  mixins: [VoiceMixin],
  async mounted() {
    console.log(`[QuestionsMixin]mounted`)
  },
  methods: {
    async listQuestions(params) {
      const path = `/questions`
      const options = {
        headers: {},
        response: true,
        queryStringParameters: {
          ...params,
        },
      }
      const response = await API.get(config.API_GATEWAY, path, options)
      // console.log(response)
      const questions = response.data.map((d) => $_itemToQuestion(d))
      return questions
    },

    async getQuestion(id) {
      const path = `/questions/${id}`
      const getParams = {
        headers: {},
        response: true,
      }
      const response = await API.get(config.API_GATEWAY, path, getParams)
      // console.log('response', response)
      if (response.data.length == 0) {
        return null
      }
      const question = $_itemToQuestion(response.data[0])
      return question
    },

    async addQuestion(question) {
      try {
        if (question.id) {
          throw new Error(`[QuestionMixin]addQuestionid must not be defined.`)
        }
        const now = moment()
        question.createdAt = now
        question.updatedAt = now
        const item = $_questionToItem(question)

        const path = `/questions`
        const postParams = {
          headers: {},
          response: true,
          body: {
            ...item,
          },
        }
        console.log('postParams', postParams)

        const response = await API.post(config.API_GATEWAY, path, postParams)
        if (response.data.error) {
          console.error('[QuestionMixin]addQuestion', response)
          throw new Error(`[QuestionMixin]addQuestion failed.`)
        }
        return true
      } catch (err) {
        console.log(`[QuestionMixin]updateQuestion failed.`, err)
        throw err
      }
    },

    async updateQuestion(question) {
      try {
        if (!question.id) {
          throw new Error(`updateQuestion:id not defined.`)
        }
        const now = moment()
        question.updatedAt = now
        const item = $_questionToItem(question)

        const path = `/questions`
        const postParams = {
          headers: {},
          response: true,
          body: {
            ...item,
          },
        }
        const response = await API.put(config.API_GATEWAY, path, postParams)
        console.log('PUT', response)
        if (response.data.error) {
          console.error(response)
          throw new Error(`[QuestionMixin]updateQuestion failed.`)
        }
        return question
      } catch (err) {
        console.log(`[QuestionMixin]updateQuestion failed.`, err)
        throw err
      }
    },

    async createQuestionVoiceFile(question) {
      if (!question.questionVoiceFile) {
        question.questionVoiceFile = `voices/Q${(
          '00000000' + question.id
        ).slice(-8)}.mp3`
      }
      await this.createVoiceFile(
        question.questionVoiceFile,
        question.question,
        {
          ssml: true,
        }
      )
      const result = await this.updateQuestion(question)
      console.log(`[QuestionMixin]createQuestionVoiceFile`, result)
      return result
    },
  },
}
