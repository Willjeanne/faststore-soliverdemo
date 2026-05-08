
module.exports = {
  seo: {
  "title": "FastStore",
  "description": "A fast and performant store framework",
  "titleTemplate": "%s | FastStore",
  "author": "FastStore"
},

  // Theming
  theme: 'lala-berlin',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: process.env.NEXT_PUBLIC_STORE_ID || "soliverdemo",
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: "EUR",
      symbol: "€",
    },
    locale: "fr-FR",
    channel: '{"salesChannel":1,"regionId":""}',
    country: "FRA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs (1er bloc — écrasé par le 2nd, conservé par mimétisme du pattern demomarkets)
  storeUrl: "https://soliverdemo.vtex.app",
  secureSubdomain: "https://soliverdemo.vtex.app/",
  checkoutUrl: "https://soliverdemo.vtex.app/checkout",
  loginUrl: "https://soliverdemo.vtex.app/api/io/login",
  accountUrl: "https://soliverdemo.vtex.app/api/io/account",

  // Production URLs (2nd bloc — c'est celui qui est réellement appliqué)
  storeUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://soliverdemo.vtex.app',

  secureSubdomain: 'https://soliverdemo.myvtex.com',

  checkoutUrl: process.env.NODE_ENV === 'development'
    ? 'https://soliverdemo.myvtex.com/checkout'
    : 'https://soliverdemo.myvtex.com/checkout',

  loginUrl: process.env.NODE_ENV === 'development'
    ? 'https://soliverdemo.myvtex.com/api/io/login'
    : 'https://soliverdemo.vtex.app/api/io/login',

  accountUrl: process.env.NODE_ENV === 'development'
    ? 'https://soliverdemo.myvtex.com/api/io/account'
    : 'https://soliverdemo.vtex.app/api/io/account',

  // TODO: À remplir avec les slugs soliverdemo (PDP + PLP) une fois FastStore déployé
  previewRedirects: {
    home: '/',
    plp: "/",
    search: "/s?q=",
    pdp: "/",
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      // TODO: À remplir avec les slugs soliverdemo
      home: '/',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      // TODO: À remplir avec les slugs soliverdemo
      home: '/',
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: "",
  },

  experimental: {
    nodeVersion: 18,
    cypressVersion: 12,
  },

  vtexHeadlessCms: {
    webhookUrls: [
      "https://soliverdemo.myvtex.com/cms-releases/webhook-releases",
    ],
  },
}
