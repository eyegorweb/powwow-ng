<template>
  <WidgetBloc :widget="widget" mocked>
    <table class="table">
      <tbody>
        <tr>
          <td>6.15544.77 du 10/10/2018 au 11/11/2018</td>
          <td>1516 541 $HT</td>
          <td>
            <i class="ic-Download-Icon"></i>
          </td>
        </tr>
        <tr>
          <td>6.15544.77 du 10/10/2018 au 11/11/2018</td>
          <td>1516 541 $HT</td>
          <td>
            <i class="ic-Download-Icon"></i>
          </td>
        </tr>
        <tr>
          <td>6.15544.77 du 10/10/2018 au 11/11/2018</td>
          <td>1516 541 $HT</td>
          <td>
            <i class="ic-Download-Icon"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';

export default {
  components: {
    WidgetBloc,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
};
</script>

<style lang="scss" scoped>
.table {
  td {
    font-size: 0.8rem;
    color: #454545;
  }
}
</style>
