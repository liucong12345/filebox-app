import Notification from 'ant-design-vue/lib/vc-notification'
import classnames from 'classnames'
var prefixCls = 'm-toast'

function getMessageInstance (positionType, callback) {
  var _classnames

  Notification.newInstance({
    prefixCls: prefixCls,
    style: {},
    // clear rmc-notification default style
    transitionName: 'am-fade',
    class: classnames((_classnames = {}, _classnames[prefixCls + '-' + positionType] = true, _classnames))
  }, function (notification) {
    return callback && callback(notification)
  })
}

function notice (_content, duration, positionType) {
  if (duration === void 0) {
    duration = 3
  }
  if (positionType === void 0 || !['center', 'top', 'bottom'].includes(positionType)) {
    positionType = 'center'
  }
  var messageInstance = {
    $destroy: function $destroy () {
      console.error('Toast is dad')
    },
    destroyed: false
  }

  messageInstance.destroy = function () {
    if (!messageInstance.destroyed) {
      messageInstance.destroyed = true
      messageInstance.$destroy()
    }
  }

  messageInstance.hide = function () {
    if (typeof messageInstance.destroy === 'function') {
      messageInstance.destroy()
    }
  }

  getMessageInstance(positionType, function (notification) {
    messageInstance.$destroy = notification.destroy
    messageInstance.component = notification.component
    notification.notice({
      duration: duration,
      style: {},
      onClick: function onClick () {},
      content: function content (h) {
        return h('div', {
          'class': prefixCls + '-text',
          'attrs': {
            'role': 'alert',
            'aria-live': 'assertive'
          }
        }, [h('div', [_content])])
      },
      closable: true,
      onClose: function onClose () {
        if (typeof notification.destroy === 'function') {
          notification.destroy()
        }
        messageInstance.destroy = null
      }
    })
  })
  return messageInstance
}

export default {
  install: function install (any) {},
  show: function show (content, duration, positionType) {
    return notice(content, duration, positionType)
  }
}
