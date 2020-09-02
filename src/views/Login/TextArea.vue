<template>
  <div class="outer">
    <div v-if="!content" class="placeholder">
      <img src="~@/assets/icons/user.png"/>
      <span>{{ $t('login.keystore.placeholder') }}</span>
    </div>
    <textarea
      :rows="4"
      v-model="content"
      @change="handleChange"
      @blur="e => $emit('blur',e)"
    />
  </div>
</template>

<script>

  export default {
    name: 'TextArea',
    props: {
      // eslint-disable-next-line vue/require-default-prop
      value: {
        type: String
      }
    },
    data () {
      return {
        content: this.value
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .outer {
    position: relative;
    line-height: 13px;

    .placeholder {
      pointer-events: none;
      position: absolute;
      left: 18px;
      top: 15px;
      display: flex;
      justify-content: center;

      img {
        height: 16px;
        margin-right: 5px;
      }

      span {
        color: #999999;
        font-size: 13px;
        line-height: 13px;
      }
    }

    textarea {
      width: 100%;
      resize: none;
      padding: 15px;
      font-size: 13px;
      line-height: 13px;
      background-color: #F6F7F9;
      border: none;
      border-radius: 4px;
      outline: none;
    }
  }
</style>
