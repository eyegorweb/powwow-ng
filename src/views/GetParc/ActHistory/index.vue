<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-act') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <GetParcIndicators />
        <br />
        <FilterBar />
      </div>
      <div class="col-md-9">
        <HistoryTable />
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import HistoryTable from './HistoryTable';
import GetParcIndicators from './GetParcIndicators';

export default {
  components: {
    FilterBar,
    HistoryTable,
    GetParcIndicators,
  },
};
</script>

<style scoped></style>
