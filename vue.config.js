// eslint-disable-next-line no-undef
module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'O-ROBOT',
    },
  },
  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(2000).maxAssetSize(2000)
  },
}
