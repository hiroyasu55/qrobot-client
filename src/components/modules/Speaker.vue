<template>
  <v-container class="speaker__wrapper">
    <v-row>
      <v-col cols="12" sm="8">
        <div class="d-flex pa-2">
          <v-icon v-if="audioState === 'loading'" large color="primary"
            >mdi-cloud-download
          </v-icon>
          <v-icon v-if="audioState === 'disabled'" large color="primary"
            >mdi-account-voice-off
          </v-icon>
          <v-icon
            v-if="!['loading', 'disabled'].includes(audioState)"
            large
            color="primary"
            >mdi-account-voice
          </v-icon>
          <v-progress-linear
            class="ml-3 mt-3"
            v-model="progressValue"
          ></v-progress-linear>
          <div class="py-3"></div>
        </div>
      </v-col>
      <v-col cols="12" sm="4">
        <div class="d-flex justify-end text-right mt-2">
          <v-btn icon :disabled="!canPlay" @click="play">
            <v-icon large color="primary">mdi-play-circle</v-icon>
          </v-btn>
          <v-btn icon :disabled="!canPause" @click="pause">
            <v-icon large color="primary">mdi-pause-circle</v-icon>
          </v-btn>
          <v-btn icon :disabled="!canStop" @click="stop">
            <v-icon large color="primary">mdi-stop-circle</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <!-- div>
      <span
        >{{ roundNumber(this.playTime, 2) }}/{{
          roundNumber(this.audioTime, 2)
        }}</span
      >
      <span class="ml-2"
        >{{ roundNumber(this.startTime, 2) }}-{{
          roundNumber(this.contextTime, 2)
        }}-{{ roundNumber(this.endTime, 2) }}</span
      >
      <span class="ml-2">contextState:{{ this.contextState }}</span>
      <span class="ml-2">{{ audioState }}</span>
      <span class="ml-2">file:{{ voiceFilePath }}</span>
    </div -->
  </v-container>
</template>

<style lang="scss" scoped>
.speaker__wrapper {
  background-color: lightcyan;
  padding: 2px;
}
</style>

<script>
import VoiceMixin from '@/mixins/VoiceMixin'
import {Storage} from 'aws-amplify'
import {roundNumber} from '@/utility'

