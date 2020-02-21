<template>
  <ul class="list-unstyled mock-value">
    <li class="data-info">Data Sortante: 3.0 Go</li>
    <li class="date-info">01/01/2019</li>
  </ul>
</template>

<script>
export default {
  props: {
    info: Object,
  },
};
</script>

<style lang="scss" scoped>
ul {
  .data-info {
    color: $orange;
    text-decoration: underline;
  }

  .date-info {
    font-size: 0.8rem;
    color: $gray-680;
  }
}
</style>
