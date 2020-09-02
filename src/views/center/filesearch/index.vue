<template>
  <div class="file-search" id="file_search" @scroll="scroll()">
    <div class="top-search">
      <div class="input-ss">
        <a-form style="background-color: #FFFFFF; display: flex;">
          <a-form-item>
            <a-input ref="search_input" v-model.trim="queryParam.searchContent" :placeholder="$t(isHash?'filesearch.input.hashsearch.tip':'filesearch.input.search.tip')" @pressEnter="handleCheckSpace(()=>{handleSearch()})">
              <img width="24px" height="24px" slot="prefix" src="~@/assets/search-icon.png" >
            </a-input>
          </a-form-item>
          <div class="cancel-area">
            <div @click="()=>this.isHash ? this.$router.push('/menu/hashsearch') : this.$router.push('/menu/myfile')" class="cancel-text">{{ $t('filesearch.cancel.text') }}</div>
          </div>
        </a-form>
      </div>
      <div v-if="showRslt" style="padding:10px 0 10px 15px; background-color: #FFFFFF">
        <span class="result-info">{{ $t(isHash?'filesearch.result.hash.info':'filesearch.result.info', [totalCount]) }}</span>
      </div>
    </div>
    <div v-if="showRslt" class="scroll-content">
      <div class="result-items">
        <div class="result-item" v-for="item in datas" :key="item.key">
          <div class="result-img"><img width="20px" height="23px" src="~@/assets/file-icon.png"></div>
          <div class="result-txt">
            <div class="result-txt-title">{{ item.fileName }}</div>
            <div class="result-txt-content">
              <span>{{ item.entryLoginDate }}</span>
              <span style="margin-left: 1em">{{ item.fileSize }}</span>
            </div>
          </div>
          <div class="result-action" @click="handleCheckSpace(()=>{selectItem(item)})">
            <div :class="item.isChecked?'result-action-checked':'result-action-unchecked'" style="width:16px; height:16px;font-size: 0" >
              <img v-if="item.isChecked" width="16px" height="16px" src="~@/assets/checked-icon.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showMenu" class="bottom-menu">
      <div class="menu-item" @click="handleCheckSpace(()=>{handleDownload()})">
        <div>
          <img width="20px" height="20px" src="~@/assets/filesearch-download.png" >
        </div>
        <span class="menu-text">{{ $t('filesearch.menu.download') }}</span>
      </div>
      <div v-if="!isHash && singleChecked" class="menu-item" @click="handleCheckSpace(()=>{handleCopyIpfs()})">
        <div>
          <img width="20px" height="20px" src="~@/assets/filesearch-copyipfs.png" >
        </div>
        <span class="menu-text">{{ $t('filesearch.menu.copyipfs') }}</span>
      </div>
      <div v-if="isHash || (!isHash && singleChecked)" class="menu-item" @click="handleCheckSpace(()=>{handleCopyDownloadUrl()})">
        <div>
          <img width="20px" height="20px" src="~@/assets/filesearch-copydownloadurl.png" >
        </div>
        <span class="menu-text">{{ $t('filesearch.menu.copydownloadurl') }}</span>
      </div>
      <div v-if="!isHash" class="menu-item" @click="handleCheckSpace(()=>{handleDelete()})">
        <div>
          <img width="20px" height="20px" src="~@/assets/filesearch-delete.png" >
        </div>
        <span class="menu-text">{{ $t('filesearch.menu.delete') }}</span>
      </div>
    </div>
    <a-modal
      class="filesearch-modal"
      :width="262"
      :visible="visible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true">
      <div class="modal-title">
        {{ messageBox.title }}
      </div>
      <div class="modal-content">
        {{ messageBox.message }}
      </div>
      <div class="modal-button">
        <div v-if="messageBox.showCancel" class="button-item" @click="messageBox.cancel()">{{ messageBox.cancelText }}</div>
        <div v-if="messageBox.showOk" class="button-item" style="color:rgba(38,193,149,1)" @click="messageBox.ok()">{{ messageBox.okText }}</div>
      </div>
    </a-modal>
  </div>
