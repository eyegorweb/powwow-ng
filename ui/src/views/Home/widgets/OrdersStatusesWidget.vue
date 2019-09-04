<template>
  <WidgetBloc :widget="widget" no-padding>
    <div class="pl-3 pr-3 pb-3">
      <GetSimIndicators no-borders />
    </div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import GetSimIndicators from '@/views/GetSim/GetSimIndicators';

export default {
  components: {
    WidgetBloc,
    GetSimIndicators,
  },
  props: {
    widget: Object,
  },
};
</script>

<style lang="scss" scoped></style>
