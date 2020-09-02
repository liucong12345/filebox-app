<template>
  <div class="outer">
    <div v-if="!content" class="placeholder">
      <img src="~@/assets/icons/password.png"/>
      <span>{{ $t('login.keystorepassword.placeholder') }}</span>
    </div>
    <a-icon class="visible" @click="toggleVisible" :type="visible ? 'eye-invisible':'eye'"/>
    <input
      :type="visible ? 'text':'password'"
      v-model="content"
      @change="handleChange"
      @blur="e => $emit('blur',e)"
    />
  </div>
</template>

<script>

  export default {
    name: 'Input',
    props: {
      // eslint-disable-next-line vue/require-default-prop
      value: {
        type: String
      }
    },
    data () {
      return {
        content: this.value,
        visible: false
      }
    },
    methods: {
      toggleVisible () {
        this.visible = !this.visible
      },
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

    .visible {
      position: absolute;
      font-size: 16px;
      top: 8px;
      right: 5px;
      color: #999999;
    }

    .placeholder {
      pointer-events: none;
      position: absolute;
      top: 8px;
      left: 18px;
      display: flex;
      justify-content: center;
      align-items: center;

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

    input {
      width: 100%;
      padding: 8px 15px;
      font-size: 13px;
      line-height: 13px;
      background-color: #F6F7F9;
      border: none;
      border-radius: 4px;
      outline: none;
    }
  }
</style>
