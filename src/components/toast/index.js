import MToast from './src'
import './style'

MToast.install = function (Vue) {
  if (!Vue.prototype.$mtoast) {
    Object.defineProperties(Vue.prototype, {
      $mtoast: {
        get: function get () {
          return MToast
        }
      }
    })
  }
}

export default MToast
