import request from '@/utils/request'

const userInfoApi = {
  info: '/user/info',
  space: '/user/space'
}

export function getUserInfo (parameter) {
  return request({
    url: userInfoApi.info,
    timeout: 0,
    method: 'get'
  })
}

export function getUserSpaceInfo () {
  return request({
    url: userInfoApi.space,
    method: 'get'
  })
}
