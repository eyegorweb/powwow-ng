<template>
  <div>
    <UiApiAutocomplete
      :items="selectedTypeSimCardValues"
      v-model="selectedTypeSimCard"
      :error="error"
      display-results-while-empty
      contains-search
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
        } else {
          this.typeSimCardData = value;
          this.$emit('set:simcard', value);
        }
      },
    },
  },

  methods: {
    async fetchResults() {
      let partnerParam = this.partner ? [this.partner] : this.contextPartners;
      partnerParam = partnerParam.filter(p => p.label !== '');

      if (partnerParam && partnerParam.length) {
        const data = await fetchCardTypes(undefined, partnerParam, {
          partnerType: this.contextPartnersType,
        });
        if (data) {
          this.selectedTypeSimCardValues = data.map(c => {
            return {
              id: c.simCard.id,
              label: c.simCard.description,
            };
          });
        }
      } else {
        this.typeSimCardData = undefined;
      }
    },
  },

  watch: {
    async partner() {
      await this.fetchResults();
    },
  },
};
</script>

<style lang="scss" scoped></style>
