<template>
  <WidgetBloc :widget="widget" v-if="userIsPartner" @seeMore="onSeeMore">
    <div v-if="bills && bills.items && bills.items.length > 0">
      <table class="table">
        <tbody>
          <tr :key="bill.reference" v-for="bill in bills.items">
            <td>{{ bill.customerAccountCode }} du {{ bill.date }}</td>

            <td>{{ bill.amount }} € HT</td>

            <td>
              <i
                class="ic-Download-Icon cursorP"
                v-if="bill.documentId"
                @click="downloadBill(bill.documentId)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert-light">
      {{ $t('noResultBill') }}
    </div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import { fetchBillsById } from '@/api/bills.js';
import { mapMutations, mapGetters } from 'vuex';
import { getBaseURL } from '@/utils.js';

export default {
  components: {
    WidgetBloc,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      bills: undefined,
    };
  },

  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner']),
  },
  async mounted() {
    if (this.singlePartner && this.singlePartner.id) {
      this.bills = await fetchBillsById(this.singlePartner.id);
    }
  },

  methods: {
    ...mapMutations(['startDownload']),

    onSeeMore() {
      this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Dernières factures' });
      this.$router
        .push({
          name: 'reportsBill',
          params: {
            queryFilters: [],
          },
        })
        .catch(() => {});
    },

    downloadBill(id) {
      this.startDownload(`${getBaseURL()}/api/file/download/document/${id}`);
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  .cursorP {
    cursor: pointer;
  }

  td {
    font-size: 0.8rem;
    color: #454545;
  }
}
</style>
