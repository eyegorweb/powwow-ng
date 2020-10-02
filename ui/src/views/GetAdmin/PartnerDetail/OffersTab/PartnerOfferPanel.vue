<template>
  <BaseDetailPanelContent white>
    <div class="m-3">
      <div class="searchBar mb-3">
        <label for>{{ $t('getadmin.partnerDetail.offerFromPanel.offerSearch') }}</label>
        <UiInput
          v-model="searchValue"
          class="d-block"
          :disabled="isLoading"
          :placeholder="$t('getadmin.partnerDetail.offerFromPanel.searchInput')"
        >
          <i slot="icon" class="select-icon ic-Magnify-Icon" />
        </UiInput>
      </div>
      <template v-if="isLoading">
        <BlockCheckboxSkeleton v-for="i in 20" :key="'sk' + i" />
      </template>
      <template v-else>
        <BlockCheckbox
          :key="'check' + offer.id"
          v-model="offer.checked"
          :title="offer.name"
          v-for="offer in visibleOffers"
        >
          <div class="block-content">
            <div class="mt-2" v-tooltip="offer.defaultServices.join('\n')">
              {{ $t('getadmin.partnerDetail.offerFromPanel.default') }}:
              {{ offer.defaultServices.slice(0, 5).join(', ') }}
              <template v-if="offer.defaultServices.length > 6">
                ...
              </template>
            </div>
            <div class="mt-2" v-tooltip="offer.editableServices.join('\n')">
              {{ $t('getadmin.partnerDetail.offerFromPanel.modifiedServices') }}:
              {{ offer.editableServices.slice(0, 5).join(', ') }}
              <template v-if="offer.editableServices.length > 6">
                ...
              </template>
            </div>
          </div>
        </BlockCheckbox>
      </template>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="closePanel" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton @click="save" variant="primary" block>{{ $t('save') }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BlockCheckbox from '@/components/ui/BlockCheckbox.vue';
import BlockCheckboxSkeleton from '@/components/ui/skeletons/BlockCheckboxSkeleton.vue';
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';

import { getAvailableOffer, updateOffers } from '@/api/offers.js';
import get from 'lodash.get';
import { mapMutations } from 'vuex';

export default {
  props: {
    content: Object,
  },
  components: {
    BlockCheckbox,
    BaseDetailPanelContent,
    UiButton,
    BlockCheckboxSkeleton,
    UiInput,
  },

  data() {
    return {
      testval: undefined,
      isLoading: false,
      offers: [],
      visibleOffers: [],
      partnerOffers: [],
      searchValue: undefined,
    };
  },

  watch: {
    searchValue(newValue) {
      if (!newValue) {
        return (this.visibleOffers = [...this.offers]);
      }
      this.visibleOffers = this.offers.filter(o => {
        const isNameValid = o.name && o.name.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;
        const isCodeValid = o.code && o.code.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;

        return isNameValid || isCodeValid;
      });
    },
  },

  async mounted() {
    this.partnerOffers = this.content.offers;

    await this.refreshOffers();
  },

  methods: {
    ...mapMutations(['closePanel', 'flashMessage']),

    async save() {
      const offerIds = this.offers.filter(f => f.checked).map(f => f.id);
      const response = await updateOffers(this.content.partner.id, offerIds);
      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
    async refreshOffers() {
      this.isLoading = true;
      const items = await getAvailableOffer(this.content.partner.id);
      this.offers = items.map(i => {
        const services = get(i, 'workflow.initialOffer.marketingServices', []);
        const isChecked = !!this.partnerOffers.find(p => p.id === i.workflow.id);
        return {
          id: i.workflow.id,
          name: i.workflow.name,
          code: i.workflow.code,
          checked: isChecked,
          editableServices: services.filter(s => s.editable).map(s => s.labelService),
          defaultServices: services.filter(s => !s.optional).map(s => s.labelService),
        };
      });
      this.visibleOffers = [...this.offers];
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-content {
  font-size: 0.9rem;
}
</style>
