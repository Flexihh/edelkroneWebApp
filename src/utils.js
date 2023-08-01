import axios from 'axios'
import store from './store'

import lowerCase from 'lodash/lowerCase'

export const connection = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain'
  },
  timeout: 3000
})
connection.interceptors.request.use(config => {
  return config
}, error => {
  const errorMessage = JSON.parse(`${JSON.stringify(error)}`)
  if (lowerCase(errorMessage.message) !== 'request aborted') {
    store.commit('app/SET_ERROR_MESSAGE', errorMessage)
    if (store.getters['app/devMode']) {
      consoleLogGroup('ERROR_MESSAGE', errorMessage, true, 0)
    }
  }
  return Promise.reject(error)
})
connection.interceptors.response.use(response => {
  return response
}, error => {
  const errorMessage = JSON.parse(`${JSON.stringify(error)}`)
  if (lowerCase(errorMessage.message) !== 'request aborted') {
    store.commit('app/SET_ERROR_MESSAGE', errorMessage)
    if (store.getters['app/devMode']) {
      consoleLogGroup('ERROR_MESSAGE', errorMessage, true, 0)
    }
  }
  return Promise.reject(error)
})

export function statusMessage (value) {
  if (value === 'idle') {
    return 'Idle'
  } else if (value === 'joystickMove') {
    return 'Joystick is moving...'
  } else if (value === 'keyposeMove') {
    return 'Keypose is moving...'
  } else if (value === 'realTimeMove') {
    return 'Real time is moving...'
  } else if (value === 'focusCalibration') {
    return 'Searching lens limits...'
  } else if (value === 'sliderCalibration') {
    return 'Slider is calibrating...'
  } else if (value === 'unsupportedActivity') {
    return 'Unsupported activity...'
  } else {
    return value
  }
}

export function setupName (value) {
  if (value === 'panOnly') {
    return 'Pan'
  } else if (value === 'tiltOnly') {
    return 'Tilt'
  } else if (value === 'panTilt') {
    return 'Pan & Tilt'
  } else if (value === 'slideOnly') {
    return 'Slide'
  } else if (value === 'dollyOnly') {
    return 'Slide'
  } else if (value === 'panAndSlide') {
    return 'Pan & Slide'
  } else if (value === 'tiltAndSlide') {
    return 'Tilt & Slide'
  } else if (value === 'panAndDolly') {
    return 'Pan & Slide'
  } else if (value === 'tiltAndDolly') {
    return 'Tilt & Slide'
  } else if (value === 'panTiltAndSlide') {
    return 'Pan, Tilt & Slide'
  } else if (value === 'panTiltAndDolly') {
    return 'Pan, Tilt & Slide'
  } else if (value === 'panAndJib') {
    return 'Pan & Slide'
  } else if (value === 'tiltAndJib') {
    return 'Tilt & Slide'
  } else if (value === 'panTiltAndJib') {
    return 'Pan, Tilt & Slide'
  } else if (value === 'jibOnly') {
    return 'Slide'
  } else if (value === 'panAndJibPlus') {
    return 'Pan, Jib Pan & Jib Tilt'
  } else if (value === 'tiltAndJibPlus') {
    return 'Tilt, Jib Pan & Jib Tilt'
  } else if (value === 'panTiltAndJibPlus') {
    return 'Pan, Tilt, Jib Pan & Jib Tilt'
  } else if (value === 'jibPlusOnly') {
    return 'Jib Pan & Jib Tilt'
  } else if (value === 'followFocusOnly') {
    return 'Focus'
  } else {
    return value
  }
}

