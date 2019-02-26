<template>
  <div class="row">
    <div class="col-md-3 offset-md-9 panel-container">
      <div class="card">
        <div class="card-body">
          <h6>{{ $t('showOrHideColumns') }}</h6>

          <div class="checkboxes">
            <Checkbox
              v-for="column in localColumns"
              :key="column.id"
              v-model="column.visible"
              :disabled="isDisabled(column)"
            >{{ column.label }}</Checkbox>
          </div>
          <button class="btn btn-block btn-primary" @click="saveExtraColumns">{{ $t('save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/ui/Checkbox.vue';
import cloneDeep from 'lodash.clonedeep';

export default {
  /**
   * Choix des colonnes à afficher dans la table
   */
  name: 'DataTableConfiguration',
  components: {
    Checkbox,
  },
  props: {
    columns: {
      type: Array,
    },
    maxColumnsNumber: Number,
  },
  data() {
    return {
      localColumns: [],
    };
  },

  created() {
    this.localColumns = cloneDeep(this.columns);
  },

  methods: {
    saveExtraColumns() {
      this.$emit('update:columns', this.localColumns);
    },
    isDisabled(column) {
      if (column.fixed) {
        return true;
      }

      if (!column.visible) {
        return !this.canAddColumns;
      }

      return false;
    },
  },
  computed: {
    // le nombre de colonnes visibles ne doit pas éxéder le maximum authorisé (maxColumnsNumber)
    canAddColumns() {
      return this.localColumns.filter(e => e.visible).length + 1 <= this.maxColumnsNumber;
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
