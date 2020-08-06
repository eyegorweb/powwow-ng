<template>
  <div>
    <CustomersTable :partner="partner" />
  </div>
</template>

<script>
import CustomersTable from './CustomersTable';

export default {
  components: {
    CustomersTable,
  },
  props: {
    partner: Object,
  },
};
</script>

<style lang="scss" scoped></style>
