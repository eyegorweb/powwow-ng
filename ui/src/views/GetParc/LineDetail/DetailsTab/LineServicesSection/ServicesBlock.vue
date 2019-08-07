<template>
  <div class="row">
    <div class="col-md-8">
      <div class="s-container">
        <div :key="service.name" v-for="service in barringServices" class="service">
          <BarringServiceToggle
            :code="service.code"
            :catalog-offer="content"
            :instance-offer="{}"
            :label="'services.' + service.name"
            @change="value => onBarringChange(service, value)"
          />
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <DataServiceToggle
        :catalog-offer="content"
        :instance-offer="{}"
        @change="$emit('dataChange', $event)"
      />
    </div>
  </div>
</template>

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

<script>
import BarringServiceToggle from '@/components/Services/BarringServiceToggle';
import DataServiceToggle from '@/components/Services/DataServiceToggle';

export default {
  props: {
    content: {
      type: Object,
      default: undefined,
    },
  },

  components: {
    BarringServiceToggle,
    DataServiceToggle,
  },

  mounted() {
    // initialiser l'état des services
    this.$emit('barringChange', this.barringServices);
  },

  methods: {
    onBarringChange(service, value) {
      service.checked = value;
      this.$emit('barringChange', this.barringServices);
    },
  },

  data() {
    return {
      barringServices: [
        {
          name: 'VOIX_ENTRANTE',
          code: '2175',
          checked: false,
        },
        {
          name: 'VOIX_SORTANTE',
          code: '2023',
          checked: false,
        },
        {
          name: 'SMS_ENTRANT',
          code: '2171',
          checked: false,
        },
        {
          name: 'SMS_SORTANT',
          code: '2174',
          checked: false,
        },
        {
          name: 'NUMERO_DATA_CSD',
          code: '2188',
          checked: false,
        },
        {
          name: 'DATA_CSD_ENTRANTE',
          code: '2172',
          checked: false,
        },
        {
          name: 'DATA_CSD_SORTANTE',
          code: '2173',
          checked: false,
        },
      ],
    };
  },
};
</script>
