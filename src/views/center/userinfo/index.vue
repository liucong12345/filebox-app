<template>
  <div class="main">
    <div class="header">
      <img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/>
      <span class="title">
        {{ $t('userinfo.title') }}
      </span>
    </div>
    <div class="card card1">
      <img src="~@/assets/userinfo-avator.png"/>
      <p>
        <span class="label">{{ $t('userinfo.label.address') }}</span>
        <br/>
        <span class="address">{{ address }}</span>
      </p>
    </div>
    <div class="card card2">
      <label>{{ $t('userinfo.label.balance') }}</label>
      <span>{{ `${balance} ` }}<span>FN</span></span>
    </div>
    <div class="card card3">
      <div class="info-qrcode">{{ $t('userinfo.label.qrcode') }}</div>
      <div class="qrcode-wrapper">
        <img class="qrcode-bg" src="~@/assets/qrcode-bg.png">
        <div id="qrcode" ref="qrcode"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import { getUserInfo } from '@/api/userinfo'

  export default {
    name: 'UserInfo',
    data () {
      return {
        address: this.$store.getters.address,
        balance: '0'
      }
    },
    mounted () {
      getUserInfo().then(res => {
        if (res.resultCode === '0') {
          this.balance = (Number(res.data.balance) / 1000000000).toFixed(2)
        } else {
          this.$message.error(this.$t('userinfo.fail.message'))
        }
      })
      this.creatQrCode()
    },
    methods: {
      creatQrCode () {
        // eslint-disable-next-line no-new
        new QRCode('qrcode', {
          text: this.address,
          width: 110,
          height: 110,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      },
      goBack () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    height: 100%;
    min-height: 100%;
    background-color: #F9F9F9;

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

    .card {
      background-color: #ffffff;
      margin-bottom: 10px;
    }

    .card1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100px;

      img {
        height: 50px;
        margin: 0 25px;
      }

      p {
        width: auto;
        margin: 0 25px 0 0;
        word-break: break-all;
        font-size: 14px;

        .label {
          color: #666666;
        }

        .address {
          color: #333333;
        }
      }
    }

    .card2 {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 60px;

      label {
        font-size: 14px;
        color: #666666;
        margin: 0 25px;
      }

      span {
        color: #D84747;
        font-size: 30px;

        span {
          font-size: 14px;
        }
      }
    }

    .card3 {
      .info-qrcode {
        color: #666666;
        font-size: 14px;
        padding: 25px 0 25px 25px;
      }

      .qrcode-wrapper {
        position: relative;
        text-align: center;
        padding-bottom: 25px;

        .qrcode-bg {
          width: 120px;
        }

        #qrcode {
          position: absolute;
          top: 5px;
          left: calc(50% - 55px);
        }
      }
    }
  }
</style>
