<template>
  <div :bordered="false" class="reward-info" id="reward_info" @scroll="scroll()">
    <span class="title-text">{{ $t("myreward.title") }}</span>
    <div class="info" style="padding-top: 46px">
    <div class="info-content">
      <img class="background" src="~@/assets/rewardBackground.png"/>
      <div class="title-content">
        <div style="width: 50%;float: left">
          <span class="total-text">{{ $t("myreward.totalReward") }}</span>
          <div style="word-break:break-all;">
                <span class="total-number">
                  {{ dataResult.totalReward }}
                </span>
            <span class="fn-text" style="margin-top: 24px"> FN</span>
          </div>
        </div>
        <div style="width: 50%;float: right;margin-top: 5px; z-index: 1;">
          <div class="title-withdraw">
            <div style="float: right">
              <span class="withdraw-number-text" style="float: left">{{ $t("myreward.availableNumber") }}</span>
              <span class="withdraw-number">
                    {{ dataResult.availableNumber }}
                  </span>
              <span class="fn-total"> FN</span>
            </div>
          </div>
          <div style="float: right;width: 150px">
            <img class="toWithdraw-pic" src="~@/assets/toWithdraw.png">
            <img v-if="currentLang === 'zh-CN'" class="withdraw-pic" src="~@/assets/withdraw.png">
            <img v-else class="withdraw-pic-en" src="~@/assets/withdraw.png">
            <span v-if="currentLang === 'zh-CN'" @click="toWithdraw" class="withdraw-button">{{ $t("myreward.withdrawButton") }}</span>
            <span v-else @click="toWithdraw" class="withdraw-button-en">{{ $t("myreward.withdrawButton") }}</span>
            </div>
        </div>
      </div>
      <table class="sub-content">
        <tr>
          <td style="width: 50%;">
            <div>
              <div class="normal-text">
                <span class="number-text">{{ $t("myreward.releasedNumber") }}</span>
                <div>
                  <span class="normal-number">
                    {{ dataResult.releasedNumber }}
                  </span>
                  <span class="fn-text" style="margin-top: 4px"> FN</span>
                </div>
              </div>
            </div>
          </td>
          <td style="width: 50%;">
            <div>
              <div class="normal-text">
                <span class="number-text">{{ $t("myreward.toReleaseNumber") }}</span>
                <div>
                  <span class="normal-number">
                    {{ dataResult.toReleaseNumber }}
                  </span>
                  <span class="fn-text" style="margin-top: 4px"> FN</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
