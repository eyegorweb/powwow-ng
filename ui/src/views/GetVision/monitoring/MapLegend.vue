<template>
  <div>
    {{ $t('getvsion.supervisionLegend.title') }}:
    <ul class="list-unstyled">
      <template v-if="usage == 'ALL'">
        <li>
          <div class="cell green"></div>
          <div>{{ $t('getvsion.supervisionLegend.last24H') }}</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>{{ $t('getvsion.supervisionLegend.more24H') }}</div>
        </li>
      </template>
      <template v-if="usage == 'DATA'">
        <li>
          <div class="cell green"></div>
          <div>{{ $t('getvsion.supervisionLegend.openedSession') }}</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>{{ $t('getvsion.supervisionLegend.closedSession') }}</div>
        </li>
      </template>

      <template v-if="usage == 'COCKPIT'">
        <li>
          <div class="cell green"></div>
          <div>{{ $t('getvsion.supervisionLegend.withoutAlarms') }}</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>{{ $t('getvsion.supervisionLegend.withAlarms') }}</div>
        </li>

        <li>
          <div class="cell gray"></div>
          <div>{{ $t('getvsion.supervisionLegend.less500') }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    usage: String,
  },
};
</script>

<style lang="scss" scoped>
li {
  display: flex;
}
.cell {
  width: 10px;
  height: 10px;

  margin: 5px;

  &.green {
    background: $success;
  }

  &.orange {
    background: $warning;
  }

  &.gray {
    background: $gray-400;
  }
}
</style>
