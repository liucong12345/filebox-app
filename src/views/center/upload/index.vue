<template>
  <div class="upload-file-list" id="upload_file_list">
    <div class="top-title-area">
      <div class="top-title">
        <div class="title-left">
          <span
            v-if="!isImgGoBack"
            @click="handleCancelEvent()"
          >{{ $t('transportfilelist.title.cancel') }}</span>
          <img
            v-else
            width="12px"
            height="19px"
            src="~@/assets/icons/back.png"
            @click="()=>this.$router.back()"
          />
        </div>
        <div class="title-content">
          <span>{{ $t('transportfilelist.title') }}</span>
        </div>
        <div class="title-right">
          <img
            width="20px"
            height="20px"
            src="~@/assets/delete-icon.png"
            @click="handleDeleteEvent()"
          />
        </div>
      </div>
    </div>
    <div class="scroll-content">
      <template v-if="filterUploadingList.length != 0">
        <div class="result-title">
          <div
            class="result-title-left"
          >{{ $t('transportfilelist.tab.uploading') }}({{ filterUploadingList.length }})</div>
          <div
            class="result-title-right"
            @click="puaseUpload()"
            v-if="puaseFlag"
          >{{ $t('transportfilelist.tab.pause') }}</div>
          <div
            class="result-title-right"
            @click="puaseUpload()"
            v-else
          >{{ $t('transportfilelist.tab.start') }}</div>
        </div>
        <div class="result-items">
          <div
            class="result-item"
            v-for="item in filterUploadingList"
            :key="item.fileIdx"
            @touchstart="goTouchStart(item)"
            @touchmove="goTouchMove(item)"
            @touchend="goTouchEnd(item)"
          >
            <div class="result-img">
              <img width="20px" height="23px" src="~@/assets/file-icon.png" />
            </div>
            <div class="result-txt">
              <div class="result-txt-title">{{ item.fileName }}</div>
              <div class="result-txt-content">
                <span>{{ item.fileDate }}</span>
                <span style="margin-left: 1em">{{ item.fileSize|formatFileSize }}</span>
              </div>
            </div>
            <div v-if="showCheckBox" class="result-action" @click="loadingSelectItem(item)">
              <div
                :class="item.isChecked?'result-action-checked':'result-action-unchecked'"
                style="width:16px; height:16px;font-size: 0"
              >
                <img
                  v-if="item.isChecked"
                  width="16px"
                  height="16px"
                  src="~@/assets/checked-icon.png"
                />
              </div>
            </div>
            <div v-else class="result-i">
              <div class="downloading">
                <!-- <a-progress
                  type="circle"
                  :showInfo="true"
                  :strokeColor="'rgba(38, 193, 149, 1)'"
                  :percent="item.percent"
                  @click="handlePause(item)"
                  :width="31"
                /> -->
                <div class="ant-progress ant-progress-circle ant-progress-status-normal ant-progress-show-info ant-progress-default">
                  <div class="ant-progress-inner" style="width: 51px; height: 51px;">
                    <svg viewBox="0 0 100 100" class="ant-progress-circle">
                      <path
                        d="M 50,50 m 0,-47
   a 47,47 0 1 1 0,94
   a 47,47 0 1 1 0,-94"
                        stroke="#f3f3f3"
                        stroke-linecap="round"
                        stroke-width="6"
                        fill-opacity="0"
                        class="ant-progress-circle-trail"
                        style="stroke: rgb(212,243,234); stroke-dasharray: 295.31px, 295.31px; stroke-dashoffset: 0px; transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s;">
                      </path>
                      <path
                        d="M 50,50 m 0,-47
   a 47,47 0 1 1 0,94
   a 47,47 0 1 1 0,-94"
                        stroke=""
                        stroke-linecap="round"
                        stroke-width="6"
                        fill-opacity="0"
                        class="ant-progress-circle-path"
                        :style="{'stroke': 'rgba(38, 193, 149, 1)', 'stroke-dasharray': item.percent*295.31/100+'px, 295.31px', 'stroke-dashoffset': '0px', 'transition': 'stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s'}">
                      </path>
                    </svg>
                    <span class="ant-progress-text">{{ item.percent }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="result-title">
        <div>{{ $t('transportfilelist.tab.uploaded') }}({{ filterUploadedList.length }})</div>
      </div>
      <div class="result-items">
        <div class="result-item" v-for="item in filterUploadedList" :key="item.fileIdx">
          <div class="result-img">
            <img width="20px" height="23px" src="~@/assets/file-icon.png" />
          </div>
          <div class="result-txt">
            <div class="result-txt-title">{{ item.fileName }}</div>
            <div class="result-txt-content">
              <span>{{ item.fileDate }}</span>
              <span style="margin-left: 1em">{{ item.fileSize|formatFileSize }}</span>
            </div>
          </div>
          <div class="result-action" @click="selectItem(item)">
            <div
              :class="item.isChecked?'result-action-checked':'result-action-unchecked'"
              style="width:16px; height:16px;font-size: 0"
            >
              <img
                v-if="item.isChecked"
                width="16px"
                height="16px"
                src="~@/assets/checked-icon.png"
              />
            </div>
          </div>
        </div>
        <div
          v-if="filterUploadedList.length === 0"
          class="result-item"
          style="border-bottom:0"
        >{{ $t('uploadfile.upload.noFile') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { formatFileSize } from '@/utils/util'
import { checkpeer, mergepeer, uploadpeer, checkfile } from '@/api/uploadfile'
import SparkMD5 from 'spark-md5'

export default {
  name: 'UploadFile',
  data () {
    return {
      timer: '',
      isMenuModal: false,
      visible: false,
      selectedRows: [],
      puaseFlag: true,
      timeOutEvent: null,
      showCheckBox: false,
      isImgGoBack: true,
      loadingSelectedRows: [],
      beforeunload: ''
    }
  },
  computed: {
    ...mapState({
      ufs: state => state.uploadfiles.dfs
    }),
    filterUploadingList: function () {
      // `this` points to the vm instance
      var files = this.ufs.files
      const filterList = files.filter(function (item) {
        return item.statuscode < 0 || item.statuscode > 0
      })
      var beforeunload = this.ufs.beforeunload
      if (beforeunload === null) {
        beforeunload = this.beforeunloadHandler
        this.updateBeforeunload(beforeunload)
      }
      if (filterList.length > 0) {
        window.addEventListener('beforeunload', beforeunload)
      } else {
        window.removeEventListener('beforeunload', beforeunload)
      }
      return filterList
    },
    filterUploadedList: function () {
      // `this` points to the vm instance
      var files = this.ufs.files
      const uploaedList = files.filter(function (item) {
        return item.statuscode === 0
      })
      return uploaedList.sort(function (x, y) {
        return Date.parse(y.fileDate) - Date.parse(x.fileDate)
      })
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['rmUploadFile', 'updateBeforeunload']),
    // 刷新事件处理
    beforeunloadHandler: function (e) {
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },
    // 头部删除事件
    handleDeleteEvent () {
      this.isImgGoBack = true
      this.loadingSelectedRows.forEach(item => {
        item.statuscode = -4
        this.ufs.files.splice(
          this.ufs.files.findIndex(iitem => iitem.fileIdx === item.fileIdx && iitem.statuscode === -4),
          1
        )
      })
      this.loadingSelectedRows = []

      if (this.selectedRows.length === 0) {
        return
      }
      this.selectedRows.forEach(val => {
        // this.rmUploadFile(val)
        this.ufs.files.splice(
          this.ufs.files.findIndex(iitem => iitem.fileIdx === val.fileIdx && iitem.statuscode === 0),
          1
        )
      })
      this.selectedRows = []
    },
    // 正在下载选择项目
    loadingSelectItem (item) {
      const isSelect = !item.isChecked
      item.isChecked = isSelect
      if (isSelect) {
        this.loadingSelectedRows.push(item)
      } else {
        this.loadingSelectedRows = this.loadingSelectedRows.filter(val => val !== item)
      }
    },
    showUploadStatus: function () {
      for (var i = 0; i < this.ufs.files.length; i++) {
        var item = this.ufs.files[i]
        if (item.statuscode <= -1) {
          continue
        }
      }
    },
    puaseUpload: async function () {
      this.puaseFlag = !this.puaseFlag
      for (let i = 0; i < this.ufs.files.length; i++) {
        const item = this.ufs.files[i]
        if (item.statuscode === -4) {
          continue
        }
        if (item.statuscode === 0) {
          continue
        }
        item.isPause = !this.puaseFlag
        if (this.puaseFlag) {
          await this.chunkFile(item, 1024 * 1024)
        }
      }
    },
    checkMenu () {
      this.showMenu = this.selectedRows.length !== 0
      this.singleChecked = this.selectedRows.length < 2
    },
    selectItem (item) {
      const isSelect = !item.isChecked
      item.isChecked = isSelect
      if (isSelect) {
        this.selectedRows.push(item)
      } else {
        this.selectedRows = this.selectedRows.filter(val => val.fileIdx !== item.fileIdx)
      }
      this.checkMenu()
    },
    chunkFile: async function (item, chunkSize = 10) {
      item.peers = []
      // item.loaded = 0
      var file = item.fileObj
      var chunks = Math.ceil(file.size / chunkSize)
      var start = 0
      var end = 0
      item.hashLoaded = 0
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
            checkpeer(params).then(res => {
              if (res.data.code === 0) {
                            item.peers.push(hashItem)
                hashItem.status = true
                if (item.loaded > item.hashLoaded) {
                  item.hashLoaded = item.hashLoaded + chunkSize
                } else {
                  item.hashLoaded = item.hashLoaded + chunkSize
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
                uploadpeer(params).then(res => {
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
                }).catch(e => reject(e))
              }
            }).catch(e => reject(e))
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
      while (!item.isPause) {
          try {
      const res = await mergepeer(mergeParams)
        item.statuscode = res.data.code
        if (item.statuscode === 1) {
          this.$info({
            title: this.$t('confirm.title'),
            content: item.fileName + this.$t('uploadfile.upload.hasFile')
          })
        }
        break
         } catch {}
        }
    },
    // 长按处理
    handleTouch () {
      this.showCheckBox = true
      this.isImgGoBack = false
    },
    handleCancelEvent () {
      this.isImgGoBack = true
      this.showCheckBox = false
      this.loadingSelectedRows.forEach(item => {
        item.isChecked = !item.isChecked
      })
      this.loadingSelectedRows = []
    },
    goTouchStart (item) {
      const that = this
      clearTimeout(this.timeOutEvent) // 清除定时器
      this.timeOutEvent = null
      this.timeOutEvent = setTimeout(function () {
        that.handleTouch()
      }, 600)
    },
    goTouchEnd (item) {
      clearTimeout(this.timeOutEvent)
      if (this.timeOutEvent) {
      }
    },
    goTouchMove (item) {
      clearTimeout(this.timeOutEvent) // 清除定时器
      this.timeOutEvent = null
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
    }
  },
  filters: {
    // 格式化文件大小显示
    formatFileSize: function (fileSize) {
      if (fileSize != null && fileSize !== '') {
        return formatFileSize(fileSize)
      } else {
        return ''
      }
    }
  },
  created () {
    this.timer = setInterval(this.getUploadedStatus, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
  }
}
</script>

<style lang="less">
.upload-file-list {
  font-family: PingFang SC;
  .top-title-area {
    position: fixed;
    width: 100%;
    height: 56px;
    top: 0;
    background-color: #ffffff;

    .top-title {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 14px 15px;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
    }
    .title-left {
      font-size: 14px;
      font-weight: 500;
      color: rgba(38, 193, 149, 1);
      flex: 1;
      justify-content: left;
      align-items: center;
      text-align: left;
    }
    .title-content {
      font-size: 18px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      flex: 1;
      width: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .title-right {
      flex: 1;
      justify-content: right;
      align-items: center;
      text-align: right;
    }
  }
  .top-area {
    width: 100%;
    height: 44px;
    background-color: RGBA(249, 249, 249, 1);
  }

  .top-title {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 15px 0;
    text-align: center;
  }

  .title-left {
    font-size: 20px;
    font-weight: bold;
    color: rgba(10, 11, 11, 1);
    flex: 1;
    width: 100%;
  }

  .top-search {
    margin: 0px;
    padding: 8px 15px 11px 15px;
  }

  .input-ss {
    height: 40px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);

    .ant-input {
      font-size: 14px;
      background-color: RGBA(239, 239, 239, 1);
    }

    &.ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 35px;
    }
  }

  /*  列表 */

  .scroll-content {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }

  .result-info {
    font-size: 13px;
    font-weight: 800;
    color: rgba(153, 153, 153, 1);
  }

  .result-items {
    padding: 0px 15px 0;
  }

  .result-item {
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid rgba(229, 229, 229, 1);

    &:first-child {
      border-top: 1px solid rgba(229, 229, 229, 1);
    }
  }

  .result-img {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 15px 0 0;
  }

  .result-title {
    display: flex;
    font-size: 13px;
    font-weight: 800;
    color: rgba(153, 153, 153, 1);
    padding: 20px 15px 15px;
  }

  .result-title-left {
    flex: 1;
    width: 100%;
  }

  .result-title-right {
    justify-content: right;
    align-items: end;
    text-align: right;
    font-size: 11px;
    font-weight: bold;
    color: rgba(38, 193, 149, 1);
  }

  .result-txt {
    display: flex;
    justify-content: left;
    align-items: end;
    width: 100%;
    flex-direction: column;
    flex: 1;
    text-align: left;
  }

  .result-txt-title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(10, 11, 11, 1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 170px;
  }

  .result-txt-content {
    font-size: 11px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }

  .result-action {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 8px;
  }

  .result-action-checked {
    border: 0;
    background: rgba(38, 193, 149, 1);
    border-radius: 50%;
  }

  .result-action-unchecked {
    border: 3px solid rgba(221, 221, 221, 1);
    border-radius: 50%;
  }
  .result-i {
    display: flex;
  }
}

.uploadfilelist-modal {
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
    padding-top: 19px;
    padding-bottom: 24px;
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

  .pause_button {
    width: 86px;
    height: 21px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(38, 193, 149, 1);
    line-height: 14px;
  }
}
</style>
