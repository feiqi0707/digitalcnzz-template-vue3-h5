/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsImportPluginFactory = require('ts-import-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const defaultSettings = require('./src/config/index.ts')
const config = require('./src/config/env.' + process.env.NODE_ENV + '.ts')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pxtoviewport = require('postcss-px-to-viewport')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const name = config.title || 'vue3 mobile template'

// eslint-disable-next-line @typescript-eslint/no-var-requires

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

function resolve (dir) {
  return path.join(__dirname, dir)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const AliOSSPlugin = require('webpack-alioss-plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require('autoprefixer')
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: !IS_PROD,
  productionSourceMap: false,
  devServer: {
    port: 9020,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'https://localhost:9090/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  parallel: false,
  css: {
    extract: IS_PROD, //是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    sourceMap: false,
    loaderOptions: {
      //配置less主题
      less: {
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "./src/theme/var.less";`
          }
        }
      },
      scss: {
        prependData: `
          @import "@/assets/scss/mixin.scss";
          @import "@/assets/scss/variables.scss";
          `
      },
      //配置路vw vm适配
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375
          })
        ]
      }
    }
  },
  //配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@config': resolve('src/config'),
        '@components': resolve('src/components'),
        '@api': resolve('src/api'),
        '@view': resolve('src/view')
      }
    }
  },

  chainWebpack: config => {
    config.name = name
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // if (IS_PROD && process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID) {
    //   config.plugin('alioss').use(AliOSSPlugin, [
    //     {
    //       ossBaseDir: '/digitalcnzz/pretest/',
    //       project: 'digitalcnzz-demots-h5', // 发布前把xxxx换成当前项目的名称
    //       retry: 0,
    //       gzip: true,
    //       exclude: /.*\.$/,
    //       removeMode: false
    //     }
    //   ])
    // }

    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: name => `${name}/style/less`
                // style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
    config.when(!IS_PROD, config => config.devtool('cheap-source-map'))
    config.when(IS_PROD, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
