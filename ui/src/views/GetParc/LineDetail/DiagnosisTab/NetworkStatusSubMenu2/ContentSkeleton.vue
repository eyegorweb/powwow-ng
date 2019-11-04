<template>
  <div class="bottom-space">
    <div class="row">
      <div class="col-md-5">
        <div class="bg-white p-2">
          <div class="map-part skeleton-line"></div>
        </div>
      </div>
      <div class="col-md-7">
        <TableSkeleton :columns="columns" :size="3" />
      </div>
    </div>
  </div>
</template>

<script>
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';
import { col } from '@/components/DataTable/utils';

export default {
  components: {
    TableSkeleton,
  },
  data() {
    return {
      columns: [
        col(
          this.$t('getparc.lineDetail.tab3.localisation.requestDate'),
          'requestDate',
          true,
          false
        ),
        col(
          this.$t('getparc.lineDetail.tab3.localisation.requestStatus'),
          'requestStatus',
          true,
          false
        ),
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.map-part {
  height: 22.7rem;
}
</style>
