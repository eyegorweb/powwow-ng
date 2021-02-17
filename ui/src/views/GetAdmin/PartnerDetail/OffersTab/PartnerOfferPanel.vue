<template>
  <BaseDetailPanelContent white ref="scroll" @scroll="onScroll">
    <div class="m-3" ref="containerCheckboxes">
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
        <div>
          <BlockCheckbox
            :key="'check' + offer.id"
            v-model="offer.checked"
            :title="offer.name"
            v-for="offer in visibleOffers"
          >
            <div class="block-content" ref="checkboxBloc">
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
        </div>
      </template>
    </div>
    <div
      slot="footer"
      class="action-buttons"
      v-if="havePermission('party', 'update_available_catalog_offers')"
    >
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
import { mapGetters, mapMutations } from 'vuex';

const CHECKBOX_MARGIN = 8;

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
      pagination: { page: 0, limit: 20 },
      blocsHeight: 0,
      canLoadByScroll: true,
      nextPage: undefined,
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
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

    this.offers = await this.fetchOffers(this.pagination);
    this.visibleOffers = [...this.offers];
    this.blocsHeight =
      (parseFloat(getComputedStyle(this.$refs.checkboxBloc[1]).height.replace('px', '')) +
        CHECKBOX_MARGIN) *
      this.visibleOffers.length;
  },

  methods: {
    ...mapMutations(['closePanel', 'flashMessage']),

    async onScroll(panelRef) {
      if (!this.canLoadByScroll) return;

      if (this.$refs.checkboxBloc && panelRef) {
        let scrollMaxHeight = panelRef.scrollTop + (panelRef.scrollHeight - this.blocsHeight);
        let loadMore = scrollMaxHeight >= this.blocsHeight;
        if (loadMore && !this.isLoading) {
          this.pagination.page += 1;
          this.nextPage = await this.fetchOffers(this.pagination);
          if (this.nextPage.length > 0) {
            this.offers = [...this.offers, ...this.nextPage];
            this.visibleOffers = [...this.offers];
          } else {
            this.canLoadByScroll = false;
          }
        }
      }
    },

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
    async fetchOffers(pagination) {
      this.isLoading = true;
      const items = await getAvailableOffer(this.content.partner.id, pagination);

      const offersPage = items.map(i => {
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

      this.isLoading = false;
      return offersPage;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-content {
  font-size: 0.9rem;
}
</style>
