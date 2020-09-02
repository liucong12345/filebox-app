<template>
  <div class="menu-main-content">
    <div class="menu-content">
      <router-view />
    </div>
    <div class="bottom-menu">
      <div
        :class="currPath === '/menu/myfile'?'menu-item status-selected':'menu-item'"
        @click="()=>this.$router.push('/menu/myfile')"
      >
        <div>
          <img
            v-if="currPath === '/menu/myfile'"
            width="19x"
            height="18px"
            src="~@/assets/menu-myfile-selected.png"
          />
          <img v-else width="19px" height="18px" src="~@/assets/menu-myfile.png" />
        </div>
        <span class="menu-text">{{ $t('menu.myfile') }}</span>
      </div>
      <div
        :class="currPath === '/menu/hashsearch'?'menu-item status-selected':'menu-item'"
        @click="()=>this.$router.push('/menu/hashsearch')"
      >
        <div>
          <img
            v-if="currPath === '/menu/hashsearch'"
            width="20px"
            height="20px"
            src="~@/assets/menu-hashsearch-selected.png"
          />
          <img v-else width="20px" height="20px" src="~@/assets/menu-hashsearch.png" />
        </div>
        <span class="menu-text">{{ $t('menu.hashsearch') }}</span>
      </div>
      <div class="menu-item" @click="showActionSheet">
        <div>
          <img width="37px" height="37px" src="~@/assets/add-icon.png" />
        </div>
      </div>
      <div
        :class="currPath === '/menu/myreward'?'menu-item status-selected':'menu-item'"
        @click="()=>this.$router.push('/menu/myreward')"
      >
        <div>
          <img
            v-if="currPath === '/menu/myreward'"
            width="17px"
            height="22px"
            src="~@/assets/menu-myreward-selected.png"
          />
          <img v-else width="17px" height="22px" src="~@/assets/menu-myreward.png" />
        </div>
        <span class="menu-text">{{ $t('menu.myreward') }}</span>
      </div>
      <div
        :class="currPath === '/menu/mycenter'?'menu-item status-selected':'menu-item'"
        @click="()=>this.$router.push('/menu/mycenter')"
      >
        <div>
          <img
            v-if="currPath === '/menu/mycenter'"
            width="17px"
            height="21px"
            src="~@/assets/menu-mycenter-selected.png"
          />
          <img v-else width="17px" height="21px" src="~@/assets/menu-mycenter.png" />
        </div>
        <span class="menu-text">{{ $t('menu.mycenter') }}</span>
      </div>
    </div>
    <div>
      <div class="ui-actionsheet" id="actionsheet1">
        <div>
          <div style="width:100%;height:20% ">
            <div
              class="selectUploadHeader"
              style="background-color:rgba(230,230,230,1);width: 40px;
    height: 5px;margin-top: 10px;"
            ></div>
          </div>
          <div style="width:100%">
            <div style="width:50%;float:left; ">
              <div style="width:100%">
                <img class="top-img" src="~@/assets/uploadimage.png" style @click="handleSelectImg" />
                <h2
                  style="margin-top:10px;font-size:14px;font-family:PingFang SC;
font-weight:500;
color:rgba(51,51,51,1);
line-height:14px;"
                >{{ $t('menu.uploadimg') }}</h2>
              </div>
            </div>
            <div style="width:50%;float:right">
              <div style="width:100%">
                <img class="top-img" src="~@/assets/uploadfile.png" style @click="handleSelect" />
                <h2
                  style="margin-top:10px;font-size:14px;font-family:PingFang SC;
font-weight:500;
color:rgba(51,51,51,1);
line-height:14px;"
                >{{ $t('menu.uploadfile') }}</h2>
              </div>
            </div>
            <div style="display:none">
              <input
                type="file"
                multiple
                @change="beforeUpload"
                id="handleSelectImg"
                accept="image/*"
              />
            </div>
            <div style="display:none">
              <input type="file" multiple @change="beforeUpload" id="handleSelect" />
            </div>
          </div>
          <div style="width:100% ">
            <img
              class
              src="~@/assets/upload_hidden.png"
              style="width:15px;height:15px;margin-top: 40px;"
              @click="hiddenActionSheet"
            />
          </div>
        </div>
      </div>
    </div>
    <a-modal
      class="uploadfile-modal"
      :width="262"
      :visible="visible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true"
    >
      <div class="modal-title">{{ messageBox.title }}</div>
      <div class="modal-content">{{ messageBox.message }}</div>
      <div class="modal-button">
        <div
          v-if="messageBox.showCancel"
          class="button-item"
          @click="messageBox.cancel()"
        >{{ messageBox.cancelText }}</div>
        <div
          v-if="messageBox.showOk"
          class="button-item"
          style="color:rgba(38,193,149,1)"
          @click="messageBox.ok()"
        >{{ messageBox.okText }}</div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { asyncRouterMap } from '@/config/router.config'
