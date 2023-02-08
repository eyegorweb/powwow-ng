<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ $t('getadmin.marketingOffers.title') }}
          <Tooltip direction="right">{{ $t('getadmin.marketingOffers.tooltip-text') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3" v-if="canCreate">
        <UiButton variant="accent" block class="float-right" @click="createMarketingOfferPanel()">
          {{ $t('getadmin.marketingOffers.addOffer') }}
        </UiButton>
      </div>
    </div>
    <TableWithFilter
      v-if="filters"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :show-reset="!!searchByCodeOrDescriptionValue"
      :is-loading="isLoading"
      @resetSearch="resetFilters"
      @applyFilters="applyFilters"
      @columnOrdered="orderedColumns = $event"
    >
      <div slot="title">
        {{ $t('getadmin.marketingOffers.total', { total: $formatLargeNumber(total) }) }}
      </div>

      <div slot="topLeft">
        <SearchByCodeOrDescription
          @searchByCodeOrDescription="searchByCodeOrDescription"
          @inputIsEmpty="clearSearch"
          :init-value="searchByCodeOrDescriptionValue"
        />
      </div>

      <template slot="actions" slot-scope="{ row }">
        <Actions
          :marketing-offer="row"
          @duplicateMarketingOffer="onDuplicateMarketingOffer(row)"
          @modifyMarketingOffer="onModifyMarketingOffer(row)"
          @actionIsDone="refreshMarketingOffer(row)"
        />
      </template>
    </TableWithFilter>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import SearchByCodeOrDescription from './filters/SearchByCodeOrDescription';
import Actions from './MarketingOfferActions.vue';
import { searchMarketingOffers } from '@/api/marketingOffer';
import get from 'lodash.get';
import { mapGetters, mapMutations } from 'vuex';
import GenericFilter from './filters/GenericFilter';

export default {
  components: {
    UiButton,
    Tooltip,
    TableWithFilter,
    SearchByCodeOrDescription,
    Actions,
  },
  data() {
    return {
      filters: undefined,
      lastPayload: undefined,
      isLoading: true,
      orderedColumns: undefined,
      columns: [
        {
          id: 1,
          label: 'ID',
          name: 'id',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'LinkBtn',
            onClick: (id, marketingOffer) => {
              this.onModifyMarketingOffer(marketingOffer);
            },
            isClickable: () => {
              return true;
            },
          },
        },
        {
          id: 2,
          label: 'Code',
          exportId: 'CODE',
          name: 'code',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 3,
          exportId: 'DESCRIPTION',
          label: 'Description',
          name: 'description',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 4,
          exportId: 'STATUT',
          label: this.$t('getadmin.marketingOffers.columns.status'),
          name: 'disabled',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.disabled ? this.$t('col.notActive') : this.$t('col.active');
            },
          },
        },
        {
          id: 5,
          exportId: 'flagGeneric',
          label: 'flagGeneric',
          name: 'flagGeneric',
          orderable: true,
          visible: true,
          noHandle: true,
          format: { type: 'Boolean' },
        },
      ],
      rows: [],
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'ASC',
      },
      searchByCodeOrDescriptionValue: undefined,
      searchLoginResults: [],
      currentAppliedFilters: [],
    };
  },
  async mounted() {
    let currentVisibleFilters = [
      {
        title: 'getadmin.marketingOffers.filters.offerType',
        component: GenericFilter,
        onChange: (selectedStatus) => {
          return {
            id: 'getadmin.marketingOffers.filters.offerType',
            value: this.$t(selectedStatus.label),
            data: selectedStatus,
          };
        },
      },
    ];

    this.filters = currentVisibleFilters;
    this.applyFilters();
  },
  computed: {
    ...mapGetters([
      'userIsBO',
      'userIsGroupAccount',
      'userInfos',
      'havePermission',
      'userIsByCustomerAccount',
    ]),
    canUpdate() {
      return this.havePermission('user', 'create');
    },
    canCreate() {
      return this.canUpdate && !this.userIsByCustomerAccount;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    resetFilters() {
      this.searchByCodeOrDescriptionValue = undefined;
      this.applyFilters();
    },

    async applyFilters(payload) {
      if (this.searchByCodeOrDescriptionValue) {
        payload = {
          pagination: payload !== undefined ? payload.pagination : { page: 0, limit: 20 },
          filters:
            payload !== undefined
              ? [
                  ...payload.filters,
                  {
                    id: 'getadmin.marketingOffers.filters.codeOrDescription',
                    value: this.searchByCodeOrDescriptionValue,
                  },
                ]
              : [
                  {
                    id: 'getadmin.marketingOffers.filters.codeOrDescription',
                    value: this.searchByCodeOrDescriptionValue,
                  },
                ],
        };
      }
      this.lastPayload = payload;
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const data = await searchMarketingOffers(filters, this.orderBy, pagination);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;

      this.currentAppliedFilters = filters;
    },

    createMarketingOfferPanel() {
      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };

      this.openPanel({
        title: this.$t('getadmin.marketingOffers.marketingOfferForm.title'),
        panelId: 'getadmin.marketingOffers.marketingOfferForm.title',
        payload: { fromUserMenu: true, fromPage: 'manage-offers' },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    onDuplicateMarketingOffer(marketingOffer) {
      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };

      this.openPanel({
        title: this.$t('getadmin.marketingOffers.marketingOfferForm.title'),
        panelId: 'getadmin.marketingOffers.marketingOfferForm.title',
        payload: { duplicateFrom: marketingOffer, duplicate: true },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    onModifyMarketingOffer(marketingOffer) {
      const partners = get(marketingOffer, 'partners', []);
      const partnerId = partners.length ? partners[0].id : undefined;
      const partnerLabel = partners.length ? partners[0].name : undefined;

      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };
      this.openPanel({
        title: this.$t('getadmin.marketingOffers.marketingOfferForm.modify-title'),
        panelId: 'getadmin.marketingOffers.marketingOfferForm.title',
        payload: { duplicateFrom: marketingOffer, partnerId, partnerLabel },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    async searchByCodeOrDescription(value) {
      this.searchByCodeOrDescriptionValue = value;
      const data = await searchMarketingOffers(
        [
          {
            id: 'getadmin.marketingOffers.filters.codeOrDescription',
            value,
          },
        ],
        this.orderBy,
        { page: 0, limit: 20 }
      );
      this.total = data.total;
      this.rows = data.items;
    },
    clearSearch() {
      if (this.searchByCodeOrDescriptionValue) {
        this.searchByCodeOrDescriptionValue = undefined;
        this.applyFilters();
      }
    },
    async refreshMarketingOffer(marketingOffer) {
      marketingOffer.disabled = !marketingOffer.disabled;
    },
  },
};
</script>

<style lang="scss" scoped></style>
