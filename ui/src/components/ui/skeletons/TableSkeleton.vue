<template>
  <table class="table table-blue mt-1">
    <thead>
      <tr>
        <th v-for="column in limitedColumns" :key="'th_' + column.id">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="index in size" :key="index">
        <td v-for="column in limitedColumns" :key="'row_' + column.id">
          <span>
            <div class="animated-line" :style="{ width: colSize + '%' }"></div>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    columns: Array,
    size: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    colSize() {
      return Math.floor(Math.random() * 51) + 50;
    },
    limitedColumns() {
      return this.columns.filter(c => c.visible);
    },
  },
};
</script>
