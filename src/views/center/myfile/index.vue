<template>
  <div class="my-file" id="my_file" @scroll="scroll()">
    <div class="top-area">
      <div class="top-title">
        <div class="title-left" ><span>{{ $t('myfile.title') }}</span></div>
        <div class="title-right">
          <img width="33px" height="33px" style="margin-right: 15px" src="~@/assets/myfile-transportfilelist.png" @click="()=>this.$router.push('/center/upload')" >
          <img width="33px" height="33px" src="~@/assets/myfile-uploadfile.png" @click="showActionSheet()">
        </div>
      </div>
      <div class="top-search input-ss">
        <a-input aria-readonly="true" v-model="queryParam.fileName" :placeholder="$t('filesearch.input.search.tip')" @click="()=>this.$router.push('/center/filesearch')">
          <img width="24px" height="24px" slot="prefix" src="~@/assets/search-icon.png" >
        </a-input>
      </div>
    </div>
    <div class="scroll-content">
      <div class="result-items">
        <div class="result-item" v-for="item in datas" :key="item.key" @click="handleCheckSpace(()=>{showMenu(item)})">
          <div class="result-img"><img width="20px" height="23px" src="~@/assets/file-icon.png"></div>
          <div class="result-txt">
            <div class="result-txt-title">{{ item.fileName }}</div>
            <div class="result-txt-content">
              <span>{{ item.entryLoginDate }}</span>
              <span style="margin-left: 1em">{{ item.fileSize }}</span>
            </div>
          </div>
        </div>
        <div v-if="isLoaded && !datas.length" class="result-item" style="border-bottom:0">{{ $t('load.nodata') }}</div>
      </div>
    </div>
    <a-modal
      class="myfile-modal"
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
    <a-modal
      class="myfile-modal-menu"
      :width="262"
      @cancel="()=>{isMenuVisible = false}"
      :visible="isMenuVisible"
      :footer="null"
      :closable="false"
      :zIndex="999"
      :destroyOnClose="true">
      <div class="modal-menu">
        <div class="modal-menu-item" @click="handleCheckSpace(()=>{messageBox.menu(1)})">
          <div class="modal-menu-item-img">
            <img width="13px" height="13px" src="~@/assets/myfile-menu-download.png" >
          </div>
          <span class="modal-menu-item-txt">{{ $t('filesearch.menu.download') }}</span>
        </div>
        <div class="modal-menu-item" @click="handleCheckSpace(()=>{messageBox.menu(2)})">
          <div class="modal-menu-item-img">
            <img width="13px" height="13px" src="~@/assets/myfile-menu-copyipfs.png" >
          </div>
          <span class="modal-menu-item-txt">{{ $t('filesearch.menu.copyipfs') }}</span>
        </div>
        <div class="modal-menu-item" @click="handleCheckSpace(()=>{messageBox.menu(3)})">
          <div class="modal-menu-item-img">
            <img width="13px" height="13px" src="~@/assets/myfile-menu-copydownloadurl.png" >
          </div>
          <span class="modal-menu-item-txt">{{ $t('filesearch.menu.copydownloadurl') }}</span>
        </div>
        <div class="modal-menu-item" @click="handleCheckSpace(()=>{messageBox.menu(4)})">
          <div class="modal-menu-item-img">
            <img width="13px" height="13px" src="~@/assets/myfile-menu-delete.png" >
          </div>
          <span class="modal-menu-item-txt">{{ $t('filesearch.menu.delete') }}</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import moment from 'moment'
  import { getFileList, deleteFiles, downloadFiles } from '@/api/myfile'
  import { mapActions, mapState } from 'vuex'
  import { formatFileSize3 } from '@/utils/util'

  export default {
    name: 'MyFile',
    data () {
      return {
        datas: [],
        // 查询参数
        queryParam: {},
        pageNo: 1,
        pageSize: 20,
        isLoading: false,
        noMore: false,
        visible: false,
        isMenuVisible: false,
        isLoaded: false,
        rowKey: 0,
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
      this.GetSpaceInfo().then(() => { this.handleCheckSpace(() => { this.handleSearch() }) })
    },
    methods: {
      ...mapActions(['addDownloadFile', 'GetSpaceInfo']),
      showActionSheet: function () {
        this.$parent.showActionSheet && this.$parent.showActionSheet()
      },
      // 加载数据
      loadData (search) {
        const params = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
        getFileList(params)
          .then(res => {
            if (search) {
              this.datas = []
              this.rowKey = 1
            }
            if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
              this.noMore = true
            }
            res.data.data.forEach(val => {
              val.size = val.fileSize
              val.fileSize = formatFileSize3(val.fileSize, 0, true, false)
              val.entryLoginDate = moment(val.entryLoginDate).format('YYYY-MM-DD HH:mm')
              val.key = this.rowKey++
              this.datas.push(val)
            })
            this.isLoading = false
            this.isLoaded = true
          })
      },
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
      // 执行检索
      handleSearch () {
        this.isLoading = true
        this.noMore = false
        this.pageNo = 1
        this.loadData(true)
      },
      // 执行下载
      handleDownload (record) {
        downloadFiles([record], this.addDownloadFile)
        this.$mtoast.show(this.$t('myfile.download.finish.message'), 3, 'bottom')
      },
      // 执行删除
      handleDelete (record) {
        const params = { 'fileInfos': [ { 'fileHash': record.fileHash, 'fileName': record.fileName } ] }
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
      handleCopyIpfs (record) {
        const that = this
        this.$copyText(record.fileHash).then(function (e) {
          // OK
          that.$mtoast.show(that.$t('filesearch.copy.success'), 3, 'bottom')
        }, function (e) {
          //
        })
      },
      // 拷贝下载链接
      handleCopyDownloadUrl (record) {
        const that = this
        this.$copyText(record.downloadUrl + '?filename=' + record.fileName).then(function (e) {
          // OK
          that.$mtoast.show(that.$t('filesearch.copy.success'), 3, 'bottom')
        }, function (e) {
          //
        })
      },
      scroll () {
        if (!document.querySelector('#my_file .scroll-content') || this.noMore || this.isLoading) {
          return
        }
        if (document.querySelector('#my_file .scroll-content').offsetHeight - document.documentElement.offsetHeight - document.querySelector('#my_file .scroll-content').parentElement.scrollTop <= 118) {
          this.isLoading = true
          this.pageNo++
          this.loadData(false)
        }
      },
      showMenu (item) {
        // 开始显示
        Object.assign(this.messageBox, {
          menu: (idx) => {
            switch (idx) {
              case 1:
                this.handleDownload(item)
                break
              case 2:
                this.handleCopyIpfs(item)
                break
              case 3:
                this.handleCopyDownloadUrl(item)
                break
              case 4:
                this.handleDelete(item)
                break
              default:
                break
            }
            this.isMenuVisible = false
          }
        })
        this.isMenuVisible = true
      }
    }
  }
</script>

<style lang="less" >
  .my-file {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    overflow: auto;
    font-family: PingFang SC;

    .top-area {
      position: fixed;
      width: 100%;
      height: 97px;
      top: 0;
      background-color: RGBA(249, 249, 249, 1);
    }

    .top-title{
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 5px 15px 0;
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
  /*  列表 */
    .scroll-content{
      padding-top: 94px;
      padding-bottom: 49px;
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
      width: calc(100vw - 80px);
    }
    .result-txt-content{
      font-size:11px;
      font-weight:400;
      color:rgba(102,102,102,1);
    }
  }
  .myfile-modal-menu {
    font-family: PingFang SC;

    .ant-modal-content {
      border-radius: 8px;
    }

    .ant-modal-body {
      padding: 15px 0px;
    }

    .modal-menu {
      width: 100%;
    }
    .modal-menu-item {
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 15px;
      padding: 15px 20px;
    }
    .modal-menu-item-img {
      padding-right:20px;
      font-size: 0;
    }
    .modal-menu-item-txt {
      flex: 1;
      font-size: 15px;
      width: 100%;
    }
  }
  .myfile-modal{
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
