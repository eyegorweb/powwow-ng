<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <GetSimFilters />
      </div>
      <div class="col-md-9">
        <div class="card">
          <div class="card-body">
            <h4>Valeurs séléctionnées</h4>
            <pre>{{ filtersState }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GetSimFilters from '@/components/GetSimFilters';

export default {
  name: 'Filters',
  components: {
    GetSimFilters,
  },
  computed: {
    filtersState() {
      return this.$store._modules.root.context.state.filters.currentFilters;
    },
  },
};
</script>
