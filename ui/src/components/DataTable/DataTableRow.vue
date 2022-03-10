<template>
  <tbody>
    <tr>
      <td
        :key="column.name + column.label + row.id"
        v-for="column in sortableColumns"
        v-tooltip="getTooltipConfig(column, row)"
      >
        <DatatableColumnTypeSwitcher
          :format="column.format"
          :item="row[column.name]"
          :row="row"
          :visible-columns="sortableColumns"
          @colEvent="$emit('colEvent', $event)"
        />
      </td>
      <td v-if="subRows && row.subItems && row.subItems.length !== 0" @click="openSubs = !openSubs">
        <span v-if="openSubs" class="ic-Minus-Icon cursorP" />
        <span v-else class="ic-Plus-Icon cursorP" />
      </td>
      <td v-else></td>
      <td v-if="size">
        <slot name="actionsRow" :row="row" />
      </td>
    </tr>
    <template v-if="row.subItems && openSubs">
      <tr class="subRow" :key="subRow.id" v-for="subRow in row.subItems">
        <td
          :key="column.name + column.label + row.id"
          v-for="column in columnsSub"
          v-tooltip="getTooltipConfig(column, row)"
        >
          <DatatableColumnTypeSwitcher
            :format="column.format"
            :item="row[column.name]"
            :row="subRow"
            :visible-columns="sortableColumns"
            @colEvent="$emit('colEvent', $event)"
          />
        </td>
        <td key="openButton"></td>
      </tr>
    </template>
  </tbody>
</template>

<script>
import DatatableColumnTypeSwitcher from '@/components/DataTable/DataTableColumnTypeSwitcher';

export default {
  components: {
    DatatableColumnTypeSwitcher,
  },
  data() {
    return {
      openSubs: false,
    };
  },
  props: {
    row: {
      type: Object,
    },
    sortableColumns: {
      type: Array,
    },
    columnsSub: {
      type: Array,
    },
    subRows: {
      type: Boolean,
      required: false,
    },
    size: {
      type: Number,
      required: false,
    },
  },
  methods: {
    getTooltipConfig(column, row) {
      if (!column.tootltipText) {
        return;
      }
      return column.tootltipText(row[column.name], row);
    },
  },
};
</script>

<style lang="scss" scoped>
.collapse {
  height: 0;
  overflow: hidden;
  transition: 0.4s;
}

.cursorP {
  cursor: pointer;
}

.openCollapse {
  height: 100%;
}

.subRow {
  &:nth-child(2n) {
    background-color: #bed8ff;
  }
  background-color: #e3ebf7;
  font-size: 14px;
  border-top: 1px solid white;
}
</style>
