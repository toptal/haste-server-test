const path = require('path')
const withTM = require('next-transpile-modules')([
  '@toptal/picasso',
  '@toptal/site-acq-ui-library'
])

const plugins = [withTM]

if (process.env.NODE_ENV === 'development') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })

  plugins.push(withBundleAnalyzer)

  const mock = require('mock-require')
  const QUILL_MOCK_PATH = path.join(__dirname, '/lib/patched-quill')

  mock('quill', QUILL_MOCK_PATH)
  mock('quill-paste-smart', QUILL_MOCK_PATH)
}

const transformClassNamesToCamelCase = config => {
  const rules = config.module.rules
    .find(rule => typeof rule.oneOf === 'object')
    .oneOf.filter(rule => Array.isArray(rule.use))

  rules.forEach(rule => {
    rule.use.forEach(moduleLoader => {
      if (
        typeof moduleLoader === 'object' &&
        moduleLoader.loader.includes('css-loader') &&
        typeof moduleLoader.options.modules === 'object'
      ) {
        moduleLoader.options = {
          ...moduleLoader.options,
          modules: {
            ...moduleLoader.options.modules,
            exportLocalsConvention: 'camelCase'
          }
        }
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addSVGLoader = config => {
  config.module.rules.push({
    test: /\.svg$/i,
    issuer: { and: [/\.(js|ts|md)x?$/] },
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          prettier: false,
          svgo: true,
          svgoConfig: {
            plugins: [{ removeViewBox: false }],
            floatPrecision: 2
          },
          titleProp: true
        }
      }
    ]
  })
}

const noindexEnabled =
  typeof process.env.NEXT_PUBLIC_SEARCH_INDEXING === 'undefined'

const buildHeaders = async () => {
  const headers = []

  if (noindexEnabled) {
    headers.push({
      source: '/:path*',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow, nosnippet, noarchive'
        }
      ]
    })
  }

  return headers
}

const nextConfig = {
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], // this is to use `@import 'base.scss';` in scss files
    additionalData: `$basePath: "${process.env.NEXT_PUBLIC_BASE_PATH || ''}";`
  },
  env: {
    noindexEnabled
  },
  webpack: config => {
    transformClassNamesToCamelCase(config)

    /**
     * Uncomment and `yarn add -D @svgr/webpack` to use SVG in the project
     *
     * Use as:
     *
     * import Icon from '~/lib/icons/icon.svg'
     *
     * export default () => {
     *   return <div><Icon height="10" width="10" fill="pink" /></div>
     * }
     */
    // addSVGLoader(config)
    return config
  },

  headers: buildHeaders
}

module.exports = () => {
  return plugins.reduce((config, next) => next(config), nextConfig)
}
