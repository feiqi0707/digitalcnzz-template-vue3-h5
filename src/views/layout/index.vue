<template>
  <div class="app-container">
    <div class="layout-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Layout',
  data() {
    return {}
  },
  setup() {
    return {}
  }
})
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  padding-bottom: 0px !important;
  .layout-content {
    width: 100%;
    height: 100%;
  }
}
</style>
