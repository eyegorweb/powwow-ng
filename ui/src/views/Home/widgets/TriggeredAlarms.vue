<template>
  <WidgetBloc :widget="widget" mocked>
    <table class="table">
      <thead>
        <tr>
          <th>OFFRE</th>
          <th>NOM DE L'ALARME</th>
          <th>LIGNES</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Linky-Prod</td>
          <td>Alarme surconso offre 4G</td>
          <td>
            <button class="btn btn-link p-0">50</button>
          </td>
        </tr>
        <tr>
          <td>Linky-Prod</td>
          <td>Alarme surconso Data</td>
          <td>
            <button class="btn btn-link p-0">50</button>
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
    font-size: 0.9rem;
    color: $dark-gray;
    button {
      color: $orange;
    }
  }
  th {
    font-size: 0.7rem;
    font-weight: 500;
    color: $dark-gray;
  }
}
</style>
