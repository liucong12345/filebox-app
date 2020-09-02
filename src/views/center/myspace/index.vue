<template>
  <div class="space-info" id="space_info" @scroll="scroll($event)">
    <div class="main">
      <div class="wrapper">
        <div class="header">
          <a-form-model>
            <a-row style="display: flex; align-items: center;height: 44px">
              <a-col :span="8" style="height: 17px"><img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/></a-col>
              <a-col :span="8" style="text-align: center"><span class="title">{{ $t('myspace.header') }}</span></a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="info" style="padding: 45pt 15px 0 15px;">
          <div class="content">
            <div class="line"></div>
            <a-form-model style="background-color: #ffffff;height: 150px;" >
              <div class="code-box-demo">
                <div >{{ this.$t('myspace.space1.used') }} {{ this.currentSize|formatFileSize }}/{{ this.totalSize|formatFileSize
            }}({{ percent.toFixed(2) }}%)
                </div>
                <a-progress :percent="isSpaceOver?100:percent" :showInfo="false" :strokeColor="isSpaceOver?'#FF0000':'#26C195'" style="height: 7px"/>
              </div>
              <div style="text-align: right;">
                <span v-if="this.totalSize != 0"><a-button type="primary" @click="handleGotoBuy" class="button">{{ $t('myspace.space1.button1') }}</a-button></span>
                <span v-else ><a-button
                  type="primary"
                  @click="handleGotoBuy"
                  class="button">{{ $t('myspace.space1.button2') }}</a-button></span>
              </div>
            </a-form-model>
          </div>
          <div class="content2" >
            <div class="scroll-content">
              <div class="table">
                <a-form-model style="background-color: #ffffff;height: 100%;text-align: center;margin: 0 auto" >
                  <div class="headerclass">{{ this.$t('myspace.space2.header') }}</div>
                  <div class="tableheader">
                    <a-row v-if="datas.length > 0" class="tabletile">
                      <a-col :span="10" :push="1">
                        <label class="label1">{{ this.$t('myspace.space2.table.title.space') }}</label>
                      </a-col>
                      <a-col :span="14" :pull="1" >
                        <label class="label1">{{ this.$t('myspace.space2.table.title.totime') }}</label>
                      </a-col>
                    </a-row>
                    <a-row v-else style="margin-top:10px">
                      <a-col style="text-align: center" >
                        <label>{{ $t('myspace.space2.table.emptytext') }}</label>
                      </a-col>
                    </a-row>
                  </div>

                  <div v-for="item in datas" :key="item.orderNo" style="text-align: center;">
                    <a-row class="tabledata">
                      <a-col :span="10" :push="1">
                        <label class="label1">{{ item.spaceSize }}</label>
                      </a-col>
                      <a-col :span="14" :pull="1" >
                        <label class="label1">{{ item.totime }}</label>
                      </a-col>
                    </a-row>
                    <a-row class="tableline"></a-row>
                  </div>
                </a-form-model>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import moment from 'moment'
    import { formatFileSize } from '@/utils/util'
    import { mapActions, mapState } from 'vuex'
    import { getMyspaceInfo } from '@/api/manage'

    export default {
        components: {
        },
        data () {
            return {
                // create model
                visible: false,
                confirmLoading: false,
                datas: [],
                pageNo: 1,
                pageSize: 15,
                isLoading: false,
                noMore: false
            }
        },
        computed: {
            // 云空间状态取得
            ...mapState({
                currentSize: (state) => state.user.currentSize,
                totalSize: (state) => state.user.totalSize,
              isSpaceOver: (state) => state.user.currentSize > state.user.totalSize
            }),
            // 百分比计算
            percent: function () {
                if (isNaN(this.currentSize) || isNaN(this.totalSize)) {
                    return ''
                }

                if (this.totalSize <= 0) {
                    return 0
                }
                if (this.currentSize > this.totalSize) {
                  return 100
                }
                return Math.round(this.currentSize / this.totalSize * 100)
            },
            // 分页
            pagination: function () {
                return {
                    defaultCurrent: 1,
                    defaultPageSize: 6,
                    style: { textAlign: 'center', float: 'none' },
                    showTotal: function (total) {
                        return this.$t('pagination.info.total', [total])
                    }
                }
            },
            columns: function () {
                return [
                    {
                        key: 1,
                        title: this.$t('myspace.space2.table.title.space'),
                        dataIndex: 'spaceSize',
                        align: 'center'
                    },
                    {
                        key: 2,
                        title: this.$t('myspace.space2.table.title.totime'),
                        align: 'center',
                        customRender: (text, record) => {
                            return this.totimeCalculate(record.createTime, record.pledgePeriod)
                        }
                    }
                ]
            }
        },
        methods: {
            ...mapActions(['GetSpaceInfo']),
            // 调整到购买空间
            handleGotoBuy () {
                this.$router.push('/buy')
            },
            // 内容检索
            handleSearch () {
              this.isLoading = true
              this.pageNo = 1
              this.noMore = false
              this.selectedRows = []
              const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
              getMyspaceInfo(requestParameters)
                .then(res => {
                  this.totalCount = res.data.totalCount
                  this.datas = []
                  res.data.data.forEach(val => {
                    val.spaceSize = formatFileSize(val.spaceSize, 0, false, true)
                    val.totime = this.totimeCalculate(val.createTime, val.pledgePeriod)
                    this.datas.push(val)
                  })
                  this.isLoading = false
                })
            },
            // 到期时间计算
            totimeCalculate (createTime, pledgePeriod) {
                return moment(createTime).add(pledgePeriod, 'months').format('YYYY-MM-DD HH:mm')
            },
            goBack () {
            this.$router.back()
          },
          // 滚动条事件
          scroll (event) {
            if (!document.querySelector('#space_info .info') || this.noMore || this.isLoading) {
              return
            }
            const scrollBottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight
            if (scrollBottom <= 60) {
              this.isLoading = true
              this.pageNo++
              const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
              getMyspaceInfo(requestParameters)
                .then(res => {
                  if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
                    this.noMore = true
                  }
                  console.log(res.data.data)
                  res.data.data.forEach(val => {
                    val.spaceSize = formatFileSize(val.spaceSize, 0, false, true)
                    val.totime = this.totimeCalculate(val.createTime, val.pledgePeriod)
                    this.datas.push(val)
                  })
                  this.isLoading = false
                })
            }
          }
        },
        filters: {
            formatFileSize: function (fileSize) {
                if (fileSize != null && fileSize !== '') {
                    return formatFileSize(fileSize)
                } else {
                    return ''
                }
            }
        },
        // 初期化
        mounted () {
          this.isLoading = true
          this.pageNo = 1
          this.noMore = false
          this.selectedRows = []
          const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
          getMyspaceInfo(requestParameters)
            .then(res => {
              this.totalCount = res.data.totalCount
              this.datas = []
              res.data.data.forEach(val => {
                val.spaceSize = formatFileSize(val.spaceSize, 0, false, true)
                val.totime = this.totimeCalculate(val.createTime, val.pledgePeriod)
                this.datas.push(val)
              })
              this.isLoading = false
            })
        }
    }
