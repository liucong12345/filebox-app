import request from '@/utils/request'
export const uploadFileApi = {
  file: '/box/uploadfile',
  myspace: '/box/myspace',
  checkpeer: '/box/uploadfile/checkpeer',
  uploadpeer: '/box/uploadfile/uploadpeer',
  mergepeer: '/box/uploadfile/mergepeer',
  checkfile: '/box/uploadfile/checkfile',
  checkmd5: '/box/uploadfile/checkmd5'
}
export function checkpeer (parameter) {
  return request({
    url: uploadFileApi.checkpeer,
    method: 'post',
    data: parameter
  })
}
export function uploadpeer (parameter) {
  return request({
    url: uploadFileApi.uploadpeer,
    method: 'post',
    data: parameter
  })
}
export function mergepeer (parameter) {
  return request({
    url: uploadFileApi.mergepeer,
    method: 'post',
    data: parameter
  })
}
export function getMyspace (parameter) {
  return request({
    url: uploadFileApi.myspace,
    method: 'get',
    params: parameter
  })
}

export function checkfile (parameter) {
  return request({
    url: uploadFileApi.checkfile,
    method: 'post',
    data: parameter
  })
}

export function checkmd5 (parameter) {
  return request({
    url: uploadFileApi.checkmd5,
    method: 'post',
    data: parameter
  })
}

export function uploadFiles (files) {
  var fd = new FormData()
  for (var i = 0; i < files.length; i++) {
    const file = files[i].file
    fd.append('myFile', file)
    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploadFileApi.file, true)
    xhr.upload.addEventListener('progress', function (e) {
    files[i].uploadPercentage = Math.round((e.loaded * 100) / e.total)
  }, false)
  xhr.send(fd)
}
}
