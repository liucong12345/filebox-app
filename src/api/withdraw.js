import request from '@/utils/request'

const withdrawApi = {
  withdraw: '/cash',
  tax: '/cash/tax'
}

export default withdrawApi

export function withdrawReward (parameter) {
  return request({
    url: withdrawApi.withdraw,
    method: 'post',
    data: parameter
  })
}

export function getTax (parameter) {
  return request({
    url: withdrawApi.tax,
    method: 'get',
    data: parameter
  })
}
