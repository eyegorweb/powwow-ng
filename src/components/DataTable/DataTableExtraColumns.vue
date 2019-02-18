<template>
  <div class="row">
    <div class="col-md-3 offset-md-9 panel-container">
      <div class="card">
        <div class="card-body">
          <h6>{{ $t('showOrHideColumns') }}</h6>

          <div class="checkboxes">
            <Checkbox
              v-for="extraColumn in localExtraColumns"
              :key="extraColumn.name"
              v-model="extraColumn.isChecked"
            >{{ extraColumn.label }}</Checkbox>
          </div>

          <button :disabled="!canSave()" class="btn btn-block btn-primary" @click="saveExtraColumns">{{ $t('save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/ui/Checkbox.vue';

export default {
  name: 'AdditionalColumns',
  components: {
    Checkbox,
  },
  props: {
    extraColumns: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    maxAllowedExtraColumns: Number,
  },
  data() {
    return {
      localExtraColumns: [],
    };
  },

  created() {
    this.localExtraColumns = this.extraColumns.reduce((all, column) => {
      const isChecked = !!this.columns.filter(c => c.id === column.id).length;
      const localColumn = { ...column, isChecked };
      all.push(localColumn);
      return all;
    }, []);
  },

  methods: {
    saveExtraColumns() {
      const columnsWithoutExtra = this.columns.filter(
        column => !this.extraColumns.filter(c => c.id == column.id).length
      );
      const extraColumnsToAdd = this.localExtraColumns
        .filter(column => column.isChecked)
        .map(column => {
          return { name: column.name, label: column.label, format: column.format, id: column.id };
        });

      const finalList = columnsWithoutExtra.concat(extraColumnsToAdd);
      this.$emit('update:columns', finalList);
    },
    canSave() {
      return this.localExtraColumns.filter(e => e.isChecked).length <= this.maxAllowedExtraColumns;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  color: $dark-gray;
  position: absolute;
  top: 5.6rem;
  z-index: 1;
  right: 1.6rem;
  width: 100%;
}
.panel-container {
  min-height: 0;
}

.card-body {
  padding: 0.9rem;
  h6 {
    text-align: center;
  }
  .checkboxes {
    margin: 1rem 0.2rem 1rem 0.2rem;
  }
}
</style>
