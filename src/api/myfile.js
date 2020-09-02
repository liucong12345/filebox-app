import axios from 'axios'
import request from '@/utils/request'
import moment from 'moment'

export const ONE_BLOCK_SIZE = 1024 * 1024

const myFileApi = {
  file: '/box/file',
  deleteFile: '/box/file/delete',
  hashSearch: '/box/file/hash'
}

export function getFileList (parameter) {
  return request({
    url: myFileApi.file,
    method: 'get',
    params: parameter
  })
}

export function getFileForHash (parameter) {
  return request({
    url: myFileApi.hashSearch,
    method: 'get',
    params: parameter
  })
}

export function downloadFiles (files, add) {
  files.forEach(val => {
    if (!val) {
      return
    }
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const info = {
      source: source,
      name: val.fileName,
      url: val.downloadUrl,
      endDate: '',
      cancel: (msg) => { info.statusCode = '5'; source.cancel(msg) },
      pause: (msg) => { info.statusCode = '4'; source.cancel(msg) },
      start: () => { info.statusCode = '0'; downloadFile(info) },
      total: val.size,
      // 最后下载的大小
      loaded: 0,
      allLoaded: 0, // 总块大小
      // 速度计算
      blockLoaded: 0,
      lastBlockLoaded: 0,
      lastTimeStamp: Date.now(),
      speed: 0,
      // 0:准备下载 1：正在下载 2：下载完成 3：下载失败 4：下载暂停 5：下载取消
      // 11：分块正在下载 12：分块下载完成
      statusCode: '0',
      // 文件分块下载
      blockCnt: Math.ceil(val.size / ONE_BLOCK_SIZE),
      blockIdx: 1,
      loadedBlockCnt: 0,
      // 已下载列表用
      isChecked: false,
      // 文件数据
      data: null
    }
    add(info)
    // downloadFile(info)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = info.url + '?filename=' + info.name
    link.target = '_blank'
    link.setAttribute('download', info.name)// 文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
    info.statusCode = '2'
  })
}

export function downloadFile (info) {
  if (info.statusCode !== '0' && info.statusCode !== '1') {
    return
  }
  info.statusCode = '11'
  info.blockLoaded = 0
  info.lastBlockLoaded = 0
  info.lastTimeStamp = Date.now()
  const bsf = (info.blockIdx - 1) * ONE_BLOCK_SIZE
  let bst = info.blockIdx * ONE_BLOCK_SIZE - 1
  if (bst >= info.total) {
    bst = info.total - 1
  }
  axios({
    method: 'get',
    url: info.url,
    responseType: 'blob',
    cancelToken: info.source.token,
    headers: { 'Range': 'bytes=' + bsf + '-' + bst },
    validateStatus: function (status) {
      return status === 200 || status === 206
    },
    onDownloadProgress: function (progressEvent) {
      info.blockLoaded = progressEvent.loaded
      const tmpLoaded = info.allLoaded + progressEvent.loaded
      if (tmpLoaded >= info.loaded) {
        info.loaded = tmpLoaded
      }
      info.timeStamp = progressEvent.timeStamp
      const nt = Date.now()
      if (nt - info.lastTimeStamp >= 1000) {
        const nl = info.blockLoaded
        info.speed = (nl - info.lastBlockLoaded) / (nt - info.lastTimeStamp) * 1000
        info.lastBlockLoaded = nl
        info.lastTimeStamp = nt
      }
    }
  }).then(res => {
    info.allLoaded = info.allLoaded + res.data.size
    info.data = new Blob(info.data ? [info.data, res.data] : [res.data])
    info.loadedBlockCnt++
    info.blockIdx++
    info.statusCode = '12'
    if (info.loadedBlockCnt === info.blockCnt) {
      info.endDate = moment(Date.now()).format('YYYY-MM-DD HH:mm')
      info.statusCode = '2'
      const url = window.URL.createObjectURL(info.data)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', info.name)// 文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    } else {
      info.statusCode = '1'
      downloadFile(info)
    }
  }).catch(error => {
    if (!axios.isCancel(error)) {
      info.statusCode = '3'
    }
  })
}

export function deleteFiles (parameter) {
  return request({
    url: myFileApi.deleteFile,
    method: 'post',
    data: parameter
  })
}
