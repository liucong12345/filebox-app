<template>
  <div class="main">
    <div class="header">
      <img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/>
      <span class="title">
        {{ $t('lang.title') }}
      </span>
    </div>
    <div
      v-for="(v,k) in langMap"
      :key="k"
      :class="{
        item : true,
        selected : currentLang === k
      }"
      @click="() => { setLang(k) }">
      <div class="border"></div>
      <span class="text">{{ v }}</span>
      <div class="outer">
        <div class="inner"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        langMap: {
          'en-US': 'English',
          'zh-CN': '中文简体'
        }
      }
    },
    computed: {
      ...mapState({
        currentLang: state => state.app.lang
      })
    },
    methods: {
      setLang (lang) {
        this.$store.dispatch('setLang', lang)
      },
      goBack () {
        this.$router.push('/menu/mycenter')
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

    .item {
      position: relative;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 15px;
      background-color: #ffffff;

      &:hover {
        background-color: #fcfcfc;
        cursor: pointer;
      }

      .border {
        position: absolute;
        width: 80%;
        left: 10%;
        bottom: 0;
        height: 1px;
        background-color: #e5e5e5;
      }

      &:last-child {
        .border {
          display: none;
        }
      }

      .text {
        color: #666666;
        font-size: 14px;
      }

      .outer {
        margin-left: auto;
        position: relative;
        width: 14px;
        height: 14px;
        border: 1px solid #999999;
        border-radius: 50%;
      }

      &.selected {
        .text {
          color: #26C195;
          font-weight: bold;
        }

        .outer {
          .inner {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 8px;
            height: 8px;
            background-color: #26c195;
            border: none;
            border-radius: 50%;
          }
        }
      }
    }
  }
</style>
