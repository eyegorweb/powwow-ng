<template>
  <div>
    <UiApiAutocomplete
      :api-method="fetchApi"
      v-model="selectedTypeSimCard"
      :error="error"
      display-results-while-empty
      scroll-for-next
      search-type="contain"
    >
      <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }" />
    </UiApiAutocomplete>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchCardTypes } from '@/api/linesActions';
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
      selectedTypeSimCardValues: undefined,
      typeSimCardData: undefined,
    };
  },

  async mounted() {},

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    selectedTypeSimCard: {
      get() {
        return this.typeSimCardData;
      },
      set(value) {
        if (!value || !value.label || !value.label.length) {
          this.typeSimCardData = undefined;
          this.$emit('set:simcard', undefined);
        } else {
          this.typeSimCardData = value;
          this.$emit('set:simcard', value);
        }
      },
    },
  },

  methods: {
    async fetchApi(q, page = 0) {
      let partnerParam = this.partner ? [this.partner] : this.contextPartners;
      partnerParam = partnerParam.filter(p => p.id);

      if (partnerParam && partnerParam.length) {
        const data = await fetchCardTypes('', partnerParam, {
          page,
          limit: 10,
          partnerType: this.contextPartnersType,
        });
        if (data) {
          return data.map(c => {
            return {
              id: c.simCard.id,
              label: c.simCard.description,
              data: c,
            };
          });
        }
      } else {
        this.typeSimCardData = undefined;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
