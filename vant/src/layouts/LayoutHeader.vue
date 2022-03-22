<template>
  <a-layout-header>
    <div class="left">
      <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="handleClick" />
      <a-tooltip placement="bottom" @click="reloading()">
        <a-icon class="trigger cp" type="sync" />
      </a-tooltip>
    </div>
    <div class="right">
      <avatar-name class="z-avatar-name"></avatar-name>
    </div>
  </a-layout-header>
</template>
<script>
import AvatarName from '@/components/avatarName/AvatarName'

export default {
  name: 'LayoutHeader',
  components: {
    AvatarName
    // Fullscreen
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  inject: ['reloading'],
  methods: {
    handleClick () {
      this.$emit('on-click')
    },
    openSetting () {
      this.$emit('open-setting')
    }
  }
}
</script>

<style lang='less' scoped>
.ant-layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eee;
  .left {
    padding-left: 10px;
  }
  .trigger {
    font-size: 22px;
    padding: 0 12px;
    transition: all 0.3s ease 0s;
    &:hover {
      color: #2d8cf0;
    }
  }
  .left,
  .right {
    display: inline-flex;
    align-items: center;
  }
}
</style>
