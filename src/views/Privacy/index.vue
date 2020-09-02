<template>
  <div class="main">
    <div class="header">
      <img src="~@/assets/icons/back.png" class="back" @click="() => goBack()"/>
      <span class="title">
        {{ $t('privacy.title') }}
      </span>
    </div>
    <div class="content">
      <CN v-if="currentLang === 'zh-CN'"/>
      <US v-if="currentLang === 'en-US'"/>
    </div>
  </div>
</template>
<script>
  import CN from './CN'
  import US from './US'
  import { mapState } from 'vuex'
  export default {
    components: {
      CN, US
    },
    computed: {
      ...mapState({
        currentLang: state => state.app.lang
      })
    },
    methods: {
      goBack () {
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;

    .header {
      position: relative;
      height: 44px;
      text-align: center;
      padding-top: 13px;
      border-bottom: 1px solid #e5e5e5;

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
      color: #333333;
      font-size: 13px;
      padding: 0 15px 15px 15px;

      p {
        text-indent: 2em;
      }
    }
  }
</style>
