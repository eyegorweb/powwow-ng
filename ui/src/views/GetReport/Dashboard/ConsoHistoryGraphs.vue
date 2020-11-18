<template>
  <GraphContainer
    title="getreport.dashboard.consoHistory"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div>
      <div class="d-flex justify-content-end">
        <ExportButton :export-fn="getExportFn()"> </ExportButton>
      </div>
      <div class="d-flex justify-content-end">
        <Toggle
          v-if="toggleValues"
          @update="currentUsage = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <keep-alive>
        <ConsoHistoryDataGraph
          v-if="currentUsage === 'data'"
          :partner="partner"
          :billing-account="billingAccount"
        />
      </keep-alive>
      <keep-alive>
        <ConsoHistorySmsGraph
          v-if="currentUsage === 'sms'"
          :partner="partner"
          :billing-account="billingAccount"
        />
      </keep-alive>
      <keep-alive>
        <ConsoHistoryVoiceGraph
          v-if="currentUsage === 'voice'"
          :partner="partner"
          :billing-account:="billingAccount"
        />
      </keep-alive>
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import ConsoHistoryDataGraph from './ConsoHistoryDataGraph';
import ConsoHistorySmsGraph from './ConsoHistorySmsGraph';
import ConsoHistoryVoiceGraph from './ConsoHistoryVoiceGraph';
import Toggle from '@/components/ui/UiToggle2';
import ExportButton from '@/components/ExportButton';
import { consumtionHistoryExport } from '@/api/consumption.js';

export default {
  components: {
    ExportButton,
    GraphContainer,
    Toggle,
    ConsoHistoryDataGraph,
    ConsoHistorySmsGraph,
    ConsoHistoryVoiceGraph,
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  methods: {
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        console.log(exportFormat);
        return await consumtionHistoryExport(this.partner.id, exportFormat);
      };
    },
  },

  computed: {
    canShow() {
      const partnerChosen = !!(this.partner && this.partner.id);
      const offerChosen = !!(this.offer && this.offer.id);
      if (offerChosen) {
        return offerChosen;
      } else {
        return partnerChosen;
      }
    },
    showWarningMsg() {
      const offerChosen = !!(this.offer && this.offer.id);
      if (offerChosen) {
        return true;
      } else {
        return false;
      }
    },
  },

  data() {
    return {
      currentUsage: 'data',
      tooltipMsg: this.$t('getdevice.messages.warning2'),
      toggleValues: [
        {
          id: 'data',
          label: 'services.DATA',
          defaut: true,
        },
        {
          id: 'sms',
          label: 'services.SMS',
        },
        {
          id: 'voice',
          label: 'services.VOICE',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
