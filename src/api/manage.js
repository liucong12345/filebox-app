import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  file: '/box/file',
  withdrawList: '/wallet',
  pledge: '/box/pledge',
  pledgeConfrim: '/box/pledge/pledgeConfrim',
  pledgeDetail: '/box/pledge/detail',
  myspaceInfo: '/box/myspaceinfo'
}

export default api

export function getFileList (parameter) {
  return request({
    url: api.file,
    method: 'get',
    params: parameter
  })
}
export function getPledgeList (parameter) {
  return request({
    url: api.pledge,
    method: 'get',
    params: parameter
  })
}
export function getPledgeConfrim (parameter) {
  return request({
    url: api.pledgeConfrim,
    method: 'get',
    params: parameter
  })
}
export function getPledgeDetail (parameter) {
  return request({
    url: api.pledgeDetail,
    method: 'get',
    params: parameter
  })
}
export function getMyspaceInfo (parameter) {
  return request({
    url: api.myspaceInfo,
    method: 'get',
    params: parameter
  })
}
export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function getWithdrawList (parameter) {
  return request({
    url: api.withdrawList,
    method: 'get',
    params: parameter
  })
}