export default {
  name: 'SpeakerModule',
  mixins: [VoiceMixin],
  props: {
    voiceFilePath: {
      type: String,
      default: '',
      // required: true,
    },
    beforePlay: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      context: null,
      source: null,
      audioBuffer: null,
      volumeControll: null,
      audioState: 'close',
      count: 0,
      interval: 0,
      contextTime: 0,
      startTime: 0,
      audioTime: 0,
      contextState: '',
    }
  },
  computed: {
    canPlay() {
      return ['ready', 'suspended', 'stopped'].includes(this.audioState)
    },
    canPause() {
      return ['running'].includes(this.audioState)
    },
    canStop() {
      return ['running', 'suspended'].includes(this.audioState)
    },
    playTime() {
      return this.audioState === 'stopped'
        ? 0
        : this.contextTime - this.startTime
    },
    endTime() {
      return this.startTime + this.audioTime
    },
    progressValue() {
      return this.audioTime > 0 ? (this.playTime / this.audioTime) * 100 : 0
    },
  },
  watch: {
    audioState(state, oldState) {
      console.log(`[Speaker]state:${oldState}->${state}`)
    },
    voiceFilePath(val, oldVal) {
      if (!oldVal.length && val.length) this.audioState = 'ready'
      console.log(`[Speaker]watch voiceFilePath:${val}`)
    },
  },
  created() {
    // for Safari
    Blob.prototype.arrayBuffer ??= function () {
      return new Response(this).arrayBuffer()
    }
  },
  async mounted() {
    console.log(`[Speaker]mounted`)
    if (this.voiceFilePath && this.voiceFilePath.length) {
      this.audioState = 'ready'
    }
  },
  async beforeDestroy() {
    console.log(`[Speaker]beforeDestroy`)
    this.stopTimer()
    if (this.source) this.source.stop(0)
    if (this.context) this.context.close()
  },
  methods: {
    roundNumber,
    createContext() {
      const context = new (window.AudioContext || window.webkitAudioContext)()
      context.onstatechange = function () {
        this.contextState = context.state
        console.log(`[Speaker]contextState:${context.state}`)
      }
      context.createGain = context.createGain || context.createGainNode

      this.volumeControl = context.createGain()
      this.volumeControl.connect(context.destination)

      return context
    },

    async load(filePath) {
      this.audioBuffer = null
      console.debug(`[Speaker]load ${filePath}`)
      try {
        this.audioState = 'loading'

        const result = await Storage.get(filePath, {
          download: true,
          contentType: 'audio/mp3',
          expires: 60,
        })
        const mimeType = result.ContentType
        if (mimeType !== 'audio/mp3') {
          console.warn(`Unexpected MIME Type ${mimeType}`)
          // throw new TypeError(`Unexpected MIME Type ${mimeType}`)
        }
        const data = new Blob([result.Body], {type: 'audio/mp3'})
        const buffer = await this.createAudioBuffer(data)
        return buffer
      } catch (err) {
        console.error('[load]err', err)
        throw err
      }
    },
    async createAudioBuffer(blob) {
      const buffer = await blob.arrayBuffer()
      return new Promise((resolve) => {
        this.context.decodeAudioData(buffer, (buffer) => {
          // console.debug(`[createAudioBuffer]`)
          resolve(buffer)
        })
      })
    },
    changeVolume() {
      if (!this.volumeControl) {
        return
      }
      // this.volumeControl.gain.value = volume.value
    },
    async createSource(buffer) {
      const source = this.context.createBufferSource()
      source.buffer = buffer
      source.loop = false
      source.loopStart = 0
      source.loopEnd = this.audioBuffer.duration
      source.connect(this.context.destination)
      source.connect(this.volumeControl)
      source.onended = async (event) => {
        console.debug(`[Speaker]source onended:${event.type}`)
        if (this.audioState === 'running') {
          this.audioState = 'stopping'
        }
        // await this.context.suspend()
        this.stopTimer()
        if (this.audioState === 'stopping') {
          this.audioState = 'stopped'
        }
        if (this.context) {
          this.contextTime = this.context.currentTime
          this.contextState = this.context.state
        }
      }
      return source
    },

    async play() {
      try {
        if (this.audioState === 'suspended') {
          console.debug(`[Speaker](${this.count})resume`)
          await this.context.resume()
        } else {
          this.audioState = 'loading'

          if (this.beforePlay) {
            console.debug(`[Speaker]beforPlay`)
            await this.beforePlay({filePath: this.filePath})
          }

          console.debug(`[Speaker]play`)

          if (this.context) {
            this.context.close()
          }
          this.context = this.createContext()
          this.audioBuffer = await this.load(this.voiceFilePath)
          this.audioTime = this.audioBuffer.duration

          this.source = await this.createSource(this.audioBuffer)
          if (this.context) {
            this.contextTime = this.context.currentTime
            this.contextState = this.context.state
          }
          this.startTime = this.contextTime
          // this.restartTime = 0

          this.changeVolume()
          this.count++
          console.log(`[Speaker](${this.count})play`)
          this.source.start(0, 0)
          // this.source.start(0, this.restartTime)
        }
        this.audioState = 'running'
        this.startTimer()
      } catch (err) {
        this.audioState = 'close'
        throw err
      }
    },
    async pause() {
      // console.log('pause!')
      if (this.audioState !== 'running') {
        console.warn(`cannot pause, audioState=${this.audioState}`)
        return
      }
      this.audioState = 'suspended'
      await this.context.suspend()
    },
    async stop() {
      if (!this.source) return
      console.log(`[Speaker]stop audioState=${this.audioState}`)
      if (this.audioState === 'suspended') {
        this.audioState = 'stopped'
        if (this.context) {
          this.contextTime = this.context.currentTime
          this.contextState = this.context.state
        }
      }
      this.source.stop(0)
    },
    startTimer() {
      this.interval = setInterval(() => {
        if (this.context) {
          this.contextTime = this.context.currentTime
          this.contextState = this.context.state
        }
      }, 100)
      console.log(`[Speaker]timer START`)
    },
    stopTimer() {
      console.log(`[Speaker]timer STOP`)
      clearInterval(this.interval)
      this.interval = 0
      if (this.context) {
        this.contextTime = this.context.currentTime
        this.contextState = this.context.state
      }
    },
  },
}
</script>
