<template>
  <div class="order-info" id="order_info" @scroll="scroll()">
    <div class="main">
      <div class="wrapper">
        <div class="header">
          <a-form-model>
            <a-row style="display: flex; align-items: center;height: 44px">
              <a-col :span="8" style="height: 17px"><img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/></a-col>
              <a-col :span="8" style="text-align: center"><span class="title">{{ $t('myorder.title') }}</span></a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="info"  v-if="datas.length > 0" style="padding-top: 40pt">
          <div class="content" v-for="item in datas" :key="item.orderNo">
            <div class="scroll-content">
              <a-form-model>
                <div class="card">
                  <a-row class="arowclass" >
                    <a-col :span="18" :push="1">
                      <label class="label1">{{ result[0] }}: {{ item.orderNo }}</label>
                      <span class="span1">{{ `${$t(item.createTime)}` }}</span>
                    </a-col>
                    <a-col :span="6" :pull="1" :class="[{'failed':(item.status == 2)},{'other':(item.status != 2)}]">
                      {{ statusitems[item.status] }}
                    </a-col>
                  </a-row>
                  <a-row class="line">
                    <a-col></a-col>
                  </a-row>
                  <a-row class="arowclass">
                    <a-col :span="18" :push="1">
                      <a-row>
                        <a-col :span="14"><label class="label2">{{ result[1] }}: </label></a-col>
                        <a-col :span="6"><span class="span2">{{ item.spaceSize }}</span></a-col>
                      </a-row>
                      <a-row>
                        <a-col :span="14"><label class="label2">{{ result[2] }}: </label></a-col>
                        <a-col :span="6"><span class="span2">{{ item.pledgeFnAmount }}</span></a-col>
                      </a-row>
                      <a-row>
                        <a-col :span="14"><label class="label2">{{ result[3] }}: </label></a-col>
                        <a-col :span="6"><span class="span3">{{ item.pledgePeriod }}</span></a-col>
                      </a-row>
                    </a-col>
                    <a-col :span="6" :pull="1" >
                      <a-button
                        class="submit"
                        @click="handleDetail(item.orderNo)">
                        <span class="btnspan">{{ $t('myorder.table.more.detail') }}</span>
                      </a-button>
                    </a-col>
                  </a-row>
                </div>

              </a-form-model>
            </div>
          </div>
          <div v-if="!noMore" style="text-align: center;margin-top: 48px;margin-bottom: 35px" ><img src="~@/assets/up_20200706144653.png" style="width:12px;height:18px;margin-right: 5px"  @click="handleUp"/><a @click="handleUp" style="color:rgba(165,169,176,1);font-size:11px;height:10px; font-weight:200;">{{ $t('myorder.table.up') }}</a></div>
          <div v-else style="text-align: center;margin-top: 48px;margin-bottom: 35px" ><span style="color:rgba(165,169,176,1);font-size:11px;height:10px; font-weight:200;">{{ $t('myorder.table.nomore') }}</span></div>
        </div>
        <div  v-else  class="info" style="padding-top: 45pt;text-align: center">
          <label >{{ $t('myorder.table.emptytext') }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { getPledgeList, getPledgeConfrim } from '@/api/manage'
  import { formatFileSize2 } from '@/utils/util'
  export default {
    name: 'MyOrder',
    statusitems: {},
    components: {
    },
    data () {
      return {
        datas: [],
        singleChecked: false,
        totalCount: 0,
        // 查询参数
        queryParam: {},
        selectedRows: [],
        visible: false,
        confirmLoading: false,
        pageNo: 1,
        pageSize: 5,
        isLoading: false,
        noMore: false
      }
    },
    computed: {
      // 画面显示内容数组
      result: function () {
        return [
          this.$t('myorder.table.col.orderId'),
          this.$t('myorder.table.col.space'),
          this.$t('myorder.table.col.pledgeFnAmount'),
          this.$t('myorder.table.col.pledgePeriod')
        ]
      },
      statusitems: function () {
        return {
          0: this.$t('myorder.status.0'),
          1: this.$t('myorder.status.1'),
          2: this.$t('myorder.status.2')
        }
      },
      emptyStr: function () {
              return this.$t('myorder.table.emptytext')
      }
    },
    methods: {
      gettingPledgeInfo (flag) {
        clearTimeout(this.updateInfoEvent)
        this.updateInfoEvent = null
        const requestParameters = Object.assign({}, this.queryParam)
        getPledgeConfrim(requestParameters)
          .then(res => {
            if (res.data.buyConfirmingCnt > 0) {
              // 存在未确认定时确认
              this.updateInfoEvent = setTimeout(() => {
                this.gettingPledgeInfo(true)
              }, 10000)
            } else {
              if (flag) {
                this.handleSearch2()
              }
              clearTimeout(this.updateInfoEvent)
              this.updateInfoEvent = null
            }
          })
      },
      // 迁移详细画面
      handleDetail (orderNo) {
        // this.setPageNo(this.pageNo)
        this.$router.push({
          path: '/center/myorder/detail',
          query: {
            orderNo: orderNo
          }
        })
      },
      // 手顺上拉刷新
      handleUp () {
        document.querySelector('#order_info .scroll-content').parentElement.scrollTop = 80
        this.scroll()
      },
      handleSearch2 () {
        this.isLoading = true
        const requestParameters = Object.assign({ pageNo: 1, pageSize: this.pageSize * this.pageNo }, this.queryParam)
        getPledgeList(requestParameters)
          .then(res => {
            if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
              this.noMore = true
            }
            this.datas = []
            res.data.data.forEach(val => {
              val.createTime = moment(val.createTime).format('YYYY-MM-DD HH:mm')
              val.spaceSize = formatFileSize2(val.spaceSize, 0, false, true)
              val.pledgeFnAmount = val.pledgeFnAmount + this.$t('myorder.pledgeFnAmount.unit')
              val.pledgePeriod = val.pledgePeriod + this.$t('myorder.pledgePeriod.unit')
              this.$set(val, 'isChecked', false)
              this.datas.push(val)
            })
            this.isLoading = false
          })
      },
      // 执行检索
      handleSearch () {
        this.isLoading = true
        // this.pageNo = this.currentPageNo
        this.selectedRows = []
        this.noMore = false
        const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
        getPledgeList(requestParameters)
          .then(res => {
            if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
              this.noMore = true
            }
            this.totalCount = res.data.totalCount
            this.datas = []
            res.data.data.forEach(val => {
              val.createTime = moment(val.createTime).format('YYYY-MM-DD HH:mm')
              val.spaceSize = formatFileSize2(val.spaceSize, 2, false, true)
              val.pledgeFnAmount = val.pledgeFnAmount + this.$t('myorder.pledgeFnAmount.unit')
              val.pledgePeriod = val.pledgePeriod + this.$t('myorder.pledgePeriod.unit')
              this.$set(val, 'isChecked', false)
              this.datas.push(val)
            })
            this.isLoading = false
          })
        this.showRslt = true
      },
      // 返回
      goBack () {
        this.$router.push('/menu/mycenter')
      },
      // 滚动事件
      scroll () {
        if (!document.querySelector('#order_info .scroll-content') || this.noMore || this.isLoading) {
          return
        }
        if (document.querySelector('#order_info .scroll-content').offsetHeight - document.documentElement.offsetHeight - document.querySelector('#order_info .scroll-content').parentElement.scrollTop <= 60) {
          this.isLoading = true
          this.pageNo++
          const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
          getPledgeList(requestParameters)
            .then(res => {
              if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
                this.noMore = true
              }
              res.data.data.forEach(val => {
                val.createTime = moment(val.createTime).format('YYYY-MM-DD HH:mm')
                val.spaceSize = formatFileSize2(val.spaceSize, 0, false, true)
                val.pledgeFnAmount = val.pledgeFnAmount + this.$t('myorder.pledgeFnAmount.unit')
                val.pledgePeriod = val.pledgePeriod + this.$t('myorder.pledgePeriod.unit')
                this.$set(val, 'isChecked', false)
                this.datas.push(val)
              })
              this.isLoading = false
            })
        }
      }
    },
    beforeDestroy () {
      clearTimeout(this.updateInfoEvent)
    },
    // 初始化
    mounted () {
      console.log(1111)
      this.gettingPledgeInfo(false)
      this.handleSearch()
    }
  }
