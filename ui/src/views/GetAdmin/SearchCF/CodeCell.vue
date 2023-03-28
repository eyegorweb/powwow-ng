<template>
  <router-link :to="`/getadmin/partner/${row.party.id}/billAccounts/form/${row.code}`">
    <button class="btn btn-link btn-select p-0">{{ row.code }}</button>
  </router-link>
</template>

<script>
export default {
  name: 'CodeCell',
  props: {
    row: Object,
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.btn-select {
  user-select: initial;
}
</style>
