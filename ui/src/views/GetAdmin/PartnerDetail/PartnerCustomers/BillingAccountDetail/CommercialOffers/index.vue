<template>
  <div>
    <router-view
      :partner="partner"
      :billing-account-to-detail="billingAccountToDetail"
    ></router-view>
  </div>
</template>

<script>
export default {
  props: {
    partner: Object,
    billingAccountToDetail: Object,
  },
};
</script>

<style lang="scss" scoped></style>
