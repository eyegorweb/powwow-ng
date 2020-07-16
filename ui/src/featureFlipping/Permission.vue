<template>
  <Fragment>
    <slot v-if="havePermission(domain, action)" />
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import { mapGetters } from 'vuex';

export default {
  components: {
    Fragment,
  },
  props: {
    domain: String,
    action: String
  },
  computed: {
    ...mapGetters(['havePermission']),
  },
}
</script>

<style lang="scss" scoped>

</style>
