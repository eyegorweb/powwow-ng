<template>
  <ul class="list-group bg-white">
    <IndicatorItem
      v-for="indicator in compatibleRoles"
      :key="indicator.labelKey"
      :indicator="indicator"
      :partners="partners"
      :set-current-filters-fn="setCurrentFiltersFn"
    />
  </ul>
</template>

<script>
import IndicatorItem from './IndicatorItem';
import { mapGetters } from 'vuex';

export default {
  components: {
    IndicatorItem,
  },
  props: {
    meta: Array,
    setCurrentFiltersFn: Function,
    partners: Object,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
    };
  },

  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner']),
    compatibleRoles() {
      return this.meta.filter(i => {
        if (!i.roles) return true;

        if (this.userIsBO) {
          return !!i.roles.find(r => r === 'BO');
        }

        if (this.userIsPartner) {
          return !!i.roles.find(r => r === 'PARTNER');
        }
        return true;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
