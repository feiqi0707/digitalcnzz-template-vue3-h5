<template>
  <div class="home-container">
    {{ userInfo }}
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Home',
  data() {
    return {}
  },
  methods: {},
  setup() {
    const store = useStore()
    const state = reactive({
      userInfo: computed(() => store.getters.userInfo)
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@assets/style/mixin.scss';
.home-container {
  width: 100%;
  height: 100%;
}
</style>
