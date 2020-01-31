<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('getreport.pageTitle') }}
          <Tooltip direction="right">{{ $t('getreport.reports_tooltip') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="secondary" block class="float-right" @click="createReport()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getreport.create_report') }}
        </UiButton>
      </div>
    </div>
    <div class="mt-4 mb-4">
      <ReportsTable />
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiButton from '@/components/ui/Button';
import ReportsTable from './ReportsTable';
import { mapMutations } from 'vuex';

export default {
  components: {
    Tooltip,
    UiButton,
    ReportsTable,
  },
  methods: {
    ...mapMutations(['openPanel']),

    createReport() {
      this.openPanel({
        title: this.$t('getreport.create_report'),
        panelId: 'getreport.create_report',
        wide: true,
        width: '50%',
        backdrop: true,
        ignoreClickAway: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