export function productName (value) {
  if (value === 'linkAdapter') {
    return 'edelkrone Link Adapter'
  } else if (value === 'stopMotionModule') {
    return 'Stop Motion Module'
  } else if (value === 'headOne') {
    return 'HeadONE'
  } else if (value === 'panPro') {
    return 'Pan PRO'
  } else if (value === 'headPlus') {
    return 'HeadPLUS'
  } else if (value === 'headPlusPro') {
    return 'HeadPLUS PRO'
  } else if (value === 'headPlusV2') {
    return 'HeadPLUS <span>v2</span>'
  } else if (value === 'headPlusProV2') {
    return 'HeadPLUS <span>v2</span> PRO'
  } else if (value === 'slideModuleV1') {
    return 'Slide Module <span>v1</span>'
  } else if (value === 'slideModule') {
    return 'Slide Module <span>v2</span>'
  } else if (value === 'slideModuleV3') {
    return 'Slide Module <span>v3</span>'
  } else if (value === 'sliderOne') {
    return 'SliderONE <span>v2</span>'
  } else if (value === 'sliderOnePro') {
    return 'SliderONE PRO <span>v2</span>'
  } else if (value === 'surfaceOne') {
    return 'SurfaceONE'
  } else if (value === 'dollyOne') {
    return 'DollyONE'
  } else if (value === 'dollyPlus') {
    return 'DollyPLUS'
  } else if (value === 'dollyPlusPro') {
    return 'DollyPLUS PRO'
  } else if (value === 'jibOne') {
    return 'JibONE'
  } else if (value === 'jibOneV2') {
    return 'JibONE <span>v2</span>'
  } else if (value === 'focusPlusPro') {
    return 'FocusPLUS PRO'
  } else {
    return value
  }
}

export function timeout (start, value) {
  const responseTime = +new Date() - start
  if (responseTime < value) {
    return value - responseTime
  } else {
    return value
  }
}

export function rssiLevel (value) {
  if (value < -80) {
    return 1
  } else if (value < -75) {
    return 2
  } else if (value < -70) {
    return 3
  } else {
    return 4
  }
}

export function consoleLogGroup (title, data, error, responseTime) {
  let _title = title
  if (title === 'deviceList' ||
      title === 'visionList' ||
      title === 'bundleStatus' ||
      title === 'wirelessProductList' ||
      title === 'canbusProductList' ||
      title === 'wirelessPairingStatus' ||
      title === 'canbusPairingStatus' ||
      title === 'linkDeviceFirmwareUpdateStatus' ||
      title === 'linkRadioFirmwareUpdateStatus') {
    if (data === null) {
      _title = `EMPTY: ${_title}`
    }
  }
  let color = '#000000'
  let background = '#ffffff'
  if (title === 'deviceList' || title === 'visionList') {
    color = '#ffffff'
    background = '#000000'
  }
  if (responseTime > 100) {
    if (title === 'visionList') {
      if (responseTime > 500) {
        color = '#ff0000'
      } else {
        color = '#ffffff'
      }
    } else {
      color = '#ff0000'
    }
  }
  if (error) {
    color = '#ffffff'
    background = '#ff0000'
  }
  if (title === 'bundleStatus' && data !== null) {
    const timestampEpochDifference = +new Date() - data.timestampEpoch
    if (timestampEpochDifference > 1000) {
      color = '#ff0000'
    }
    if (error) {
      color = '#ffffff'
      background = '#ff0000'
    }
    if (_title.includes('EMPTY')) {
      color = '#ffffff'
      background = '#979797'
    }
    console.groupCollapsed(`%c${_title} (responseTime: ${responseTime}ms, timestampEpochDifference: ${timestampEpochDifference}ms)`, `background: ${background}; color: ${color}; font-size: 12px; font-weight: 700; padding: 0 4px;`)
  } else {
    if (_title.includes('EMPTY')) {
      color = '#ffffff'
      background = '#979797'
    }
    console.groupCollapsed(`%c${_title} (responseTime: ${responseTime}ms)`, `background: ${background}; color: ${color}; font-size: 12px; font-weight: 700; padding: 0 4px;`)
  }
  console.log(data)
  console.groupEnd()
}

export default {
  connection,
  statusMessage,
  setupName,
  productName,
  timeout,
  rssiLevel,
  consoleLogGroup
}
