<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.upcommingChanges') }}
      </h4>
    </div>
    <div v-if="massActions && massActions.length">
      <div class="overview-item mr-5" v-for="i in massActions" :key="i.id">
        <h6>Le : {{ i.statusDate }}</h6>
        <p>{{ $t('getparc.actTypes.' + i.actionType) }}</p>
        <DetailsCell :row="i" />
      </div>
    </div>
    <div v-else>
      <p>-</p>
    </div>
  </div>
</template>

<script>
import { fetchUnitActionsWithaccessPoint } from '@/api/unitActions';
import get from 'lodash.get';
import DetailsCell from '@/views/GetParc/ActHistory/HistoryTable/DetailsCell';

export default {
  data() {
    return {
      massActions: [],
    };
  },
  components: {
    DetailsCell,
  },
  props: {
    content: {
      type: Object,
    },
  },
  methods: {
    get(path, defaultVal = '') {
      return get(this.content, path, defaultVal);
    },
  },
  async mounted() {
    const response = await fetchUnitActionsWithaccessPoint(this.get('accessPoint.id'), ['WAITING']);
    this.massActions = response.items;
  },
};
</script>

<style lang="scss" scoped></style>
