<template>
  <div class="row">
    <div class="col-md-3 pl-0">
      <IndicatorsBlock />
      <FilterBar />
    </div>
    <div class="col-md-9">
      <ff-wip>
        <AlarmsPerDayGraph />
      </ff-wip>
      <AlarmsTable />
    </div>
  </div>
</template>

<script>
import IndicatorsBlock from './IndicatorsBlock';
import FilterBar from './FilterBar';
import AlarmsPerDayGraph from './AlarmsPerDayGraph';
import AlarmsTable from './AlarmsTable';

export default {
  components: {
    IndicatorsBlock,
    FilterBar,
    AlarmsPerDayGraph,
    AlarmsTable,
  },
};
</script>

<style lang="scss" scoped></style>
