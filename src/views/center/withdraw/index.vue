<template>
  <div :bordered="false" style="background-color: #F0F0F0;height: 100%">
    <div class="title-content">
      <img class="reward-back" @click="() => this.$router.back()" style="width: 12px;height: 20px" src="~@/assets/icons/back.png">
      <span class="sub-title">{{ $t('withdraw.title') }}</span>
    </div>
    <div class="content">
      <div style="margin: 15px">
        <table>
          <tr valign="top">
            <td style="width: 22%;padding-top: 19px;">
              <p style="margin-bottom: 0"><span class="note-text">{{ $t("withdraw.info.address") }}</span></p>
            </td>
            <td style="width: 78%;word-break:break-all;padding-top: 19px;">
              <p style="margin-bottom: 0"><span class="note-text">{{ address }}</span></p>
            </td>
          </tr>
        </table>
        <p style="margin-bottom: 0;margin-top: 35px"><span class="note-text">{{ $t("withdraw.withdrawNumber") }}</span></p>
        <table>
          <tr>
            <td style="width: 10%">
              <img style="width: 29px;height: 29px" src="~@/assets/FNLogo.png">
            </td>
            <td style="width: 90%">
              <input
                type="number"
                step="0.01"
                class="input-text"
                v-model="form.withdrawNumber"
                @input="handleInput"/>
            </td>
          </tr>
        </table>
        <div class="divider-line"></div>
        <p style="margin: 15px 0 30px 0px"><span class="info-text">{{ $t("withdraw.availableNumber") }}{{ availableNumber }} FN</span></p>
        <div style="text-align: center;padding-bottom: 15px;">
          <a-button class="submit-button" @click="handleSubmit" :disabled="!inputFlag" type="primary" >{{ $t("withdraw.withdrawButton") }}</a-button>
        </div>
      </div>
    </div>
    <a-modal
      class="modal"
      :width="300"
      :visible="passwordModalVisible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true">
      <div class="modalTitle">
        {{ $t('withdraw.modal.password.title') }}
      </div>
      <div class="modalContent">
        <a-input-password class="input-password" :placeholder="$t('withdraw.input.password.tip')" v-model="password"/>
      </div>
      <div class="modalButton">
        <div class="cancel" @click="handlePasswordCancel">{{ $t('withdraw.modal.password.button.cancel') }}</div>
        <a-spin style="outline: none;border: none" v-if="onEnter"/>
        <div v-else class="login" @click="handlePasswordEnter">{{ $t('withdraw.modal.password.button.enter') }}</div>
      </div>
    </a-modal>
  </div>

