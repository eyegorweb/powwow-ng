<template>
  <div>
    <UiApiAutocomplete
      v-if="showCombo"
      :placeholder="$t('col.offer')"
      :api-method="searchOffers"
      v-model="selectedLocalValue"
      display-results-while-empty
      :disabled="disabled"
      search-type="startsWith"
    />
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import uuid from 'uuid/v1';
import { fetchOffers2 } from '@/api/offers';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    value: Object,
    partners: Array,
    disabled: Boolean,
    filters: {
      type: [Object, Boolean],
      default: false,
    },
  },

  computed: {
    ...mapState('userContext', [' contextPartnersType']),
  },
  data() {
    return {
      selectedLocalValue: undefined,
      showCombo: true,
    };
  },
  watch: {
    value(newValue) {
      this.selectedLocalValue = newValue;
    },
    partners() {
      this.showCombo = false;
      setTimeout(() => {
        this.showCombo = true;
      });
    },
    selectedLocalValue(value) {
      if (!value) {
        this.$emit('input', undefined);
        return;
      }
      if (value && (value.label === '' || value.label === undefined)) {
        this.$emit('input', undefined);
        return;
      }
      if (value && value.id) {
        this.$emit('input', value);
      }
    },
  },
  mounted() {
    this.selectedLocalValue = this.value;
  },
  methods: {
    async searchOffers(q, page = 0) {
      const filters = {
        description: {
          startsWith: q,
        },
        partnerType: this.contextPartnersType,

        ...(this.filters ? this.filters : {}),
      };

      if (this.partners && this.partners.length) {
        filters.partyId = { in: this.partners.map((p) => p.id) };
      }
      const pagination = { page, limit: 10 };
      const sorting = { description: 'DESC' };

      const data = await fetchOffers2(filters, pagination, sorting);

      return data.map((p) => ({
        key: uuid(),
        id: p.code,
        label: p.workflowDescription,
        meta: p,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
