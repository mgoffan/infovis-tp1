// eslint-disable-next-line
importScripts('workbox-sw.prod.js')

/**
 * Create an instance of WorkboxSW.
 * Setting clientsClaims to true tells our service worker to take control as
 * soon as it's activated.
 */
// eslint-disable-next-line
const workboxSW = new WorkboxSW({ clientsClaim: true })

/**
 * DO NOT CREATE OR UPDATE THIS LIST BY HAND!
 *  Workbox will fill this array by files that are chosen by globPatterns.
 */
workboxSW.precache([
  {
    "url": "/app-c963baf5837140e443cb.min.js",
    "revision": "6f69cdfa37c755978dd8c3d4cf8c5f88"
  },
  {
    "url": "/favicon.ico",
    "revision": "c92b85a5b907c70211f4ec25e29a8c4a"
  },
  {
    "url": "/index.html",
    "revision": "8ad44d7fb39e5f8557f17f488cf7e7f3"
  },
  {
    "url": "vendor/vendors.js",
    "revision": "86c37f19bc3e96424dfd40f6a875b98b"
  },
  {
    "url": "/workbox-sw.prod.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  }
])

workboxSW.router.registerRoute('/*',
  workboxSW.strategies.staleWhileRevalidate(),
)
