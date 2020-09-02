<template>
  <div class="main">
    <div class="wrapper">
      <div class="header">
        <img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/>
        <span class="title">
          {{ totalSize ? $t('buy.title.expansion') : $t('buy.title.buy') }}
        </span>
      </div>
      <div class="content">
        <a-form-model ref="orderForm" :model="form">
          <div class="card" style="height: 100px">
            <a-row type="flex" align="middle">
              <a-col :span="8" :offset="1">
                <label>{{ $t('buy.item.space') }}:</label>
              </a-col>
              <div>
                <InputNumber
                  :min="0"
                  :unit="master.unitSpace"
                  v-model="form.space"
                />
              </div>
              <div style="padding-left: 5px">
                <span>G</span>
              </div>
            </a-row>
            <a-row style="padding-top: 8px">
              <a-col :span="20" :offset="1" class="message">
                <span>({{ `${$t('buy.message.price')}${master.unitFNCoin}FN/${master.unitSpace}G${totalSize ? ('; ' + $t('buy.title.message.prefix') + formatTotalSize) : '' }` }})</span>
              </a-col>
            </a-row>
          </div>
          <div class="card" style="height: 80px;padding-top: 20px">
            <a-row type="flex" align="middle">
              <a-col :span="8" :offset="1">
                <label>{{ $t('buy.item.time') }}:</label>
              </a-col>
              <a-col :span="10">
                <a-select
                  size="large"
                  v-if="master.timePercentageList"
                  v-model="form.time"
                >
                  <img style="height: 15px" slot="suffixIcon" src="~@/assets/icons/down.png"/>
                  <a-select-option v-for="item in master.timePercentageList" :key="item.time">
                    {{ `${item.time}${item.time > 1 ? $t('buy.item.time.unit') : $t('buy.item.time.unit-single')}` }}
                  </a-select-option>
                </a-select>
                <a-spin v-else/>
              </a-col>
            </a-row>
          </div>
          <div class="card" style="height: 97px;padding-top: 20px">
            <a-row>
              <a-col :span="8" :offset="1">
                <label>{{ $t('buy.item.percentage') }}</label>
              </a-col>
              <a-col :span="10">
                {{ `${percentage}% (${reward || 0} FN)` }}
              </a-col>
            </a-row>
            <a-row type="flex" align="bottom">
              <a-col :span="8" :offset="1">
                <label>{{ $t('buy.item.price') }}</label>
              </a-col>
              <a-col class="price" :span="8">
                <span class="num">
                  {{ price }}
                </span>
                <span class="unit">
                  FN
                </span>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
        <a-modal
          class="passwordModal"
          :width="300"
          :visible="passwordModalVisible"
          :footer="null"
          :closable="false"
          :destroyOnClose="true">
          <div class="modalContent">
            <label>{{ $t('buy.modal.password.content') }}</label>
            <a-input-password :placeholder="$t('buy.modal.password.placeholder')" v-model="password"/>
          </div>
          <div class="modalButton">
            <div class="cancel" @click="handlePasswordCancel">{{ $t('buy.modal.password.button.cancel') }}</div>
            <a-spin v-if="onEnter"/>
            <div v-else class="login" @click="handlePasswordEnter">{{ $t('buy.modal.password.button.enter') }}</div>
          </div>
        </a-modal>
      </div>
    </div>
    <a-row class="btn">
      <a-button
        class="submit"
        type="primary"
        @click="handleSubmit">
        {{ totalSize ? $t('buy.submit2') : $t('buy.submit') }}
      </a-button>
    </a-row>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import bs58 from 'bs58'
  import { build, signIn } from '@/utils/keyStore'
  import InputNumber from '@/components/InputNumber'
  import { formatFileSize } from '@/utils/util'

  export default {
    name: 'Buy',
    components: {
      InputNumber
    },
    data () {
      return {
        form: {
          space: 0,
          time: undefined
        },
        onEnter: false,
        passwordModalVisible: false,
        password: ''
      }
    },
    computed: {
      ...mapState({
        keystore: (state) => state.user.keystore,
        master: (state) => state.order.master,
        totalSize: (state) => state.user.totalSize
      }),
      formatTotalSize () {
        const { totalSize } = this
        return totalSize ? formatFileSize(totalSize, 2, false, true) : 0
      },
      percentage () {
        const { master } = this
        const { time } = this.form
        if (master && time) {
          const { timePercentageList } = master
          if (timePercentageList) {
            for (let i = 0; i < timePercentageList.length; i++) {
              const timePercentage = timePercentageList[i]
              const { time: tTime, percentage: tPercentage } = timePercentage
              if (tTime && tPercentage) {
                if (time === tTime) {
                  return tPercentage
                }
              }
            }
          }
        }
        return 0
      },
      price () {
        const { master } = this
        if (master) {
          const { unitFNCoin, unitSpace } = master
          if (unitFNCoin && unitSpace) {
            const { space } = this.form
            return parseFloat((space * unitFNCoin / unitSpace).toFixed(5))
          }
        }
        return 0
      },
      reward () {
        const { price, percentage } = this
        return parseFloat((price * percentage / 100).toFixed(5))
      }
    },
    methods: {
      ...mapActions(['GetOrderMaster', 'GetSpaceInfo', 'BuySpace']),
      handleSubmit () {
        const { space, time } = this.form
        if (!space) {
          this.$message.error({ content: this.$t('buy.validate.space.error'), key: 'message' })
          return
        }
        if (space > 1024 * 1024) {
          this.$message.error({ content: this.$t('buy.validate.space.max'), key: 'message' })
          return
        }
        if (!time) {
          this.$message.error({ content: this.$t('buy.validate.time.error'), key: 'message' })
          return
        }
        this.passwordModalVisible = true
      },
      handlePasswordCancel () {
        this.password = ''
        this.passwordModalVisible = false
      },
      handlePasswordEnter () {
        this.onEnter = true
        const { keystore, master, price, password, form } = this
        const { address: to } = master
        if (!password) {
          this.$message.error({ content: this.$t('buy.validate.password.blank'), key: 'message' })
          this.onEnter = false
          return
        }
        const wallet = build({ keystore, password })
        if (!wallet) {
          this.$message.error({ content: this.$t('buy.validate.password.error'), key: 'message' })
          this.password = ''
          this.onEnter = false
          return
        }
        const hex = wallet.getAddress().toString('hex')
        const bytes = []
        for (let i = 0; i < hex.length; i++) {
          bytes.push(hex[i].charCodeAt(0))
        }
        const from = bs58.encode(bytes)
        const key = wallet.getPrivateKey().toString('hex')
        if (from && to && price && key) {
          const signResult = signIn({ from, to, price, key })
          if (signResult) {
            const { BuySpace } = this
            const { space, time } = form
            BuySpace({ ...signResult, price, space, time })
              .then(() => {
                this.$message.success({ content: this.$t('buy.order.success'), key: 'message' })
                  .then(() => {
                    this.$router.push('/center/myorder')
                  })
              })
              .finally(() => {
                this.password = ''
                this.passwordModalVisible = false
                this.onEnter = false
              })
          }
        }
      },
      goBack () {
        this.$router.push('/menu/mycenter')
      }
    },
    mounted () {
      const { GetOrderMaster, GetSpaceInfo } = this
      GetOrderMaster()
        .then(() => {
          const { master } = this
          if (master.timePercentageList.some(i => {
            return i.time === 12
          })) {
            this.form.time = 12
          }
        })
      GetSpaceInfo()
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    height: 100%;
    min-height: 100%;

    .wrapper {
      height: auto;
      min-height: 100%;
      background-color: #ededed;
      padding-bottom: 95px;
    }

    .header {
      position: relative;
      height: 44px;
      text-align: center;
      padding-top: 13px;

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

      flex-grow: 1;
      background-color: #ededed;
      color: #333333;
      font-size: 14px;

      .card {
        background-color: #ffffff;
        padding: 10px 5px;
        margin-bottom: 10px;

        .message {
          text-align: left;
          color: #999999;
          font-size: 11px;
        }

        .price {
          color: #26C195;
          vertical-align: baseline;

          .num {
            font-size: 30px;
            line-height: 30px;
          }

          .unit {
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
    }

    .btn {
      margin-top: -75px;
      height: 75px;

      .submit {
        background-color: #26C195;
        height: 45px;
        width: 100%;
        border: none;
        border-radius: 4px;

        &:hover {
          background-color: lighten(#26C195, 10%);
        }
      }

      padding: 0 30px;
      text-align: center;
    }
  }

  .passwordModal {
    .modalTitle {
      text-align: center;
      font-size: 18px;
    }

    .modalContent {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 25px;

      label {
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 15px;
      }
    }

    .modalButton {
      font-size: 16px;
      display: flex;
      margin: 0 -24px -24px -24px;

      div {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 50%;
        cursor: pointer;

        &.cancel {
          color: #000;

          &:hover {
            color: lighten(#000000, 10%)
          }
        }

        &.login {
          color: #26C195;

          &:hover {
            color: lighten(#26C195, 10%);
          }
        }
      }
    }
  }
</style>
