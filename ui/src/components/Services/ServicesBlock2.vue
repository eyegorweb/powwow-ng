<template>
  <div class="row">
    <div class="col-md-8">
      <div class="s-container">
        <div :key="service.code" v-for="service in otherServices" class="service">
          <UiToggle
            :label="$t(service.code)"
            :editable="service.editable"
            v-model="service.activated"
          />
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <DataServiceToggle2 :service="dataService" />
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import DataServiceToggle2 from './DataServiceToggle2';

export default {
  components: {
    UiToggle,
    DataServiceToggle2,
  },
  props: {
    services: Array,
  },
  computed: {
    dataService() {
      return this.services.find(s => s.code === 'DATA');
    },
    otherServices() {
      return this.services.filter(s => s.code !== 'DATA');
    },
  },
};
</script>

<style lang="scss" scoped>
.s-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.service {
  flex-basis: 45%;
  margin-bottom: 1.5rem;
}
</style>
