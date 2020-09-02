<template>
  <a-row>
    <a-col :span="12">
      <select-lang/>
    </a-col>
    <a-col :span="12">
      <avatar-dropdown />
    </a-col>
  </a-row>
</template>

<script>
  import AvatarDropdown from './AvatarDropdown'
  import SelectLang from '@/components/SelectLang'

  export default {
    name: 'RightContent',
    components: {
      AvatarDropdown,
      SelectLang
    }
  }
</script>
