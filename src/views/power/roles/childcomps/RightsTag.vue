<template>
  <div>
    <row v-for="(item1) in scope.row.children" :key="item1.id"> -->
      {{ item1.authName}}
    </row>
  </div>

</template>
<script>
export default {
  name: 'RightsTag',
  props: {
    scope: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>