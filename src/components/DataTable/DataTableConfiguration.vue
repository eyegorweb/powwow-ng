<template>
  <div class="row">
    <div class="col-md-3 offset-md-9 panel-container">
      <div class="card">
        <div class="card-body">
          <h6>{{ $t('showOrHideColumns') }}</h6>

          <div class="checkboxes">
            <Checkbox
              v-for="column in localExtraColumns"
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
  name: 'AdditionalColumns',
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
      localExtraColumns: [],
    };
  },

  created() {
    this.localExtraColumns = cloneDeep(this.columns);
  },

  methods: {
    saveExtraColumns() {
      this.$emit('update:columns', this.localExtraColumns);
    },
    canAddColumns() {
      return this.localExtraColumns.filter(e => e.visible).length + 1 <= this.maxColumnsNumber;
    },
    isDisabled(column) {
      if (this.localExtraColumns.length > 0 && column.id === this.localExtraColumns[0].id) {
        return true;
      }
      if (!column.visible) {
        return !this.canAddColumns();
      }
      return false;
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
