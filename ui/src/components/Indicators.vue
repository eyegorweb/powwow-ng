<template>
  <ul class="list-group bg-white" :class="noBorders ? 'no-borders' : undefined">
    <IndicatorItem
      v-for="indicator in indicatorsWithCompatibleRoles"
      :key="indicator.labelKey"
      :indicator="indicator"
      :partners="partners"
      :on-click="onClick"
      @removeme="i => removeIndicator(i)"
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
    onClick: {
      type: Function,
      required: false,
    },
    partners: Object,
    noBorders: Boolean,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
    };
  },

  mounted() {
    this.indicators = this.meta;
  },

  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner']),
    indicatorsWithCompatibleRoles() {
      return this.indicators.filter(i => {
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
  methods: {
    removeIndicator(indicatorToRemove) {
      this.indicators = this.indicators.filter(i => i !== indicatorToRemove);
    },
  },
};
</script>

<style lang="scss" scoped>
.no-borders {
  li {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }
}
</style>
