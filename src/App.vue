<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="includeRoutes">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup() {
    const store = useStore()
    store.dispatch('app/setUserInfo')
  }
})
</script>

<style lang="scss"></style>