</template>
<script>
    import moment from 'moment'
    import { getFileList, deleteFiles, downloadFiles, getFileForHash } from '@/api/myfile'
    import { mapActions, mapState } from 'vuex'
    import { formatFileSize } from '@/utils/util'

    export default {
      name: 'FileSearch',
      data () {
        return {
          isHash: this.$route.query.type && this.$route.query.type === 'hash',
          datas: [],
          showRslt: false,
          showMenu: false,
          singleChecked: false,
          totalCount: 0,
          // 查询参数
          queryParam: {},
          selectedRows: [],
          rowKey: 0,
          visible: false,
          pageNo: 1,
          pageSize: 20,
          isLoading: false,
          noMore: false,
          messageBox: {}
        }
      },
      computed: {
        ...mapState({
          dfs: (state) => state.files.dfs,
          allSize: (state) => state.user.totalSize,
          useSize: (state) => state.user.currentSize,
          isBought: (state) => state.user.buyCnt > 0
        }),
        defaultMessageBox: function () {
          return {
            title: this.$t('confirm.title'),
            message: '',
            okText: this.$t('confirm.ok'),
            cancelText: this.$t('confirm.cancel'),
            showOk: true,
            showCancel: true,
            ok: () => {
            },
            cancel: () => {
            }
          }
        }
      },
      mounted () {
        this.GetSpaceInfo()
        this.$refs.search_input.focus()
      },
      methods: {
        ...mapActions(['addDownloadFile', 'GetSpaceInfo']),
        // 执行空间检测
        handleCheckSpace (handle) {
          if (this.allSize > 0 && this.allSize >= this.useSize) {
            handle && handle()
            return
          }
          let msg = ''
          let okTxt = this.$t('nospace.confirm.gobuy1')
          let cancelTxt = this.$t('nospace.confirm.cancel1')
          if (this.allSize === 0) {
            msg = this.isBought ? this.$t('nospace.confirm.message1') : this.$t('nospace.confirm.message3')
            okTxt = this.isBought ? this.$t('nospace.confirm.gobuy1') : this.$t('nospace.confirm.gobuy3')
            cancelTxt = this.isBought ? this.$t('nospace.confirm.cancel1') : this.$t('nospace.confirm.cancel3')
          } else if (this.allSize < this.useSize) {
            msg = this.$t('nospace.confirm.message2')
          }
          Object.assign(this.messageBox, this.defaultMessageBox, {
            okText: okTxt,
            cancelText: cancelTxt,
            message: msg,
            ok: () => {
              this.visible = false
              this.$router.push('/buy')
            },
            cancel: () => {
              this.visible = false
              handle && handle()
            }
          })
          this.visible = true
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
            this.selectedRows = this.selectedRows.filter(val => val.fileHash !== item.fileHash)
          }
          this.checkMenu()
        },
        handleData (res, search) {
          this.totalCount = res.data.totalCount
          if (search) {
            this.datas = []
            this.rowKey = 1
          }
          if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
            this.noMore = true
          }
          if (this.isHash && res.resultCode === '0' && res.data.data.length === 0) {
            Object.assign(this.messageBox, this.defaultMessageBox, {
              message: this.$t('hashsearch.noFile.message'),
              showCancel: false,
              ok: () => {
                this.visible = false
              }
            })
            this.visible = true
          }
          res.data.data.forEach(val => {
            val.size = val.fileSize
            val.fileSize = formatFileSize(val.fileSize, 0, true, false)
            val.entryLoginDate = moment(val.entryLoginDate).format('YYYY-MM-DD HH:mm')
            this.$set(val, 'isChecked', false)
            val.key = this.rowKey++
            this.datas.push(val)
          })
          this.isLoading = false
        },
        loadData (search) {
          let params = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
          if (this.isHash) {
            if (search) {
              this.queryParam.fileHash = this.queryParam.searchContent
            }
            if (!this.queryParam.fileHash) {
              Object.assign(this.messageBox, this.defaultMessageBox, {
                message: this.$t('hashsearch.validate.filehash.blank'),
                showCancel: false,
                ok: () => {
                  this.visible = false
                }
              })
              this.visible = true
              return false
            }
            params = Object.assign(params, this.queryParam)
            getFileForHash(params)
              .then(res => {
                this.handleData(res, search)
              })
          } else {
            if (search) {
              this.queryParam.fileName = this.queryParam.searchContent
            }
            params = Object.assign(params, this.queryParam)
            getFileList(params)
              .then(res => {
                this.handleData(res, search)
              })
          }
          return true
        },
        // 执行检索
        handleSearch () {
          this.isLoading = true
          this.noMore = false
          this.pageNo = 1
          this.selectedRows = []
          this.checkMenu()
          if (this.loadData(true)) {
            this.showRslt = true
          }
        },
        // 执行下载
        handleDownload () {
          downloadFiles(this.selectedRows, this.addDownloadFile)
          this.$mtoast.show(this.$t('myfile.download.finish.message'), 3, 'bottom')
        },
        // 执行删除
        handleDelete () {
          const params = { 'fileInfos': [] }
          if (this.selectedRows.length === 0) {
            return
          }
          this.selectedRows.forEach(val => {
            params.fileInfos.push({ 'fileHash': val.fileHash, 'fileName': val.fileName })
          })
          Object.assign(this.messageBox, this.defaultMessageBox, {
            title: this.$t('filesearch.delete.confirm.title'),
            message: this.$t('filesearch.delete.confirm.text'),
            ok: () => {
              this.visible = false
              deleteFiles(params)
                .then(res => {
                  this.GetSpaceInfo()
                  this.handleSearch()
                  this.$mtoast.show(this.$t('filesearch.delete.finished.text'), 3, 'bottom')
                })
            },
            cancel: () => {
              this.visible = false
            }
          })
          this.visible = true
        },
        // 拷贝哈希码
        handleCopyIpfs () {
          if (this.selectedRows.length === 0) {
            return
          }
          const that = this
          this.$copyText(this.selectedRows[0].fileHash).then(function (e) {
            // OK
            that.$mtoast.show(that.$t('filesearch.copy.success'), 3, 'bottom')
          }, function (e) {
            //
          })
        },
        // 拷贝下载链接
        handleCopyDownloadUrl () {
          if (this.selectedRows.length === 0) {
            return
          }
          const that = this
          this.$copyText(this.selectedRows[0].downloadUrl + '?filename=' + this.selectedRows[0].fileName).then(function (e) {
            // OK
            that.$mtoast.show(that.$t('filesearch.copy.success'), 3, 'bottom')
          }, function (e) {
            //
          })
        },
        scroll () {
          if (!document.querySelector('#file_search .scroll-content') || !this.showRslt || this.noMore || this.isLoading) {
            return
          }
          if (document.querySelector('#file_search .scroll-content').offsetHeight - document.documentElement.offsetHeight - document.querySelector('#file_search .scroll-content').parentElement.scrollTop <= 118) {
            this.isLoading = true
            this.pageNo++
            this.loadData(false)
          }
        }
      }
    }
