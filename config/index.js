const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const config = require(`./config.${env}.json`)

module.exports = Object.freeze({
  ...config,
})
