<template>
  <div class="main">
    <div class="header">
      <span class="title">{{ $t('menu.mycenter') }}</span>
    </div>
    <div class="card">
      <img class="background" src="~@/assets/center-card.png"/>
      <div class="left">
        <p style="max-width: 170px">
          <span class="line1">
            {{ $t('mycenter.line1') }}
          </span>
          <br/>
          <span class="line2">
            {{ $t('mycenter.line2') }}
          </span>
        </p>
      </div>
      <div class="right">
        <div class="button" @click="() => this.$router.push('/buy')">
          <span>
            <span>
              {{ totalSize ? $t('mycenter.button2') : $t('mycenter.button') }}
            </span>
            <img src="~@/assets/icons/right.png"/>
          </span>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="item" @click="() => this.$router.push('/center/myorder')">
        <img class="icon" src="~@/assets/icons/myorder.png"/>
        <span class="text">{{ $t('mycenter.item.1') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
      <div class="item" @click="() => this.$router.push('/center/myspace')">
        <img class="icon" src="~@/assets/icons/myspace.png"/>
        <span class="text">{{ $t('mycenter.item.2') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
      <div class="item" @click="() => this.$router.push('/center/userinfo')">
        <img class="icon" src="~@/assets/icons/accountinfo.png"/>
        <span class="text">{{ $t('mycenter.item.3') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
      <div class="item" @click="() => this.$router.push('/center/lang')">
        <img class="icon" src="~@/assets/icons/lang.png"/>
        <span class="text">{{ $t('mycenter.item.4') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
      <div class="item" @click="() => this.$router.push('/about')">
        <img class="icon" src="~@/assets/icons/about.png"/>
        <span class="text">{{ $t('mycenter.item.6') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
      <div class="item" @click="handleLogout">
        <img class="icon" src="~@/assets/icons/logout.png"/>
        <span class="text">{{ $t('mycenter.item.5') }}</span>
        <img class="next" src="~@/assets/icons/next.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'MyCenter',
    computed: {
      ...mapState({
        totalSize: (state) => state.user.totalSize
      })
    },
    methods: {
      ...mapActions(['GetSpaceInfo']),
      handleLogout () {
        this.$store.dispatch('Logout').then(() => {
          this.$router.push('/')
        })
      }
    },
    mounted () {
      const { GetSpaceInfo } = this
      GetSpaceInfo()
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #ffffff;

    .header {
      height: 44px;
      display: flex;
      align-items: center;
      color: #0A0B0B;

      .title {
        margin-left: 15px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .card {
      position: relative;
      overflow: visible;
      height: 37vw;
      margin: 0 15px;
      display: flex;
      flex-direction: row;

      .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 0;
        pointer-events: none;
      }

      .left {
        width: 60%;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;

        .line1 {
          font-size: 24px;
        }

        .line2 {
          font-size: 12px;
        }
      }

      .right {
        width: 40%;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .button {
          background-image: linear-gradient(-90deg, #F77A6B, #EEA44D);
            width: 100px;
          height: 35px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          &:hover {
            background-image: linear-gradient(-90deg, lighten(#F77A6B, 10%), lighten(#EEA44D, 10%));
            cursor: pointer;
          }

          span {
            color: #ffffff;
            font-size: 14px;

            img {
              height: 7px;
              vertical-align: 2px;
            }
          }
        }
      }
    }

    .menu {
      margin-top: 20px;
      padding: 0;

      .item {
        height: 50px;
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        &:hover {
          background-color: #eeeeee;
        }

        .icon {
          height: 20px;
          width: 20px;
          margin-right: 12px;
        }

        .text {
          color: #333333;
          font-size: 14px;
        }

        .next {
          height: 25px;
          margin-left: auto;
        }
      }
    }
  }
</style>
