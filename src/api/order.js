import request from '@/utils/request'

const orderApi = {
  master: '/order/master',
  buy: '/order/buy'
}

export function master () {
  return request({
    url: orderApi.master,
    method: 'get'
  })
}

export function buy (parameter) {
  return request({
    url: orderApi.buy,
    method: 'post',
    data: parameter
  })
}