<!--    </a-form>-->
    </div>
    <div class="table-content">
      <div class="table-title">
       <span>{{ $t("myreward.withdrawRecord") }}</span>
      </div>
      <div v-if="checkTableLength(datas)" class="empty-content">
        <span>{{ $t('myreward.table.emptytext') }}</span>
      </div>
      <div v-else class="scroll-content">
        <div class="result-items">
          <div class="result-item" v-for="item in datas" :key="item.orderID">
            <div class="result-img"><img v-if="validate(item.status)" width="35px" height="35px" src="~@/assets/withdrawComplete.png">
              <img v-else width="35px" height="35px" src="~@/assets/inWithdraw.png"></div>
            <div class="result-txt">
              <div class="result-txt-title">{{ item.status }}</div>
              <div class="result-txt-content">
                <span>{{ item.withdrawTime }}</span>
              </div>
            </div>
            <div class="result-number">
              <span style="float: left; font-weight: bold ;font-size: 14px">{{ item.withdrawAmount }}</span>
              <span style="float: left; font-weight: bold ;font-size: 12px; margin: 2px 0 0 1px">FN</span>
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
    import { STable } from '@/components'
    import { getWithdrawList } from '@/api/manage'
    import { mapState } from 'vuex'

    export default {
        name: 'MyReward',
        components: {
            STable
        },
        data () {
            return {
                datas: [],
                dataResult: {},
                form: this.$form.createForm(this),
                visible: true,
                confirmLoading: true,
                mdl: null,
                // 查询参数
                queryParam: {},
                pageNo: 1,
                pageSize: 10,
                isLoading: false,
                noMore: false,
                statusitems: {
                  0: this.$t('myreward.status.0'),
                  1: this.$t('myreward.status.1')
                }
            }
        },
        mounted () {
          this.isLoading = true
          this.noMore = false
          this.pageNo = 1
          const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
          getWithdrawList(requestParameters)
            .then(res => {
              this.dataResult = res.data
              this.datas = []
              if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
                this.noMore = true
              }
              res.data.data.forEach(val => {
                val.withdrawTime = moment(val.withdrawTime).format('YYYY-MM-DD HH:mm')
                val.status = this.statusitems[val.status]
                this.datas.push(val)
              })
              this.isLoading = false
            })
        },
        methods: {
            toWithdraw () {
                this.$router.push({
                    path: '/center/withdraw'
                })
            },
            checkTableLength: function (value) {
              if (value.length !== 0) {
                return false
              } else {
                return true
              }
            },
            validate: function (value) {
              if (value === this.statusitems[0]) {
                return false
              } else {
                return true
              }
            },
            scroll () {
              if (!document.querySelector('#reward_info .info') || this.noMore || this.isLoading) {
                return
              }
              if (document.querySelector('#reward_info .info').offsetHeight - document.documentElement.offsetHeight - document.querySelector('#reward_info .info').parentElement.scrollTop <= 60) {
                this.isLoading = true
                this.pageNo++
                const requestParameters = Object.assign({ pageNo: this.pageNo, pageSize: this.pageSize }, this.queryParam)
                getWithdrawList(requestParameters)
                  .then(res => {
                    if (res.data.data.length === 0 || res.data.data.length < this.pageSize) {
                      this.noMore = true
                    }
                    res.data.data.forEach(val => {
                      val.withdrawTime = moment(val.withdrawTime).format('YYYY-MM-DD HH:mm')
                      val.status = this.statusitems[val.status]
                      this.datas.push(val)
                    })
                    this.isLoading = false
                  })
              }
            }
        },
        computed: {
            ...mapState({
              currentLang: state => state.app.lang
            }),
            pagination: function () {
                return {
                    defaultCurrent: 1,
                    defaultPageSize: 2,
                    showSizeChanger: true,
                    style: { textAlign: 'center', float: 'none' },
                    showTotal: function (total) {
                        return this.$t('pagination.info.total', [total])
                    }
                }
            },
            columns: function () {
                return [
                    {
                        title: this.$t('myreward.table.col.withdrawTime'),
                        dataIndex: 'withdrawTime',
                        align: 'center',
                        customRender: (text, row, index) => {
                            return moment(text).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: this.$t('myreward.table.col.orderID'),
                        dataIndex: 'orderID',
                        align: 'center'
                    },
                    {
                        title: this.$t('myreward.table.col.withdrawAmount'),
                        dataIndex: 'withdrawAmount',
                        align: 'center'
                    },
                    {
                        title: this.$t('myreward.table.col.status'),
                        dataIndex: 'status',
                        align: 'center'
                    }
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
  .reward-info {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    overflow: auto;
  }
  .title-text {
    z-index: 2;
    position: fixed;
    font-size: 20px;
    font-weight: bold;
    color: #0A0B0B;
    font-family: PingFang-SC-Bold;
    padding: 0px 15px;
    line-height: 44px;
    background-color: #ffffff;
    width: 100%;
  }
  .info-content {
    /*background-image: url('~@/assets/rewardBackground.png');*/
    /*background-size: cover;*/
    /*background-position: center;*/
    font: 14px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
    color: #4d4d4d;
    -webkit-font-smoothing: antialiased;
    font-weight: 300;
    border-radius:4px;
    margin: 0 15px;
    height: fit-content;

    position: relative;
    overflow: visible;
    margin: 0 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 0;
      pointer-events: none;
      height: 250px;
    }
  }
  .table-content {
    background:rgba(255,255,255,1);
    border-radius:4px;
    margin: 20px 15px 0 15px;
    padding: 0;
  }
  .title-content {
    z-index: 1;
    border-radius:4px;
    color: #000000;
    padding-top: 25px;
    margin: 0px 15px 0px 20px;
    float: left;
    width: 100%;
  }
  .title-total {
    font-size:16px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    float: left;
    margin: 10px 0px 0 10px;
  }
  .title-withdraw {
    margin: 0px -8px 0 0px;
    float: right;
    width: 100%;
  }
  .normal-text {
    font-family:Microsoft YaHei;
    float: left;
    margin-top: 42px;
  }
  .total-text {
    font-size: 12px;
    color: #ffffff;
  }
  .total-number {
    font-family: DIN-Medium;
    font-size: 32px;
    color: #ffffff;
    font-weight: normal;
    padding: 0;
    width: auto;
    resize: none;
    border: none;
    overflow: hidden;
    background-color: transparent;
    float: left;
  }
  .withdraw-number {
    float: left;
    font-size: 14px;
    font-weight: normal;
    color: #ffffff;
    margin-top: -6px;
    font-family: DIN-Medium;
  }
  .withdraw-number-text {
    font-size: 8px;
    color: #ffffff;
    font-family: SourceHanSansCN-Regular;
  }
  .normal-number {
    font-size: 16px;
    color: #ffffff;
    padding: 0px 0 20px 0;
    width: auto;
    resize: none;
    border: none;
    overflow: hidden;
    background-color: transparent;
    float: left;
    font-family: DIN-Medium;
  }
  .fn-text {
    float: left;
    margin-left: 2px;
    font-size: 12px;
    color: #ffffff;
    font-family: DIN-Medium;
  }
  .sub-content {
    width: -webkit-fill-available;
    margin: 0 15px;
    z-index: 1;
    width: 100%;
  }
  .table-title {
    color: #000;
    font-size: 15px;
    text-align: left;
    font-weight:bold;
    color:#999999;
    font-family: PingFang-SC-Bold;
  }
  .number-text {
    font-size: 12px;
    color: #ffffff;
  }
  .ant-input:focus {
    box-shadow: none;
  }
  .toWithdraw-pic {
    margin: 8px -15px 0px 0;
    float: right;
    width: 117px;
    height: 34px;
  }
  .withdraw-pic {
    width: 14.5px;
    height: 14.5px;
    margin: -28px 62px 0 0;
    float: right;
  }
  .withdraw-button {
    font-family: SourceHanSansCN-Regular;
    margin: -29px 5px 0 0;
    float: right;
    font-size: 12px;
    cursor: pointer;
    color: #ffffff;
  }
  .withdraw-pic-en {
    width: 14.5px;
    height: 14.5px;
    margin: -28px 78px 0 0;
    float: right;
  }
  .withdraw-button-en {
    font-family: SourceHanSansCN-Regular;
    margin: -29px -6px 0 0;
    float: right;
    font-size: 12px;
    cursor: pointer;
    color: #ffffff;
  }
  .released-pic {
    margin: 24px 0 24px 31px;
    float: left;
  }
  .fn-total {
    float: left;
    font-size: 12px;
    margin-top: -4px;
    margin-left: 2px;
    color: #ffffff;
    font-family: DIN-Medium;
  }
  .toRelease-pic {
    margin: 24px 0 24px 31px;
    float: left;
  }
  .scroll-content{
    margin-top: 20px;
    padding-bottom: 59px;
  }

  .result-info{
    font-size:26px;
    font-weight:800;
    color:rgba(153,153,153,1);
    line-height:14px;
  }
  .result-items{
  }
  .result-item{
    height: 65px;
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
    font-weight:normal;
    color:#333333;
    font-family: PingFang-SC-Medium;
  }
  .result-txt-content{
    font-size:11px;
    font-weight:normal;
    color:#999999;
  }
  .result-number{
    color: #333333;
    padding: 0 5px;
  }
  .empty-content {
    text-align: center;
    margin-top: 15px;
    font-size: 12px;
    color: #999999;
  }
</style>
