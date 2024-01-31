// module.exports = {
//   devServer: {
//     port: 8081,
//     disableHostCheck: true,
//     host: 'localhost'
//   }
// };



const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
      entry: "src/main.js",
      title: "TechpitNotion",
    }
  },
  transpileDependencies: true
})


// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   port: 8081,
//   disableHostCheck: true,
//   host: 'localhost'
// })


