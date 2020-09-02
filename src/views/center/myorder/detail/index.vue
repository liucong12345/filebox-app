<template>
  <div class="main">
    <div class="wrapper">
      <div class="header">
        <img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/>
        <span class="title">
          {{ $t('myorder.detail.header') }}
        </span>
      </div>
      <div class="content">
        <div class="line"></div>
        <a-form-model>
          <div class="card">
            <a-row class="arowclass" >
              <a-col :span="10" :push="1"  class="title">
                {{ result[0] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ datarlt.orderNo }}
              </a-col>
            </a-row>
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[1] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ this.statusitems[datarlt.status] }}
              </a-col>
            </a-row>
<!--            <a-row class="arowclass">-->
<!--              <a-col :span="10" :push="1" class="title">-->
<!--                {{ result[2] }}:-->
<!--              </a-col>-->
<!--              <a-col :span="10" :push="2" class="value">-->
<!--                {{ this.moment(datarlt.createTime) }}-->
<!--              </a-col>-->
<!--            </a-row>-->
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[3] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{  formatFileSize(datarlt.spaceSize) }}
              </a-col>
            </a-row>
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[4] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ datarlt.pledgeFnAmount }}{{ this.$t('myorder.pledgeFnAmount.unit') }}
              </a-col>
            </a-row>
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[5] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ datarlt.pledgePeriod }}{{ this.$t('myorder.pledgePeriod.unit') }}
              </a-col>
            </a-row>
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[6] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ this.totimeCalculate(datarlt.createTime,datarlt.pledgePeriod) }}
              </a-col>
            </a-row>
            <a-row class="arowclass">
              <a-col :span="10" :push="1" class="title">
                {{ result[7] }}:
              </a-col>
              <a-col :span="10" :push="2" class="value">
                {{ datarlt.rewardPercent }}%（{{ this.rewardCalculate(datarlt.rewardPercent ,datarlt.pledgeFnAmount ) }}{{ this.$t('myorder.pledgeFnAmount.unit') }}）
              </a-col>
            </a-row>
          </div>
        </a-form-model>

      </div>
    </div>

  </div>
</template>
<script>
  import moment from 'moment'
  import { getPledgeDetail } from '@/api/manage'
  import { formatFileSize2 } from '@/utils/util'

  export default {
    name: 'OrderDetail',
      statusitems: {},
    data () {
      return {
          datarlt: {},
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 查询参数
        queryParam: {}
      }
    },
    computed: {
      statusitems: function () {
        return {
          0: this.$t('myorder.status.0'),
          1: this.$t('myorder.status.1'),
          2: this.$t('myorder.status.2')
        }
      },
        result: function () {
            return [
                this.$t('myorder.table.col.orderId'),
                this.$t('myorder.table.col.status'),
                this.$t('myorder.table.col.createTime'),
                this.$t('myorder.table.col.space'),
                this.$t('myorder.table.col.pledgeFnAmount'),
                this.$t('myorder.table.col.pledgePeriod'),
                this.$t('myorder.detail.totime'),
                this.$t('myorder.detail.rewardAmount')
            ]
        }
    },
      mounted () {
          getPledgeDetail(this.$route.query)
              .then(res => {
                  this.datarlt = res.data.data[0]
              })
      },
    methods: {
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
        moment (text) {
            return moment(text).format('YYYY-MM-DD HH:mm')
        },
        rewardCalculate (rewardPercent, pledgeFnAmount) { // 保留小数点后两位
          var rlt1 = rewardPercent * pledgeFnAmount / 100
          return rlt1.toFixed(2)
        },
        totimeCalculate (createTime, pledgePeriod) {
            return moment(createTime).add(pledgePeriod, 'months').format('YYYY-MM-DD HH:mm')
        },
      goBack () {
        this.$router.push('/center/myorder/')
      },
      formatFileSize: function (fileSize) {
        if (fileSize != null && fileSize !== '') {
          return formatFileSize2(fileSize, 2, false, true)
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .arowclass{
    height: 36px;
  }
  .main {
    background-color: #fff;
    height: 100%;
    min-height: 100%;

    .wrapper {
      height: auto;
      min-height: 100%;
      background-color: #ededed;
      padding-bottom: 100px;
    }

    .header {
      position: relative;
      height: 44px;
      text-align: center;
      padding-top: 13px;
      background-color: #F9F9F9;

      .back {
        position: absolute;
        top: 12px;
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
      /*width:345px;*/
      height:290px;
      background:rgba(255,255,255,1);
      box-shadow:0px 9px 38px 0px rgba(177,177,177,0.08);
      border-radius:8px;
      flex-grow: 1;
      font-size: 14px;
      margin-left: 15px;
      margin-right: 15px;
      margin-top: 15px;
      font-family:PingFang SC;
      .line {
        height:2px;
        background:rgba(38,193,149,1);
        border-radius:2px;
      }
      .card {
        background-color: #ffffff;
        padding: 29px 21px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;

        .value {
          text-align: left;
          color: #333333;
          font-size: 13px;
          font-family: PingFang-SC-Bold;
          font-weight: Bold;
        }
        .title {
          text-align: left;
          color: #999999;
          font-size: 13px;
          vertical-align: baseline;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
        }
      }
    }

  }
</style>
