<template>
  <div>
    <div v-if="!partners" class="alert alert-warning">Veuillez choisir un partenaire</div>
    <UiSelect v-else class="text-gray" block v-model="selectedValue" :options="options" />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { mapState } from 'vuex';
import { fetchBillingAccounts } from '@/api/billingAccounts.js';

export default {
  components: {
    UiSelect,
  },

  props: {
    value: Object,
    partners: Array,
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
    async refreshList(q, page = 0) {
      const data = await fetchBillingAccounts('', this.partners, {
        page,
        limit: 99,
        partnerType: this.contextPartnersType,
      });
      this.options = [
        ...data.map(o => ({
          value: o.id,
          label: `${o.code} - ${o.name}`,
          meta: o,
        })),
      ];
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
