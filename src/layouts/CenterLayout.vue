<template>
  <router-view/>
</template>
<script>
  import { asyncRouterMap } from '@/config/router.config'
  import { mapActions, mapState } from 'vuex'
  import { formatFileSize } from '@/utils/util'

  export default {
    name: 'CenterLayout',
    data () {
      return {
        pageList: [],
        linkList: [],
        activePage: ''
      }
    },
    computed: {
      ...mapState({
        routerLoading: (state) => state.router.isLoading,
          allSize: (state) => formatFileSize(state.user.totalSize, 0, false, true),
          useSize: (state) => formatFileSize(state.user.currentSize, 0, false, true),
          percent: (state) => (state.user.currentSize / state.user.totalSize) * 100
      })
    },
      methods: {
          ...mapActions(['GetSpaceInfo'])
      },
    created () {
      this.pageList.push(asyncRouterMap[2])
      this.linkList.push(this.$route.fullPath)
      this.activePage = this.$route.fullPath
        this.GetSpaceInfo()
    }
  }
</script>

<style>
  .sider-content{
    margin: 20px 0 30px 0;
    background-color: #FFFFFF;
    min-height: 85vh;
  }
  .context-content{
    margin: 20px 0 30px 10px;
    background-color: #FFFFFF;
  }
  #left-menu li {
    margin: 0;
    text-align: center;
  }

  #left-menu li::after {
    border-right: 0px;
  }

  #left-menu .ant-menu-item-selected {
    color: rgba(38, 193, 149, 1);
    background-color: #E0F6F0;
    border-left: 3px solid rgba(38, 193, 149, 1);
  }

</style>
