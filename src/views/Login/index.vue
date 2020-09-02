<template>
  <div class="main">
    <div class="upper">
      <div class="lang">
        <select-lang/>
      </div>
      <img src="~@/assets/logo.png"/>
    </div>
    <a-form-model ref="loginForm" :model="form" :rules="rules">
      <a-form-model-item prop="keystore" style="padding: 0;margin-bottom: 15px">
        <text-area v-model="form.keystore"/>
      </a-form-model-item>
      <a-form-model-item prop="password" style="padding: 0;margin-bottom: 15px">
        <login-input v-model="form.password"/>
      </a-form-model-item>
      <div class="agreement">
        <a-checkbox v-model="agree">
          <span>{{ logininfo[0] }}<router-link class="link" to="/agreement">{{ logininfo[1] }}</router-link>{{ logininfo[2] }}<router-link
            class="link"
            to="/privacy">{{ logininfo[3] }}</router-link>{{ logininfo[4] }}</span>
        </a-checkbox>
        <a-button class="loginBtn" @click="handleSubmit" :loading="onlogin" :disabled="!agree">
          <span style="width: 60px;">{{ $t('login') }}</span>
        </a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { build } from '@/utils/keyStore'
  import bs58 from 'bs58'
  import SelectLang from '@/components/SelectLang'
  import TextArea from './TextArea'
  import LoginInput from './LoginInput'

  export default {
    name: 'Login',
    components: {
      SelectLang,
      TextArea,
      LoginInput
    },
    data () {
      return {
        form: {
          keystore: '',
          password: ''
        },
        agree: false,
        onlogin: false
      }
    },
    computed: {
      logininfo () {
        return this.$t('login.mobile.logininfo').split(',')
      },
      rules () {
        return {
          keystore: [
            { required: true, message: this.$t('login.validate.keystore.blank'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$t('login.validate.password.blank'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['Login']),
      handleSubmit () {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            this.onlogin = true
            let { keystore } = this.form
            keystore = keystore.replace('Crypto', 'crypto')
            const { password } = this.form
            const { Login } = this
            const result = await build({ keystore, password })
            if (!result) {
              this.$message.error({ content: this.$t('login.validate.keystore.error'), key: 'password' })
              this.onlogin = false
            } else {
              const hex = result.getAddress().toString('hex')
              const bytes = []
              for (let i = 0; i < hex.length; i++) {
                bytes.push(hex[i].charCodeAt(0))
              }
              const address = bs58.encode(bytes)
              Login({ address, keystore })
                .then(() => {
                  if (this.$router.currentRoute.query.redirect) {
                    this.$router.push(this.$router.currentRoute.query.redirect)
                  } else {
                    this.$router.push('/menu')
                  }
                })
                .finally(() => {
                  this.onlogin = false
                })
            }
          }
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
    padding: 15px;

    .upper {
      position: relative;
      text-align: center;
      width: 100%;

      img {
        width: 56px;
        margin-top: 50px;
        margin-bottom: 50px;
      }

      .lang {
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .agreement {
      color: #999999;
      position: relative;

      .link {
        color: #26C195;
        text-decoration: underline;

        &:hover {
          color: lighten(#26C195, 10%);
        }
      }

      .loginBtn {
        position: absolute;
        left: 0;
        top: 130px;
        color: #ffffff;
        font-size: 15px;
        background-color: #26C195;
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 4px;

        &:hover {
          background-color: lighten(#26C195, 10%);
        }

        &:disabled {
          background-color: #cccccc;
        }
      }
    }
  }
</style>