import { mapActions, mapState } from 'vuex'
import { formatFileSize } from '@/utils/util'
// import { uploadFileApi, checkpeer, uploadpeer, mergepeer } from '@/api/uploadfile'
import { checkpeer, mergepeer, uploadFileApi, uploadpeer, checkfile, getMyspace, checkmd5 } from '@/api/uploadfile'
import moment from 'moment'
import SparkMD5 from 'spark-md5'

export default {
  name: 'CenterLayout',
  data () {
    return {
      pageList: [],
      linkList: [],
      activePage: '',
      timer: '',
      visible: false,
      messageBox: {}
    }
  },
  computed: {
    currPath () {
      return this.$route.path
    },
    defaultMessageBox: function () {
      return {
        title: this.$t('confirm.title'),
        message: '',
        okText: this.$t('nospace.confirm.gobuy1'),
        cancelText: this.$t('nospace.confirm.cancel1'),
        showOk: true,
        showCancel: true,
        ok: () => {},
        cancel: () => {}
      }
    },
    ...mapState({
      routerLoading: (state) => state.router.isLoading,
      allSize: (state) => formatFileSize(state.user.totalSize, 0, false, true),
      useSize: (state) => formatFileSize(state.user.currentSize, 0, false, true),
      percent: (state) => (state.user.currentSize / state.user.totalSize) * 100,
      ufs: (state) => state.uploadfiles.dfs
    })
  },
  methods: {
    ...mapActions(['GetSpaceInfo']),
    ...mapActions(['addUploadFile', 'rmUploadFile', 'UploadFileLoading']),
    // 上传按钮处理
    checkSpace2: async function (files) {
      var parameter = {}
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      var res = await getMyspace(requestParameters)
      if (res.data.netSpace === 0 && res.data.usedSpace !== 0) {
        Object.assign(this.messageBox, this.defaultMessageBox, {
          message: this.$t('uploadfile.modal.nospace.content'),
          ok: () => {
            this.visible = false
            this.$router.push('/buy')
          },
          cancel: () => {
            this.visible = false
          }
        })
        this.visible = true
        return false
      } else if (res.data.netSpace === 0 && res.data.usedSpace === 0) {
        Object.assign(this.messageBox, this.defaultMessageBox, {
          message: this.$t('nospace.confirm.message3'),
          okText: this.$t('nospace.confirm.gobuy3'),
          cancelText: this.$t('nospace.confirm.cancel3'),
          ok: () => {
            this.visible = false
            this.$router.push('/buy')
          },
          cancel: () => {
            this.visible = false
          }
        })
        this.visible = true
        return false
      } else if (res.data.netSpace < res.data.usedSpace) {
        Object.assign(this.messageBox, this.defaultMessageBox, {
          message: this.$t('uploadfile.modal.noenoughspace.content'),
          ok: () => {
            this.visible = false
            this.$router.push('/buy')
          },
          cancel: () => {
            this.visible = false
          }
        })
        this.visible = true
        return false
      } else if (res.data.netSpace === res.data.usedSpace) {
        Object.assign(this.messageBox, this.defaultMessageBox, {
          message: this.$t('uploadfile.modal.noenoughspace.content1'),
          ok: () => {
            this.visible = false
            this.$router.push('/buy')
          },
          cancel: () => {
            this.visible = false
          }
        })
        this.visible = true
        return false
      }
      if (files.length === 0) {
        return true
      }
      var needUploadSize = 0
      for (var i = 0; i < files.length; i++) {
        needUploadSize = needUploadSize + files[i].size
        if (res.data.usedSpace + needUploadSize > res.data.netSpace) {
          Object.assign(this.messageBox, this.defaultMessageBox, {
            message: this.$t('uploadfile.modal.noenoughspace.content1'),
            ok: () => {
              this.visible = false
              this.$router.push('/buy')
            },
            cancel: () => {
              this.visible = false
            }
          })
          this.visible = true
          return false
        }
      }
      return true
    },
    showActionSheet: async function () {
      const hashSpace = await this.checkSpace2([])
      if (hashSpace === false) {
        return
      }
      const actionsheet = document.getElementById('actionsheet1')
      actionsheet.classList.add('show')
    },
    hiddenActionSheet: function () {
      const actionsheet = document.getElementById('actionsheet1')
      actionsheet.classList.remove('show')
    },
    handleSelect: function () {
      const btn = document.getElementById('handleSelect')
      btn.click()
    },
    handleSelectImg: function () {
      const btn = document.getElementById('handleSelectImg')
      btn.click()
    },
    beforeUpload: async function () {
      this.hiddenActionSheet()
      const dt = event.target
      const files = dt.files
      const hashSpace = await this.checkSpace2(files)
      if (hashSpace === false) {
        return
      }
      this.$router.push('/center/upload')
      const list = []
      var hasFile = false
      for (let i = 0; i < files.length; i++) {
        const spark = new SparkMD5()
        spark.append(files[i].name)
        spark.append(Date.now())
        const fileHash = spark.end()
        const item = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isPause: false,
          isChecked: false,
          percent: 0,
          peers: []
        }
        const checkItem = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isPause: false,
          isChecked: false,
          percent: 0,
          peers: []
        }
        this.addUploadFile(item)
        const res = await this.checkFile(checkItem, 1024 * 1024)
        if (res.data.code === 0) {
          this.rmUploadFile(item)
          hasFile = true
          continue
        }
        if (res.data.code === 1) {
          item.statuscode = 0
          item.fileHash = res.data.fileHash
          item.uploadPercentage = 100
          this.GetSpaceInfo()
        }
        if (res.data.code === 2) {
          return false
        }
        list.push(item)
      }
      if (hasFile) {
        this.$info({
          title: this.$t('confirm.title'),
          content: this.$t('uploadfile.upload.hasFile')
        })
      }
      for (const item of list) {
        if (item.statuscode === -4) {
          continue
        }
        if (item.statuscode === 0) {
          continue
        }
        if (item.statuscode === 1) {
          continue
        }
        await this.chunkFile(item, 1024 * 1024)
      }
      return false
    },
    // 上传文件时进度条显示
    handleProgress: function (item) {
      // var item = this.ufs.files[i]
      var file = item.fileObj
      this.chunkFile(item, 1024 * 1024)
      var fd = new FormData()
      fd.append('file', file)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', '/api' + uploadFileApi.file, true)
      xhr.upload.addEventListener(
        'progress',
        function (e) {
          if (file.size > e.loaded) {
            item.loaded = e.loaded
          } else {
            item.loaded = file.size
          }
        },
        false
      )
      xhr.send(fd)
      xhr.onreadystatechange = (function (_xhr) {
        return function () {
          if (_xhr.readyState === 4) {
            if (_xhr.status === 200) {
              var json = JSON.parse(xhr.responseText)
              item.statuscode = json.data.code
              item.fileHash = json.data.fileHash
              item.fileDate = json.data.entryLoginDate
            }
          }
        }
      })(xhr)
    },

    // 上传文件时进度条显示
    handleProgress2: function (item) {
      // var item = this.ufs.files[i]
      var file = item.fileObj
      this.chunkFile(item, 1024 * 1024)
      var fd = new FormData()
      fd.append('file', file)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', '/api' + uploadFileApi.file, true)
      xhr.upload.addEventListener(
        'progress',
        function (e) {
          if (file.size > e.loaded) {
            item.loaded = e.loaded
          } else {
            item.loaded = file.size
          }
        },
        false
      )
      xhr.send(fd)
      xhr.onreadystatechange = (function (_xhr) {
        return function () {
          if (_xhr.readyState === 4) {
            if (_xhr.status === 200) {
              var json = JSON.parse(xhr.responseText)
              item.statuscode = json.data.code
              item.fileHash = json.data.fileHash
              item.fileDate = json.data.entryLoginDate
            }
          }
        }
      })(xhr)
    },

    showUploadStatus: function () {
      for (var i = 0; i < this.ufs.files.length; i++) {
        var item = this.ufs.files[i]
        if (item.statuscode !== -1) {
          continue
        }
      }
    },
    getUploadedStatus: async function () {
      for (let i = 0; i < this.ufs.files.length; i++) {
        const item = this.ufs.files[i]
        if (item.statuscode !== -2) {
          continue
        }
        const params = {
          fileName: item.fileName,
          hash: item.fileHash,
          data: ''
        }
        const res = await checkfile(params)
        if (res.data.code === 0) {
          item.statuscode = 0
          item.fileHash = res.data.fileHash
          item.fileDate = res.data.entryLoginDate
        }
      }
    },
    chunkFile: async function (item, chunkSize = 10) {
      if (item.statuscode === -4) {
        return
      }
      item.loaded = 0
      var file = item.fileObj
      var chunks = Math.ceil(file.size / chunkSize)
      var start = 0
      var end = 0
      const promise = (start, end, curindex) =>
        new Promise(function (resolve, reject) {
          var spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
          var fileReader = new FileReader()
          fileReader.readAsBinaryString(file.slice(start, end))
          fileReader.onload = function (e) {
            spark.appendBinary(e.target.result)
            var md5 = spark.end()
            var hashItem = {
              index: curindex,
              length: end,
              hash: md5,
              status: false
            }
            const params = {
              hash: md5,
              data: ''
            }
            checkpeer(params)
              .then((res) => {
                if (res.data.code === 0) {
                  item.peers.push(hashItem)
                  hashItem.status = true
                  if (item.fileSize < chunkSize) {
                    item.loaded = item.fileSize
                  } else {
                    item.loaded = item.loaded + chunkSize
                  }
                  if (item.fileSize === 0) {
                    item.percent = 99
                  } else {
                    item.percent = Math.round((item.loaded * 100) / item.fileSize)
                  }
                  if (item.percent >= 100) {
                    item.percent = 99
                  }
                  resolve()
                } else {
                  const buffer = Buffer.from(e.target.result, 'binary')
                  params.data = buffer.toString('base64')
                  uploadpeer(params)
                    .then((res) => {
                      item.peers.push(hashItem)
                      hashItem.status = true
                      if (item.fileSize < chunkSize) {
                        item.loaded = item.fileSize
                      } else {
                        item.loaded = item.loaded + chunkSize
                      }
                      if (item.fileSize === 0) {
                        item.percent = 99
                      } else {
                        item.percent = Math.round((item.loaded * 100) / item.fileSize)
                      }
                      if (item.percent >= 100) {
                        item.percent = 99
                      }
                      resolve()
                    })
                    .catch((e) => reject(e))
                }
              })
              .catch((e) => reject(e))
          }
        })
      for (let curindex = 0; curindex < chunks; curindex++) {
        if (file.size - start <= chunkSize) {
          end = file.size
        } else {
          end = start + chunkSize
        }
        if (item.statuscode === -4) {
          return
        }
        if (item.isPause) {
          return
        }
        while (!item.isPause) {
          const { address } = this.$store.state.user
          // if already logout
          if (!address) {
            // clear state
            this.ufs.files.splice(0, this.ufs.files.length)
            return
          }
          try {
            await promise(start, end, curindex)
            break
          } catch {}
        }
        start = end
      }
      if (chunks === 0) {
        while (!item.isPause) {
          try {
            await promise(0, 0, 0)
            break
          } catch {}
        }
      }
      var sortedPeers = item.peers.sort(function (a, b) {
        return a.index - b.index
      })
      var mergePeers = []
      var spark = new SparkMD5()
      for (let idx = 0; idx < sortedPeers.length; idx++) {
        mergePeers.push(sortedPeers[idx].hash)
        spark.append(sortedPeers[idx].hash)
      }
      var hexHash = spark.end()
      item.fileHash = hexHash
      const mergeParams = {
        mergeHash: mergePeers,
        fileName: file.name,
        fileSize: file.size,
        hash: hexHash,
        data: ''
      }
      mergepeer(mergeParams).then((res) => {
        item.statuscode = res.data.code
        if (item.statuscode === 1) {
          this.$info({
            title: this.$t('confirm.title'),
            content: item.fileName + this.$t('uploadfile.upload.hasFile')
          })
        }
      })
    },
    checkFile: async function (item, chunkSize = 10) {
      item.loaded = 0
      var file = item.fileObj

      var chunks = Math.ceil(file.size / chunkSize)
      var start = 0
      var end = 0
      const promise = (start, end, curindex) =>
        new Promise(function (resolve, reject) {
          var spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
          var fileReader = new FileReader()
          fileReader.readAsBinaryString(file.slice(start, end))
          fileReader.onload = function (e) {
            spark.appendBinary(e.target.result)
            var md5 = spark.end()
            var hashItem = {
              index: curindex,
              length: end,
              hash: md5,
              status: false
            }
            item.peers.push(hashItem)
            resolve()
          }
        })
      for (let curindex = 0; curindex < chunks; curindex++) {
        if (file.size - start <= chunkSize) {
          end = file.size
        } else {
          end = start + chunkSize
        }
        await promise(start, end, curindex)
        start = end
      }
      if (chunks === 0) {
        await promise(0, 0, 0)
      }
      var sortedPeers = item.peers.sort(function (a, b) {
        return a.index - b.index
      })
      var mergePeers = []
      var spark = new SparkMD5()
      for (let idx = 0; idx < sortedPeers.length; idx++) {
        mergePeers.push(sortedPeers[idx].hash)
        spark.append(sortedPeers[idx].hash)
      }
      const hexHash = spark.end()
      const params = {
        fileName: item.fileName,
        hash: hexHash,
        data: ''
      }
      const res = await checkmd5(params)
      return res
    }
  },
  created () {
    this.pageList.push(asyncRouterMap[2])
    this.linkList.push(this.$route.fullPath)
    this.activePage = this.$route.fullPath
    this.GetSpaceInfo()
    // this.timer = setInterval(this.getUploadedStatus, 3000)
  },
  mounted: function () {
    // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  beforeDestroy () {
    // clearInterval(this.timer)
  },
  destroyed () {
    // window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  }
}
</script>

