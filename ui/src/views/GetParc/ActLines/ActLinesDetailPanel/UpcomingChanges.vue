<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.upcommingChanges') }}
      </h4>
    </div>
    <div v-if="massActions && massActions.length">
      <div class="overview-item mr-5" v-for="i in massActions" :key="i.id">
        <h6>Le : {{ i.dueDate }}</h6>
        <p>{{ $t('getparc.actTypes.' + i.actionType) }}</p>
        {{ i.info }}
      </div>
    </div>
    <div v-else>
      <p>-</p>
    </div>
  </div>
</template>

<script>
import { searchMassActions } from '@/api/massActions';
import get from 'lodash.get';

export default {
  data() {
    return {
      massActions: [],
    };
  },
  components: {},
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
    const response = await searchMassActions(
      { key: 'ID', direction: 'DESC' },
      { page: 0, limit: 99 },
      [
        {
          id: 'filters.iccid',
          value: this.content.iccid,
        },
        {
          id: 'filters.actStatus',
          values: [{ id: 'WAITING' }, { id: 'IN_PROGRESS' }],
        },
      ]
    );
    if (response) {
      this.massActions = response.items.map(i => ({ ...i, ...i.massAction }));
    }
  },
};
</script>

<style lang="scss" scoped></style>
