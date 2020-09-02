<template>
  <div class="hash-search">
    <div class="top-area">
      <div class="top-title">
        <span>{{ $t('hashsearch.title') }}</span>
      </div>
      <div class="top-search input-ss">
        <a-input aria-readonly="true" :placeholder="$t('filesearch.input.hashsearch.tip')" @click="()=>this.$router.push('/center/filesearch?type=hash')">
          <img width="24px" height="24px" slot="prefix" src="~@/assets/search-icon.png" >
        </a-input>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'HashSearch'
    }
</script>

<style lang="less" >
  .hash-search{
    font-family: PingFang SC;

    .top-area {
      width: 100%;
      height: 97px;
      background-color: #FFFFFF;
    }

    .top-title{
      width: 100%;
      padding: 7px 15px 0;
      font-size: 20px;
      font-weight: bold;
      color: rgba(10, 11, 11, 1);
      width: 100%;
    }
    .top-search {
      margin: 0px;
      padding: 8px 15px 11px 15px;
    }

    /* 输入框*/
    .input-ss {
      .ant-input {
        background-color: #EFEFEF;
        font-size: 14px;
        color: rgba(153, 153, 153, 1);
        height: 40px;
        line-height: 40px;
        font-weight: 400;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        border-color: #EFEFEF;
      }

      .ant-input-affix-wrapper .ant-input:not(:first-child) {
        padding-left: 35px;
      }

      .ant-input:hover {
        border-color: #EFEFEF;
      }

      .ant-input:focus {
        border-color: #EFEFEF;
        -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.08);
      }

      .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
        border-color: #EFEFEF;
      }

      .ant-input::-moz-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }

      .ant-input:-ms-input-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }

      .ant-input::-webkit-input-placeholder {
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
</style>
