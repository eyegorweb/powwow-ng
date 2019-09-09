<template>
  <WidgetBloc :widget="widget" mocked>
    <div class="conso-container">
      <div class="row">
        <div class="col-md-4">
          <Gauge :value="50" title="25Mo" subtitle="18/11/2018" right-corner="∞" />
        </div>
        <div class="col-md-4">
          <Gauge
            :value="100"
            title="50"
            subtitle="18/11/2018"
            arc-style="danger"
            right-corner="40"
          />
        </div>
        <div class="col-md-4" style="align-self: flex-end; flex-grow: 1;">
          <Gauge :value="49" title="110" subtitle="18/11/2018" right-corner="120" />
        </div>
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

<style lang="scss" scoped>
.conso-container {
  display: flex;
  height: 100%;

  .row {
    align-self: flex-end;
    width: 100%;
  }
}
</style>
