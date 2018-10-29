<template>
  <table class="table table-blue">
    <draggable
      :element="'thead'"
      v-model="sortableColumns"
      :options="{handle:'.handle'}"
    >
      <transition-group
        tag="tr"
        name="table"
      >
        <th
          :key="column.name"
          v-for="column in sortableColumns"
        >
          <span
            v-if="!column.noHandle"
            class="handle ic-Drag-Column-Icon"
          />
          {{ column.label }}
          <span class="ic-Arrow-Filter-Icon" />
        </th>
      </transition-group>
    </draggable>
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
import draggable from 'vuedraggable';

export default {
  name: 'DataTable',
  components: { draggable },
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

  data() {
    return {
      sortableColumns: [],
    };
  },
  created() {
    this.sortableColumns = this.columns.slice(0);
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

.table-move {
  transition: transform 200ms;
}
</style>
