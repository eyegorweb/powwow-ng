<template>
  <div>
    <div v-if="paginated" class="row">
      <div class="col-md-6 offset-md-6 ">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <div class="skeleton-line"></div>
        </h2>
      </div>
    </div>
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
              <div class="skeleton-line" :style="{ width: colSize + '%' }"></div>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    size: {
      type: Number,
      default: 20,
    },
    paginated: Boolean,
  },
  computed: {
    colSize() {
      return Math.floor(Math.random() * 51) + 50;
    },
    limitedColumns() {
      return this.columns.filter(c => {
        if (c.visibleWhen) return c.visibleWhen();
        return c.visible;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.table thead tr th {
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
