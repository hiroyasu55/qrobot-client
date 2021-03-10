import {API} from 'aws-amplify'
import config from '@/config'
import {textToSsml} from '@/utility'

export default {
  async mounted() {
    console.log(`[VoiceMixin]mounted`)
  },
  methods: {
    async createVoiceFile(filePath, text, params = {}) {
      if (text === undefined) {
        throw new Error(`[createVoiceFile]Text is not defined.`)
      }
      let voiceText
      if (params.ssml) {
        voiceText = textToSsml(text)
        if (!voiceText) {
          console.warn('Invalid SSML text', text)
          return false
        }
      } else {
        voiceText = text
      }
      const pollyParams = {
        TextType: params.ssml ? 'ssml' : 'text',
        VoiceId: params.voiceId || 'Mizuki', // Mizuki / Takumi
      }
      const path = `/voice/create`
      const options = {
        headers: {},
        response: true,
        body: {
          text: String(voiceText),
          filePath,
          params: {
            polly: pollyParams,
          },
        },
      }
      const result = await API.post(config.API_GATEWAY, path, options)
      if (result.data.error) {
        console.error('[VoiceMixin]Error', result.data.error)
        throw new Error('[VoiceMixin]copyVoiceFile failed.')
      }
      return result.data
    },
    async copyVoiceFile(filePath, newFilePath) {
      console.log(`[VoiceMixin]copy ${filePath}->${newFilePath}`)
      const path = `/voice/copy`
      const copyParams = {
        headers: {},
        response: true,
        body: {
          filePath,
          newFilePath,
        },
      }
      const response = await API.post(config.API_GATEWAY, path, copyParams)
      if (response.data.error) {
        console.error('[VoiceMixin]copyVoiceFile Error', response.data.error)
        throw new Error('[VoiceMixin]copyVoiceFile failed.')
      }
      return true
    },
    async deleteVoiceFile(filePath, newFilePath) {
      console.log(`[VoiceMixin]delete ${filePath}`)
      const path = `/voice/delete`
      const deleteParams = {
        headers: {},
        response: true,
        body: {
          filePath,
        },
      }
      const result = await API.post(config.API_GATEWAY, path, deleteParams)
      if (result.data.error) {
        console.error('[VoiceMixin]deleteVoiceFile Error', result.data.error)
        throw new Error('[VoiceMixin]deleteVoiceFile failed.')
      }
      return result.data
    },
  },
}
