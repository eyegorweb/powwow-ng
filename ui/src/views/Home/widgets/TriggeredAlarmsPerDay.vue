<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <div slot="header">
      <div class="d-flex">
        <UiSelect
          v-if="canSelectPartner"
          class="text-gray"
          v-model="selectedPartner"
          :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
          :options="names"
          small
        ></UiSelect>
      </div>
    </div>
    <AlarmsPerDayGraph
      :display-title="showTitle"
      :partners="partnerIds"
      @haveResults="haveResults = $event"
    />
    <div v-if="!haveResults" class="alert-light p-3">{{ $t('noResult') }}</div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import AlarmsPerDayGraph from '@/views/GetVision/alarms/ParcAlarmsTab/AlarmsPerDayGraph';
import UiSelect from '@/components/ui/UiSelect';
import { mapGetters, mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';

export default {
  components: {
    WidgetBloc,
    AlarmsPerDayGraph,
    UiSelect,
  },

  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      showTitle: false,
      selectedPartner: undefined,
      partners: [],
      names: [],
      selectedParnerId: undefined,
      haveResults: false,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    canSelectPartner() {
      return this.names && this.names.length > 0 && !this.userIsPartner;
    },
    partnerIds() {
      if (this.selectedParnerId) {
        return [this.selectedParnerId];
      }

      return undefined;
    },
  },
  mounted() {
    this.initPartners();
  },
  methods: {
    async fetchPartners(q, { page, limit }) {
      const data = await fetchpartners(q, {
        page,
        limit,
        partnerType: this.contextPartnersType,
      });
      if (data) {
        return data.map(p => ({
          id: p.id,
          name: p.name,
        }));
      }
      return undefined;
    },
    fetchPartnerId(id) {
      const found = this.partners.find(p => p.name === id);
      this.selectedParnerId = found ? found.id : '';
    },
    async initPartners() {
      if (this.contextPartners && this.contextPartners.length > 0) {
        this.partners = this.contextPartners.map(p => ({
          id: p.id,
          name: p.name,
        }));
      } else {
        this.partners = await this.fetchPartners('', { page: 0, limit: 999 });
      }
      this.names = this.partners.map(p => p.name);
    },
    onSeeMore() {
      this.$router.push({
        name: 'alarms',
        params: {
          queryFilters: [],
        },
      });
    },
  },
  watch: {
    selectedPartner(newValue) {
      this.fetchPartnerId(newValue);
    },
    contextPartners() {
      this.initPartners();
    },
  },
};
</script>

<style lang="scss" scoped></style>
