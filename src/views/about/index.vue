<template>
  <div class="about-content">
    <div class="header">
      <img src="~@/assets/icons/back.png" class="back" @click="() => this.$router.push('/menu/mycenter')"/>
      <span class="title">
        {{ $t('about.title') }}
      </span>
    </div>
    <div style="width: 100%; height: 102px;">
      <img style="margin:30px auto;display: block;" width="63px" height="72px" src="~@/assets/logo.png" />
    </div>
    <div style="padding: 0 18px 0 16px;width: 100%;font-size: 13px;color: #333333;">
      <div>{{ $t('about.text.1') }}</div>
      <div style="margin-top: 1.2em;">{{ $t('about.text.2.1') }}</div>
      <div style="margin-top: 1.2em;">{{ $t('about.text.2.2') }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'About'
  }
</script>

<style lang="less" scoped>
  .about-content {
    width: 100%;
    padding: 0;
    background-color: #FFFFFF;
    font-family: PingFang-SC-Bold;

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
  }
</style>
