// eslint-disable-next-line no-undef
const path = require('path')

module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'O-ROBOT',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        config: path.resolve(`src/configs/config.${process.env.NODE_ENV}.js`),
      },
    },
  },
  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(1000).maxAssetSize(2000)
  },
}
