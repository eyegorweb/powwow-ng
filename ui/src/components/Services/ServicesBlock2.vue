<template>
  <div v-if="!vertical">
    <div class="row">
      <div class="col-md-8">
        <div class="s-container">
          <div :key="service.code" v-for="service in otherServices" class="service">
            <UiToggle
              :label="$t('services.' + service.code)"
              :editable="service.editable"
              v-model="service.checked"
              @change="onServiceChange"
            />
          </div>
        </div>
      </div>
      <div v-if="dataService" class="col-md-4">
        <DataServiceToggle2 :service="dataService" @change="onServiceChange" />
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <div class="services-container">
        <div :key="service.id" v-for="service in otherServices" class="single-service mt-3 mb-3">
          <UiToggle
            :label="$t('services.' + service.code)"
            :editable="service.editable"
            v-model="service.checked"
            @change="onServiceChange"
          />
        </div>
      </div>
      <div v-if="dataService" class="services-container mt-3">
        <DataServiceToggle2
          :service="dataService"
          vertical
          @change="onServiceChange"
          @apnChange="onApnChange"
        />
      </div>
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
    vertical: Boolean,
  },
  methods: {
    onServiceChange() {
      this.$emit('change', {
        services: [...this.otherServices],
        dataService: { ...this.dataService },
      });
    },
    onApnChange(apns) {
      this.dataService = { ...this.dataService, parameters: [...apns] };
      this.onServiceChange();
    },
    setup() {
      const dataService = this.services.find(s => s.code === '878');
      if (dataService) {
        this.dataService = { ...dataService };
      }
      this.otherServices = [...this.services.filter(s => s.code !== '878')];
    },
  },
  data() {
    return {
      otherServices: undefined,
      dataService: undefined,
    };
  },
  watch: {
    services() {
      this.setup();
    },
  },
  mounted() {
    this.setup();
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

@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.toggle {
  max-width: 220px;
}
.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  .single-service {
    flex-basis: 50%;
  }
}

@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  .single-service {
    flex-basis: 50%;
  }
}

.apn-container {
  display: flex;
  flex-direction: row;
  span {
    flex-grow: 0;
  }
  .card {
    max-width: 210px;
    flex-grow: 1;
    margin-left: 10px;
  }
}
</style>
