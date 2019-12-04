<template>
  <div class="mock-value">
    <div>Sur-conso Linky Prod</div>
    <div class="subtitle">Sur-consommation</div>
  </div>
</template>

<script>
export default {
  name: 'AlarmNameCell',
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 0.8rem;
  color: $gray-680;
}
</style>
