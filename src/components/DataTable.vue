<template>
  <table class="table table-blue">
    <thead>
      <tr>
        <th
          :key="column.name"
          v-for="column in columns"
        >
          <span
            v-if="!column.noHandle"
            class="handle ic-Drag-Column-Icon"
          />
          {{ column.label }}
          <span class="ic-Arrow-Filter-Icon" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        :key="row.id"
        v-for="row in rows"
      >
        <td
          :key="column.name"
          v-for="column in columns"
        >{{ row[column.name] }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import tableDragger from 'table-dragger';

export default {
  name: 'DataTable',
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
  mounted: function() {
    this.initializePlugin();
  },

  methods: {
    initializePlugin() {
      this.dragCtrl = tableDragger(this.$el, { dragHandler: '.handle' });
    },
    destroyPlugin() {
      this.dragCtrl.destroy();
      return this.$nextTick();
    },
  },

  destroyed() {
    this.destroyPlugin();
  },

  watch: {
    async columns() {
      await this.destroyPlugin();
      this.initializePlugin();
    },
  },
};
</script>

<style lang="scss">
@import '../theme/scss/variables';
.table-blue thead {
  background-color: $primary;
  color: white;
}
.table-blue {
  background: white !important;
  font-size: 14px;
  line-height: 24px;
}

.table-blue td {
  color: $dark-grey;
}

.table-blue th {
  font-weight: normal;
  color: #ffffff;
}

.table-blue td .fa-blue {
  position: relative;
  top: 5px;
}

.handle {
  font-size: 20px;
  position: relative;
  top: 3px;
}
</style>