</script>

<style lang="less" scoped>
  .arowclass{
    display: flex;
    align-items: center;
  }
  .order-info{
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    overflow: auto;
    background-color: #ededed;
  }
  .main {
    font-family:PingFang SC;
    height: 100%;
    min-height: 100%;
    .wrapper {
      height: auto;
      min-height: 100%;
      background-color: #ededed;
      /*padding-bottom: 100px;*/
    }

    .header {
      position: fixed;
      height: 44px;
      text-align: center;
      background-color: #F9F9F9;
      width: 100%;
      padding: 0pt 10pt;
      line-height: 40pt;
      z-index:999;
      .back {
        position: fixed;
        left: 15px;
        width: 12px;
      }

      .title {
        text-align: center;
        color: #333333;
        font-size: 18px;
        font-weight: bold;
        line-height: 18px;
      }
    }
    .scroll-content{
      /*padding-top: 90px;*/
      /*padding-bottom: 59px;*/
    }
    .content {
      flex-grow: 1;
      background-color: #ededed;
      color: #333333;
      font-size: 12px;
      margin-left: 15px;
      margin-top: 15px;
      margin-right: 15px;
      border-radius:8px;
      .failed{
        color: #D84747;
        text-align: center;
        height:13px;
        font-size:13px;
        font-family:PingFang SC;
        font-weight:bold;
        line-height:7px;
      }
      .other{
        color: #26C195;
        text-align: center;
        height:13px;
        font-size:13px;
        font-family:PingFang SC;
        font-weight:bold;
        line-height:7px;
      }

      .card {
        background-color: #ffffff;
        padding: 10px 5px;
        margin-bottom: 15px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        height: 152px;
        border-radius:8px;
        /*width:345px;*/
        .line{
          margin-top: 15px;
          margin-bottom: 15px;
          /*width:315px;*/
          height:1px;
          background:rgba(229,229,229,1);
        }
        .label1 {
          color: #333333;
          font-size: 14px;
          line-height: 16px;
          display: block;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
        }

        .span1 {
          font-family: PingFang-SC-Regular;
          color: #999999;
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
        }
        .label2 {
          color: #666666;
          font-size: 13px;
          line-height: 21px;
          font-family: PingFang-SC-Regular;
          font-weight: 400;
        }

        .span2 {
          color: #333333;
          font-size: 13px;
          line-height: 21px;
          font-family: PingFang-SC-Bold;
          font-weight:bold;
        }
        .span3 {
          color: #666666;
          font-size: 13px;
          line-height: 21px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
        }
        .value {
          text-align: left;
          color: #333333;
          font-size: 15px;
        }
        .title {
          text-align: left;
          color: #999999;
          font-size: 15px;
          vertical-align: baseline;
        }
      }
    }
    .submit {
      height:28px;
      background:rgba(38,193,149,0.1);
      border-radius:4px;
      border: 0;
      &:hover {
        background-color: lighten(#26C195, 10%);
      }
    }
    .btnspan{
      height:11px;
      font-size:11px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(38,193,149,1);
      line-height:7px;
    }
      .ant-form-item {
        margin: 0px;
        padding: 16px 30px 21px 30px;
        flex: 1;
        width: 100%;
      }

      .cancel-area{
        padding:16px 30px 21px 0;
        flex: none;
        text-align: right;
      }
      .cancel-text{
        height: 80px;
        line-height: 80px;
        font-size: 16px;
        font-size:28px;
        font-weight:500;
        color:rgba(38,193,149,1);
      }

      .input-ss{
        height:80px;
        font-weight:400;
        color:rgba(153,153,153,1);
        .ant-input{
          background-color: #EFEFEF;
          font-size: 26px;
        }
        &.ant-input-affix-wrapper .ant-input:not(:first-child){
          padding-left: 60px;
        }
      }
      .search-img{
        width: 48px;
        height: 48px;
      }

      .top-search{
        position: fixed;
        width: 100%;
        height: 148px;
        top: 0;
        background-color: #FFFFFF;
      }
  }
</style>
