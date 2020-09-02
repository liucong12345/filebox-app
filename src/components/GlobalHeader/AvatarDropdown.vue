<template>
  <a-dropdown v-if="address">
    <img class="avatar" src="~@/assets/avatar.png"/>
    <template v-slot:overlay>
      <a-menu :selected-keys="[]">
        <a-menu-item key="center" @click="handleCenter">
          {{ $t('header.topmenu.center') }}
        </a-menu-item>
        <a-menu-item key="account" @click="handleAccount">
          {{ $t('header.topmenu.account') }}
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          {{ $t('header.topmenu.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <router-link to="/login">
      <div class="loginBtn">
        {{ $t('login') }}
      </div>
    </router-link>
  </span>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AvatarDropdown',
    computed: {
      ...mapState({
        address: (state) => state.user.address
      })
    },
    methods: {
      handleCenter () {
        this.$router.push('/center')
      },
      handleAccount () {
        this.$router.push('/center/userinfo')
      },
      handleLogout () {
        this.$store.dispatch('Logout').then(() => {
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .avatar {
    &:hover {
      cursor: pointer;
    }
  }

  .loginBtn {
    display: inline-flex;
    width: 81px;
    height: 40px;
    background-color: #F1F7FD;
    color: #4587F3;
    font-size: 14px;
    font-weight: bold;
    border-radius: 4px;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      background-color: darken(#F1F7FD, 5%);
      color: darken(#4587F3, 5%);
    }
  }
</style>
