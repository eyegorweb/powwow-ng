<template>
  <div class="card mt-2">
    <div class="card-body">
      <div class="cmp-container">
        <div class="cmp-partners">
          <h6 class="text-center">Selectionner un partenaire:</h6>
          <div class="partner-selection-box d-flex">
            <div class="partner-autocomp">
              <UiApiAutocomplete
                :api-method="fetchPartners"
                v-model="selectedPartner"
                display-results-while-empty
                scroll-for-next
              >
                <img
                  style="font-size: 24px"
                  class="arrow"
                  src="@/assets/search.svg"
                  :style="{ left: 0 }"
                />
              </UiApiAutocomplete>
            </div>
            <div class="ml-2">
              <button class="btn btn-primary pl-4 pr-4 pt-2 pb-2">{{ $t('set') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';

export default {
  components: {
    UiApiAutocomplete,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },
  data() {
    return {
      selectedPartner: null,
    };
  },
  methods: {
    async fetchPartners(q, page = 0) {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }
      const partnerTypesIn = this.contextPartnersTypes;
      const data = await fetchpartners(q, { page, limit: 10, partnerTypesIn });
      return data.map(p => ({
        id: p.id,
        label: p.name,
        orderNumberIsMandatory: p.orderNumberRequired,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.cmp-container {
  display: flex;
  justify-content: center;
}

.partner-selection-box {
  width: 28rem;
}
.partner-autocomp {
  flex-grow: 1;
}
</style>
