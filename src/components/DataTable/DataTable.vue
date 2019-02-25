<template>
  <div>
    <DataTableConfiguration
      v-if="showExtraColumns"
      :columns="columns"
      @update:columns="setColumns"
      :max-columns-number="size"
    />
    <div class="row">
      <div class="col-md-7">
        <form class="searchInput">
          <div class="form-row">
            <div class="form-group col-md-8 mb-0">
              <UiInput :placeholder="$t('searchOrderById')" value class="d-block">
                <i slot="icon" class="ic-Info-Icon" />
              </UiInput>
            </div>
            <div class="form-group col-md-3 mb-0">
              <button type="button" class="btn btn-primary btn-sm btn-block mt-1">{{ $t('search') }}</button>
            </div>
          </div>
        </form>
      </div>
      <div class="col-md-5">
        <div class="float-left">
          <label class="form-group">
            {{ $t('numberPerPage') }}:
            <UiSelect class="text-gray" :placeholder="$t('partnerType')" v-model="currentPageLimit">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </UiSelect>
          </label>
        </div>
        <nav class="float-right">
          <DataTablePagination :total="total" :page.sync="currentPage" :page-limit="pageLimit" />
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-blue mt-1">
          <draggable element="thead" v-model="sortableColumns" :options="draggableOptions">
            <transition-group tag="tr" name="table">
              <th :key="column.name+column.label" v-for="column in sortableColumns">
                <span v-if="!column.noHandle" class="handle ic-Drag-Column-Icon" />
                {{ column.label }}
                <DataTableOrderArrow
                  v-if="column.orderable"
                  :column-name="column.name"
                  :order-by.sync="currentDirection"
                />
              </th>
              <th :key="'btnAdd'">
                <button
                  type="button"
                  class="btn btn-light btn-sm float-right"
                  @click="$emit('update:showExtraColumns', !showExtraColumns)"
                >
                  <span v-if="showExtraColumns" class="ic-Minus-Icon" />
                  <span v-else class="ic-Plus-Icon" />
                </button>
              </th>
            </transition-group>
          </draggable>
          <tbody>
            <tr :key="row.id" v-for="row in rows">
              <td
                :key="column.name+column.label+row.id"
                v-for="column in sortableColumns"
              >
                <DatatableColumnTypeSwitcher :format="column.format" :item="row[column.name]" :row="row" />
              </td>
              <td>
                <slot name="actions" :row="row" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import UiSelect from '@/components/ui/UiSelect';
import UiInput from '@/components/ui/UiInput';
import DataTablePagination from './DataTablePagination';
import DataTableOrderArrow from './DataTableOrderArrow';
import DataTableConfiguration from './DataTableConfiguration';
import DatatableColumnTypeSwitcher from '@/components/DataTable/DataTableColumnTypeSwitcher';

export default {
  name: 'DataTable',
  components: {
    draggable,
    UiSelect,
    UiInput,
    DataTableConfiguration,
    DataTablePagination,
    DataTableOrderArrow,
    DatatableColumnTypeSwitcher,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    orderBy: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    pageLimit: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    showExtraColumns: Boolean,
    size: Number,
  },

  data() {
    return {
      perPage: 20,
    };
  },

  computed: {
    sortableColumns: {
      get() {
        return this.visibleColumns;
      },
      set(newColumns) {
        this.$emit('change-order', newColumns);
      },
    },

    visibleColumns: {
      get() {
        return this.columns.filter(c => c.visible);
      },
    },
    currentPage: {
      get() {
        return this.page;
      },
      set(newPage) {
        this.$emit('update:page', newPage);
      },
    },
    currentDirection: {
      get() {
        return this.orderBy;
      },
      set(newOrderBy) {
        this.$emit('update:orderBy', newOrderBy);
      },
    },
    currentPageLimit: {
      get() {
        return this.pageLimit;
      },
      set(newPageLimit) {
        this.$emit('update:pageLimit', newPageLimit);
      },
    },
  },

  methods: {
    setColumns(newColumns) {
      this.$emit('update:columns', newColumns);
      this.$emit('update:showExtraColumns', false);
    },
  },

  created() {
    this.draggableOptions = { handle: '.handle' };
  },
};
</script>

<style lang="scss" scoped>
.table-blue thead {
  background-color: $primary;
  color: white;

  .sortable-chosen {
    background-color: #0c62b2;
  }
}
.table-blue {
  background: white !important;
  font-size: 14px;
  line-height: 24px;
}

.table-blue td {
  color: $dark-gray;
}

.table-blue th {
  font-weight: normal;
  color: #ffffff;
  font-size: 0.8rem;
}

.table-blue td .fa-blue {
  position: relative;
  top: 5px;
}

.handle {
  font-size: 20px;
  position: relative;
  top: 3px;
  &:hover {
    cursor: move;
  }
}

.searchInput {
  .input-group-text {
    background-color: #fff;
  }
  input {
    padding-left: 0;
    border-left: none;
  }
  input:focus {
    box-shadow: none;
    border-top-color: #ced4da;
    border-right-color: #ced4da;
    border-bottom-color: #ced4da;
  }

  button {
    padding: 0.46rem 0.5rem 0.46rem 0.5rem;
    margin-top: 0 !important;
  }
}

select {
  width: inherit;
  display: inline;
}

.form-control {
  -webkit-appearance: none;

  &:hover {
    cursor: pointer;
  }

  &--blue {
    color: $primary;
  }

  &--arrow-down {
    padding-right: 40px;
  }
}

.select-arrow {
  display: inline-block;
  transform: translateX(calc(-50% - 15px));
}
</style>
