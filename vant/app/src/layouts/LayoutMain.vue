<template>
  <a-layout :class="{'layout-menu-fixed': configs.isFixedMenu}">
    <LayoutAside :collapsed="$store.state.collapsed" @on-click="setNewCollapsed(!$store.state.collapsed)" />
    <a-layout :class="classes">
      <LayoutHeader :collapsed="$store.state.collapsed" @on-click="setNewCollapsed(!$store.state.collapsed)" @open-setting="isSetting=true" />
      <tabs-nav v-if="configs.isMultiTab" />
      <a-layout-content style="position: relative;">
        <keep-alive :include="cacheList" :max="12">
          <router-view v-if="isReload" />
        </keep-alive>
      </a-layout-content>
    </a-layout>
    <!-- <LayoutSetting :visible.sync="isSetting" /> -->
  </a-layout>
</template>
<script>
import LayoutAside from './LayoutAside'
import LayoutHeader from './LayoutHeader'

export default {
  name: 'LayoutMain',
  components: {
    LayoutAside,
    LayoutHeader,
    TabsNav: () => import('@/layouts/tabsNav')
    // LayoutSetting: () => import('./LayoutSetting')
  },
  data () {
    return {
      isReload: true,
      isSetting: false
    }
  },
  computed: {
    classes () {
      return {
        'is-fold': this.$store.state.collapsed,
        'layout-header-fixed': this.configs.isFixedHeader,
        'layout-multi-tab': this.configs.isMultiTab && this.configs.isFixedHeader
      }
    },
    tabsNav () {
      return this.$store.state.app.tabsNav
    },
    // Get the components that need to be cached
    cacheList () {
      return this.tabsNav.length ? this.tabsNav.filter(item => item.meta && item.meta.keepAlive).map(item => item.name) : []
    },
    // Whether to open multiple tabs
    configs () {
      return this.$store.getters.configs
    }
  },
  provide () {
    return {
      reloading: this.reloading
    }
  },
  methods: {
    setNewCollapsed (data) {
      this.$store.commit('setCollapsedInfo', data)
    },
    reloading () {
      this.$progress.start()
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
        this.$progress.finish()
      })
    }
  }
}
</script>

<style lang="less">
.ant-layout {
  &.ant-layout-has-sider {
    min-height: 100%;
  }
}
.ant-layout-content {
  padding: 15px;
  background: #fff;
}
.layout-menu-fixed {
  .ant-layout-sider {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    overflow: hidden;
  }
  .ant-layout-sider-children {
    margin-right: -16px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  & > .ant-layout {
    margin-left: 200px;
    transition: all 0.2s;
    &.is-fold {
      margin-left: 80px;
      &.layout-header-fixed {
        .ant-layout-header,
        .nav-tabs-wrap {
          left: 80px;
        }
      }
    }
  }
}
.layout-header-fixed {
  padding-top:  55px;
  .ant-layout-header,
  .nav-tabs-wrap {
    position: fixed !important;
    left: 200px;
    right: 0;
    z-index: 5;
    transition: all 0.2s;
  }
  .ant-layout-header {
    top: 0;
  }
  .nav-tabs-wrap {
    top:  55px;
  }
  &.is-fold {
    .ant-layout-header,
    .nav-tabs-wrap {
      left: 80px;
    }
  }
}
.layout-multi-tab {
  padding-top: calc(91px);
}
</style>
