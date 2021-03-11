const env =
  process.env.NODE_ENV === 'development'
    ? 'dev'
    : process.env.NODE_ENV === 'staging'
    ? 'stage'
    : 'prod'
const conf = require(`./config.${env}`).default

export default {
  ...conf,
}