<style lang="less">
.menu-main-content {
  overflow: hidden;
  height: 100vh;
}

.menu-content {
  height: 100%;
  overflow: auto;
  padding-bottom: 59px;
}

.bottom-menu {
  position: fixed;
  height: 59px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -5px 15px 0px rgba(29, 31, 35, 0.04);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
}

.menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  flex: 1;
  text-align: center;
}

.menu-text {
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(188, 191, 196, 1);
  margin: 6px 0 0;
}

.status-selected .menu-text {
  color: rgba(38, 193, 149, 1);
}

.ui-actionsheet {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  display: -webkit-box;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  background: rgba(0, 0, 0, 0.4);
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: end;
}

.ui-actionsheet:active {
  opacity: 0.84;
}

.ui-actionsheet .ui-actionsheet-cnt {
  position: fixed;
  bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  -webkit-transition: all 0.2s linear;
  -webkit-transform: translate3d(0, 100%, 0);
  text-align: center;
  font-size: 21px;
}

.ui-actionsheet .ui-actionsheet-cnt button {
  font-size: 18px;
}

.ui-actionsheet button,
.ui-actionsheet div {
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 40%;
  background: #fff;
  font-size: 14px;
  border-radius: 38px 38px 0px 0px;
}

.ui-actionsheet div div {
  width: 50%;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  right: 0;
}