</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { withdrawReward, getTax } from '@/api/withdraw'
  import bs58 from 'bs58'
  import InputNumber from '@/components/InputNumber'
  import { build } from '@/utils/keyStore'
  export default {
    name: 'withdraw',
    components: {
      InputNumber
    },
    data () {
      return {
        tax: '0',
        availableNumber: '0',
        address: this.$store.getters.address,
        form: {
          withdrawNumber: '',
          arrivalNumber: '0'
        },
        // form: this.$form.createForm(this),
        onEnter: false,
        passwordModalVisible: false,
        password: '',
        inputFlag: false
      }
    },
    mounted () {
      getTax().then(res => {
        this.tax = res.data.tax
        this.availableNumber = res.data.availableNumber.toFixed(2)
        console.log(res.data)
      })
    },
    computed: {
      ...mapState({
        keystore: (state) => state.user.keystore,
        master: (state) => state.order.master
      }),
      arrivalNumber () {
        const { withdrawNumber } = this.form
        if (!withdrawNumber || withdrawNumber <= this.tax) {
          return 0
        }
        return parseFloat(withdrawNumber - this.tax).toFixed(2)
      }
    },
    methods: {
      ...mapActions(['DoWithdraw']),
      handleInput () {
        if (this.form.withdrawNumber !== '') {
          this.inputFlag = true
        } else {
          this.inputFlag = false
        }
        if (parseFloat(this.form.withdrawNumber) > parseFloat(this.availableNumber)) {
          this.form.withdrawNumber = this.availableNumber
        }
        this.form.withdrawNumber = this.form.withdrawNumber.match(/^\d*(\.?\d{0,2})/g)[0]
      },
      handleSubmit () {
        const { withdrawNumber } = this.form
        if (withdrawNumber === '' || withdrawNumber === '0') {
          this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.space.error'), key: 'message' })
          return
        }
        if (parseFloat(withdrawNumber) > parseFloat(this.availableNumber)) {
          this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.size.error'), key: 'message' })
          return
        }
        if (withdrawNumber <= this.tax) {
          this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.number.error'), key: 'message' })
          return
        }
        this.passwordModalVisible = true
      },
      handlePasswordCancel () {
        this.passwordModalVisible = false
        this.password = ''
      },
      handlePasswordEnter () {
        this.onEnter = true
        const { keystore, password, form } = this
        if (!password) {
          this.$message.error({ content: this.$t('withdraw.validate.password.blank'), key: 'message' })
          this.onEnter = false
          return
        }
        const wallet = build({ keystore, password })
        if (!wallet) {
          this.$message.error({ content: this.$t('withdraw.validate.password.error'), key: 'message' })
          this.password = ''
          this.onEnter = false
          return
        }
        const hex = wallet.getAddress().toString('hex')
        const bytes = []
        for (let i = 0; i < hex.length; i++) {
          bytes.push(hex[i].charCodeAt(0))
        }
        const to = bs58.encode(bytes)
        const key = wallet.getPrivateKey().toString('hex')
        const { withdrawNumber } = form
        // const value = withdrawNumber
        if (to && withdrawNumber && key) {
          // const { DoWithdraw } = this
          // DoWithdraw(to, value)
          // const requestParameters = Object.assign({}, to, value)
          const params = {
            'to': [],
            'value': []
          }
          params.to = to
          params.value = withdrawNumber
          withdrawReward(params)
            .then(() => {
              this.$message.success({ content: this.$t('withdraw.cash.success'), key: 'message' })
                .then(() => {
                  this.$router.back()
                })
            })
            .finally(() => {
              this.password = ''
              this.passwordModalVisible = false
              this.onEnter = false
            })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .info-text {
    font-size: 11px;
    color: #999999;
  }
  .title-content {
    width: 100%;
    height: 40px;
    background-color: #F0F0F0;
    width: -webkit-fill-available;
  }
  .content {
    color: #2E323D;
    margin: 10px 15px 0 15px;
    font-size: 14px;
    background-color: #ffffff;
  }
  .reward-back{
    margin: 17px 0 0 15px;
    font-size:16px;
    font-weight:400;
    color:rgba(38,193,149,1);
    line-height:26px;
    float: left;
  }
  .cancelButton{
    width: 50%;
    height: 50px;
    margin-top: 15px;
    color: #666666;
    border: none;
    font-size: 14px;
  }
  .loginButton{
    width: 50%;
    height: 50px;
    margin-top: 15px;
    color: #26C195;
    border: none;
    font-size: 14px;
  }
  .sub-content{
    margin-top: 20px;
  }
  .sub-title {
    padding: 13px 0px;
    font-size: 20px;
    color: #333333;
    font-weight: bold;
    line-height:26px;
    display: block;
    text-align: center;
    margin-left: -24px;
    width: 100%;
    font-family: PingFang-SC-Bold;
  }
  .input-text {
    border: 0;
    caret-color:#26C195;
    outline: 0;
    color: #333333;
    width: 100%;
    margin-left: 10.5px;
    font-size: 30px;
    font-weight: bold;
    font-family: DIN-Bold;
    padding: 15px 0;
  }
  .divider-line {
    position: relative;
    width: 100%;
    height: 1px;
    background-color: #E5E5E5;
    text-align: center;
  }
  .submit-button {
    width: 100%;
    height:45px;
    background:rgba(38,193,149,1);
    border-radius:4px;
    border: none;
    font-size: 15px;
    &:disabled {
      background-color: #F2F2F2;
      color: #999999;
    }
  }
  .note-title {
    font-size: 16px;
    color: #2E323D;
    font-weight: bold;
  }
  .note-text {
    font-size: 13px;
    color: #2E323D;
  }
  .all-text {
    color: #26C195;
    margin-left: 5px;
    font-size: 12px;
  }
  .normal-text {
    font-size: 14px;
    color: #333333;
    margin: 40px;
  }
  .note-area {
    margin: 40px 0 0 55px;
    height: 100%;
  }
  .input-password {
    height: 44px;
    font-size: 12px;
    color: #999999;
  }
  .modal {
    .modalTitle {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    .modalContent {
      text-align: center;
      font-size: 14px;
      margin-top: 10px;
      padding: 0 0px;
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
          height: 50px;
          margin-top: 15px;
          color: #999999;
          border: none;
          font-size: 14px;

          &:hover {
            color: lighten(#2E323D, 10%)
          }
        }

        &.login {
          height: 50px;
          margin-top: 15px;
          color: #26C195;
          border: none;
          font-size: 14px;

          &:hover {
            color: lighten(#26C195, 10%);
          }
        }
      }
    }
  }

</style>
<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  input {
    -moz-appearance: textfield !important;
  }
</style>