</script>
<style lang="less" scoped>
  .space-info {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    overflow: auto;
    background-color: #ededed;
  }
  .main {
    background-color: #fff;
    height: 100%;
    min-height: 100%;
    font-family: PingFang-SC;
    .code-box-demo {
      //margin-bottom: 16px;
      margin: 0 auto;
      padding-top: 35px;
      font-size:13px;
      font-weight:bold;
      width:80%;
    }
    .table{
      width:100%;
      margin: 0 auto;
      padding: 15px 15px 0 15px;
      background-color: rgb(255, 255, 255);
      overflow: hidden;
      position: relative;
    }
    .button {
      margin-right:20px;
      margin-top: 35px;
      height: 28px;
      width: 77pt;
      background:rgba(38,193,149,1);
      border-radius:8px;
      font-size:11px;
      font-family:PingFang SC;
      font-weight:500;
    }
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

    .content {
      width:100%;
      height: 152px;
      flex-grow: 1;
      background-color: #ededed;
      color: #333333;
      font-size: 14px;
      /*margin-left: 15px;*/
      /*margin-top: 20px;*/
      /*margin-right: 20px;*/

      .line {
        height:2px;
        background:rgba(38,193,149,1);
        border-radius:2px;
      }
      .card {
        background-color: #ffffff;
        padding: 10px 5px;
        margin-bottom: 10px;

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
      .headerclass{
        padding-top: 10px;
        text-align: left;
        font-size:15px;
        font-weight:bold;
        line-height:14px;
      }
    }
    .content2 {
      width:100%;
      min-height: calc(100vh - 152px - 60px - 20px - 20px);
      flex-grow: 1;
      background-color: #ffff;
      color: #333333;
      font-size: 14px;
      margin-bottom: 20px;
      /*margin-left: 10px;*/
      margin-top: 20px;
      /*margin-right: 20px;*/
      /*position: absolute;*/
      /*bottom: 10px;*/
      /*top: 220px;*/
      /*overflow: auto;*/
      .scroll-content{
        padding-bottom: 49px;
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
      .tableheader{
        /*line-height: 40pt;*/
        /*width: 315px;*/

        /*position: fixed;*/
      }
      .headerclass{
        text-align: left;
        height:15px;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:15px;
        /*margin-top: 20px;*/
        /*margin-left: 15px;*/
        margin-bottom: 15px;
      }
      .tabletile{
        height: 28px;
        background-color: #EFEFEF;
        text-align: center;
        line-height: 28px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
      }
      .tabledata{
        height: 40px;
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        font-size:13px;
        margin: 0 auto;
        line-height: 40px;
      }
      .tableline{
        /*width:315px;*/
        height:1px;
        background:rgba(229,229,229,1);
      }
    }
  }
</style>
