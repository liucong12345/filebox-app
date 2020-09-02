import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { i18nRender } from '@/locales'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  transformRequest: [
    function (data) {
      return JSON.stringify(data)
    }
  ],
  transformResponse: [
    function (data) {
      return JSON.parse(data)
    }
  ]
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    if (error.response.status === 400) {
      notification.error({
        key: 'message',
        message: 'Bad Request',
        description: ''
      })
    } else if (error.response.status === 403) {
      notification.error({
        key: 'message',
        message: 'Forbidden',
        description: ''
      })
    } else if (error.response.status === 404) {
      notification.error({
        key: 'message',
        message: 'NotFound',
        description: ''
      })
    } else if (error.response.status === 500) {
      notification.error({
        key: 'message',
        message: 'Error',
        description: ''
      })
    } else if (error.response.status === 401) {
      notification.error({
        key: 'message',
        message: i18nRender('authorization.expired'),
        description: i18nRender('authorization.expired.info')
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    } else {
      notification.error({
        key: 'message',
        message: error.response.status,
        description: error.response.data
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
