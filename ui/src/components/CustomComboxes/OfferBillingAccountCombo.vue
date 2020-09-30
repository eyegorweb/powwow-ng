<template>
  <div>
    <div v-if="!partner" class="alert alert-warning">{{ $t('chooseOnePartner') }}</div>
    <UiSelect v-else class="text-gray" block v-model="selectedValue" :options="options" />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { mapState } from 'vuex';
import { fetchOfferWithBilligAccount } from '@/api/offers.js';

export default {
  components: {
    UiSelect,
  },

  props: {
    value: Object,
    partner: Object,
  },

  data() {
    return {
      options: undefined,
    };
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    selectedValue: {
      get() {
        return this.value ? this.value.id : undefined;
      },
      set(value) {
        if (value && value.label === '') {
          this.$emit('update:value', undefined);
          return;
        }
        const selectedObj = this.options.find(o => o.value === value);
        this.$emit('update:value', selectedObj);
      },
    },
  },

  methods: {
    async refreshList() {
      const data = await fetchOfferWithBilligAccount(this.partner ? [this.partner] : undefined);
      this.options = data.map(o => ({
        value: o.workflow.id + '_' + o.customerAccount.id,
        label: `${o.workflow.workflowDescription} / ${o.customerAccount.name}`,
        meta: o,
      }));
    },
  },

  watch: {
    partner() {
      this.refreshList();
    },
  },

  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
