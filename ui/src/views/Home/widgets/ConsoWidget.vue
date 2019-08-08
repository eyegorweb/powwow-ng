<template>
  <WidgetBloc :widget="widget">
    <div class="row">
      <div class="col">
        <Gauge :value="50" title="25Mo" subtitle="18/11/2018" right-corner="∞" />
      </div>
      <div class="col">
        <Gauge :value="100" title="50" subtitle="18/11/2018" arc-style="danger" right-corner="40" />
      </div>
      <div class="col" style="align-self: flex-end; flex-grow: 1;">
        <Gauge :value="49" title="00:05:34" subtitle="18/11/2018" right-corner="00:12:00" />
      </div>
    </div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import Gauge from '@/components/widgets/Gauge';

export default {
  components: {
    WidgetBloc,
    Gauge,
  },
  props: {
    widget: Object,
  },
};
</script>

<style lang="scss" scoped></style>
