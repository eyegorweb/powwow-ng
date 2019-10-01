<template>
  <ul class="list-unstyled">
    <li v-for="e in data.errors" :key="e.key">
      {{ e.number }} {{ $t('getparc.actCreation.report.' + e.key) }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped></style>