</script>

<style lang="less" >
  .file-search {
    font-family:PingFang SC;
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    overflow: auto;
    .ant-form-item {
      margin: 0px;
      padding: 8px 15px 11px 15px;
      flex: 1;
      width: 100%;
    }
    .cancel-area{
      padding:8px 15px 11px 0;
      flex: none;
      text-align: right;
    }
    .cancel-text{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight:500;
      color:rgba(38,193,149,1);
    }

    /* 输入框*/
    .input-ss {
      .ant-input {
        background-color: #EFEFEF;
        font-size: 14px;
        color: rgba(153, 153, 153, 1);
        height: 40px;
        line-height: 40px;
        font-weight: 400;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        border-color: #EFEFEF;
      }

      .ant-input-affix-wrapper .ant-input:not(:first-child) {
        padding-left: 35px;
      }

      .ant-input:hover {
        border-color: #EFEFEF;
      }

      .ant-input:focus {
        border-color: #EFEFEF;
        -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
      }

      .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
        border-color: #EFEFEF;
      }

      .ant-input::-moz-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }

      .ant-input:-ms-input-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }

      .ant-input::-webkit-input-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }

    .top-search{
      position: fixed;
      width: 100%;
      height: 74px;
      top: 0;
      background-color: #FFFFFF;
    }
    .scroll-content{
      padding-top: 90px;
      padding-bottom: 59px;
    }

    .result-info{
      font-size:13px;
      font-weight:800;
      color:rgba(153,153,153,1);
    }
    .result-items{
      padding: 0px 15px 0;
    }
    .result-item{
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom:1px solid rgba(229,229,229,1);
      &:first-child{
        border-top:1px solid rgba(229,229,229,1);
      }
    }
    .result-img{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      padding: 0 15px 0 0;
    }
    .result-txt{
      display: flex;
      justify-content: left;
      align-items: end;
      width: 100%;
      flex-direction: column;
      flex: 1;
      text-align: left;
    }
    .result-txt-title{
      font-size:14px;
      font-weight:bold;
      color:rgba(10,11,11,1);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: calc(100vw - 100px);
    }
    .result-txt-content{
      font-size:11px;
      font-weight:400;
      color:rgba(102,102,102,1);
    }
    .result-action{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      padding: 0 8px;
    }
    .result-action-checked{
      border:0;
      background:rgba(38,193,149,1);
      border-radius:50%;
    }
    .result-action-unchecked{
      border:3px solid rgba(221,221,221,1);
      border-radius:50%;
    }

    .bottom-menu{
      position: fixed;
      height: 59px;
      background:RGBA(38, 193, 149, 1);
      box-shadow:0px -5px 15px 0px rgba(29,31,35,0.04);
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      bottom: 0;
    }
    .menu-item{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      flex-direction: column;
      flex: 1;
      text-align: center;
      /*position: relative;*/
      /*&:not(:last-child):before {*/
      /*  content: "";*/
      /*  position: absolute;*/
      /*  right: 0;*/
      /*  background-color: rgba(255,255,255,1);*/
      /*  width:1px;*/
      /*  height:80%;*/
      /*  opacity:0.5;*/
      /*}*/
    }
    .menu-text{
      font-size:12px;
      font-weight:bold;
      color:rgba(255,255,255,1);
      margin: 7px 0 0;
    }
  }
  .filesearch-modal {
    font-family:PingFang SC;
    .ant-modal-content{
      border-radius:8px;
    }
    .ant-modal-body{
      padding: 30px 0px 0px;
    }
    .modal-title {
      text-align: center;
      font-size:18px;
      font-weight:bold;
      color:rgba(51,51,51,1);
    }

    .modal-content {
      text-align: center;
      padding: 19px 10px 24px;
      font-size:14px;
      font-weight:500;
      color:rgba(51,51,51,1);
    }

    .modal-button{
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #909399;
      font-size:15px;
      font-weight:bold;
    }
    .button-item{
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
        content: "";
        position: absolute;
        right: 0;
        background-color: rgba(229,229,229,1);
        width:1px;
        height:50%;
        opacity:0.5;
      }
    }
  }
</style>
