import Vue from 'vue'
import Router from 'vue-router'

import PageHome from '../templates/pages/PageHome.vue'
import PageLinkPairing from '../templates/pages/PageLinkPairing.vue'
import PageFirmwareUpdate from '../templates/pages/link/firmware-update/FirmwareUpdateDevice.vue'
import PageLink from '../templates/pages/PageLink.vue'
import PageVision from '../templates/pages/PageVision.vue'
import PageVisionStream from '../templates/pages/vision/VisionStream.vue'
import PageError from '../templates/pages/PageError.vue'
import PageNotFound from '../templates/pages/PageNotFound.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      component: PageHome,
      meta: {
        title: 'edelkrone Web App'
      }
    },
    {
      name: 'link-pairing',
      path: '/link',
      component: PageLinkPairing,
      meta: {
        title: 'Link - edelkrone Web App'
      }
    },
    {
      name: 'firmware-update',
      path: '/firmware-update',
      component: PageFirmwareUpdate,
      meta: {
        title: 'Firmware Update - edelkrone Web App'
      }
    },
    {
      name: 'link',
      path: '/link/:id',
      component: PageLink,
      meta: {
        title: 'Link - edelkrone Web App'
      }
    },
    {
      name: 'vision',
      path: '/vision',
      component: PageVision,
      meta: {
        title: 'Vision Module - edelkrone Web App'
      }
    },
    {
      name: 'vision-stream',
      path: '/vision/:linkId',
      component: PageVisionStream,
      meta: {
        title: 'Vision Module - edelkrone Web App'
      }
    },
    {
      name: 'error',
      path: '/error',
      component: PageError,
      meta: {
        title: 'Error - edelkrone Web App'
      }
    },
    {
      name: '404',
      path: '*',
      component: PageNotFound,
      meta: {
        title: 'Not Found - edelkrone Web App'
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
