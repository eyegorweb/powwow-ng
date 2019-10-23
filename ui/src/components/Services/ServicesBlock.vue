<template>
  <div class="row">
    <div class="col-md-8">
      <div class="s-container">
        <div :key="service.name" v-for="service in barringServices" class="service">
          <BarringServiceToggle
            :code="service.code"
            :catalog-offer="offer"
            :instance-offer="{}"
            :label="'services.' + service.name"
            @change="value => onBarringChange(service, value)"
          />
        </div>
        <div :key="service.name" v-for="service in normalServices" class="service">
          <NormalServiceToggle
            :code="service.code"
            :catalog-offer="offer"
            :instance-offer="{}"
            :label="'services.' + service.name"
            @change="value => onNormalChange(service, value)"
          />
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <DataServiceToggle :catalog-offer="offer" @change="onDataChange" />
    </div>
  </div>
</template>

<script>
// DEPRECATED
import BarringServiceToggle from '@/components/Services/BarringServiceToggle';
import NormalServiceToggle from '@/components/Services/NormalServiceToggle';
import DataServiceToggle from '@/components/Services/DataServiceToggle';
import {
  barringServices,
  normalServices,
  isBarrinServiceEnabled,
  isNormalServiceEnabled,
  initDataService,
} from '@/utils/simServices';

export default {
  props: {
    offer: {
      type: Object,
      default: undefined,
    },
  },

  components: {
    BarringServiceToggle,
    DataServiceToggle,
    NormalServiceToggle,
  },

  mounted() {
    // initialiser l'état des services
    this.barringServices = barringServices.map(s => {
      const { checked, editable } = isBarrinServiceEnabled(this.offer, s.code);
      return {
        ...s,
        checked,
        editable,
      };
    });
    this.normalServices = normalServices.map(s => {
      const { checked, editable } = isNormalServiceEnabled(this.offer, s.code);
      return {
        ...s,
        checked,
        editable,
      };
    });
    this.dataService = initDataService(this.offer);

    this.$emit('barringChange', this.barringServices);
    this.$emit('normalChange', this.normalServices);
    this.$emit('dataChange', this.dataService);
  },

  methods: {
    onBarringChange(service, value) {
      service.checked = value;
      this.$emit('barringChange', this.barringServices);
    },
    onNormalChange(service, value) {
      service.checked = value;
      this.$emit('normalChange', this.normalServices);
    },
    onDataChange(value) {
      this.$emit('dataChange', value);
    },
  },

  data() {
    return {
      barringServices: [],
      normalServices: [],
      dataService: undefined,
    };
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
