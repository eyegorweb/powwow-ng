<template>
  <div class="d-flex flex-column">
    <div class="order-status mock-value">
      <CheckMark v-if="row.Statut === 'TERMINATED'" :is-error="false" />
      <div
        class="label"
        :class="{
          running: row.Statut === 'RUNNING',
          waiting: row.Statut === 'WAITING',
          terminated: row.Statut === 'TERMINATED',
        }"
      >
        {{ $t('getparc.lineDetail.tab3.statuses.' + row.Statut) }}
      </div>
    </div>
    <button
      v-if="row.Statut === 'WAITING'"
      class="btn btn-link text-left p-0"
      @click.stop="cancelRequest()"
    >
      <span>Annuler</span>
    </button>
  </div>
</template>

<script>
import CheckMark from '@/components/ui/CheckMark';
import { removeConsumptionOnDemand } from '@/api/consumption';

export default {
  components: {
    CheckMark,
  },
  props: {
    row: Object,
  },
  data() {
    return {
      isError: false,
    };
  },
  methods: {
    async cancelRequest() {
      const response = await removeConsumptionOnDemand(this.row.id);
      this.$emit('colEvent', { action: 'canceled', response });
    },
  },
};
</script>

<style lang="scss" scoped>
.running {
  color: $primary !important;
}
.waiting {
  color: $primary !important;
}
.terminated {
  color: $success !important;
}
</style>
