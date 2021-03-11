import prodConfig from './config.prod'

export default {
  ...prodConfig,
  API_GATEWAY: 'qrobotapigateway',
  QUESTIONS_TABLE: 'QrobotQuestions-dev',
  SEQUENCES_TABLE: 'QrobotSequences-dev',
}
