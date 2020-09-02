<template>
  <div class="outer">
    <a-icon class="btn l" slot="addonBefore" type="minus" @click.stop="minus"/>
    <a-input class="input" v-model="currentValue" @blur="handleBlur" @change="handleChange"/>
    <a-icon class="btn r" slot="addonAfter" type="plus" @click.stop="plus"/>
  </div>
</template>

<script>

  export default {
    name: 'IconSelect',
    props: {
      // eslint-disable-next-line vue/require-default-prop
      max: {
        type: Number,
        defaultValue: undefined
      },
      // eslint-disable-next-line vue/require-default-prop
      min: {
        type: Number,
        defaultValue: undefined
      },
      // eslint-disable-next-line vue/require-default-prop
      unit: {
        type: Number,
        defaultValue: 100
      },
      // eslint-disable-next-line vue/require-default-prop
      value: {
        type: Number
      }
    },
    data () {
      return {
        currentValue: 0
      }
    },
    methods: {
      check (str) {
        const { max, min, unit } = this.$props
        let num = parseInt(str)
        if (num) {
          if (max !== undefined && num > max) {
            num = max
          }
          if (min !== undefined && num < min) {
            num = min
          }
          if (unit) {
            return Math.round(num / unit) * unit
          }
          return num
        } else {
          return 0
        }
      },
      handleBlur () {
        const checkResult = this.check(this.currentValue)
        this.currentValue = checkResult.toString()
        this.$emit('input', checkResult)
      },
      handleChange () {
        const checkResult = this.check(this.currentValue)
        this.$emit('input', checkResult)
      },
      plus () {
        const { unit } = this.$props
        const num = parseInt(this.currentValue)
        if (num !== undefined && !isNaN(num)) {
          const checkResult = this.check(num + unit)
          this.currentValue = checkResult.toString()
          this.$emit('input', checkResult)
        }
      },
      minus () {
        const { unit } = this.$props
        const num = parseInt(this.currentValue)
        if (num !== undefined && !isNaN(num)) {
          const checkResult = this.check(num - unit)
          this.currentValue = checkResult.toString()
          this.$emit('input', checkResult)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .outer {
    display: flex;
    flex-direction: row;

    .input {
      height: 40px;
      width: 120px;
    }

    .btn {
      height: 40px;
      width: 40px;
      border: 1px solid #bdc1ce;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      user-select: none;
    }
    .l {
      border-right: none;
    }
    .r {
      border-left: none;
    }
  }
</style>