.ui-actionsheet button {
  color: #000;
  height: 50px;
  line-height: 50px;
}

/* .ui-actionsheet button:not(:last-child) {
      border-top: 1px #e9e9e9 solid
  } */

.ui-actionsheet h4 {
  padding: 13px 20px;
  line-height: 24px;
  margin: 0;
}

.ui-actionsheet.show {
  pointer-events: inherit;
  opacity: 1;
}

.ui-actionsheet.show .ui-actionsheet-cnt {
  -webkit-transition: all 0.2s linear;
  -webkit-transform: translate3d(0, 0, 0);
}

/* .ui-actionsheet-split-line {
      height: 10px;
      background-color: rgba(255, 255, 255, 0.7)
  } */

.ui-actionsheet .ui-actionsheet-del {
  color: #fd472b;
}

@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .ui-actionsheet button:not(:last-child) {
    border: 0;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0.5, transparent),
      color-stop(0.5, #e9e9e9),
      to(#e9e9e9)
    );
    background-repeat: repeat-x;
    background-position: left top;
    -webkit-background-size: 100% 1px;
  }
}

.selectUploadHeader {
  width: 10px;
  height: 5px;
  background-color: rgba(230, 230, 230, 1);
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 5px;
  text-align: center;
  margin: 0 auto;
}

.top-img {
  width: 80px;
  height: 80px;
}

.uploadfile-modal {
  font-family: PingFang SC;
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 30px 0px 0px;
  }
  .modal-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  .modal-content {
    text-align: center;
    padding: 19px 10px 24px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

  .modal-button {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #909399;
    font-size: 15px;
    font-weight: bold;
  }
  .button-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction: column;
    flex: 1;
    text-align: center;
    padding: 20px 0;
    cursor: pointer;
    position: relative;
    &:not(:last-child):before {
      content: '';
      position: absolute;
      right: 0;
      background-color: rgba(229, 229, 229, 1);
      width: 1px;
      height: 50%;
      opacity: 0.5;
    }
  }
}
</style>
