<template>
  <div>
    <UiApiAutocomplete
      :api-method="fetchApi"
      v-model="selectedCommunity"
      :error="error"
      display-results-while-empty
      scroll-for-next
    >
      <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }" />
    </UiApiAutocomplete>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchYorkCommunity } from '@/api/offers';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },

  props: {
    partner: Object,
    error: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      community: undefined,
    };
  },

  async mounted() {},

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    selectedCommunity: {
      get() {
        return this.community;
      },
      set(value) {
        if (!value || !value.label || !value.label.length) {
          this.community = undefined;
          this.$emit('set:community', undefined);
        } else {
          this.community = value;
          this.$emit('set:community', value);
        }
      },
    },
  },

  methods: {
    async fetchApi(q, page = 0, limit = 10) {
      const queryParams = { page, limit };
      const data = await fetchYorkCommunity(q, queryParams, [this.partner]);
      if (data) {
        return data.map((d) => ({
          id: d.code,
          label: `${d.code}`,
          data: d,
        }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
