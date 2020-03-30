<template>
  <div v-if="!vertical">
    <div class="row">
      <div :class="{ 'col-md-8': !fullWidth, 'col-md-12': fullWidth }">
        <div class="s-container">
          <div
            :key="service.code"
            v-for="service in otherServices"
            class="service"
            :class="service.name ? 'fullWidth' : { 'quarter-size': fullWidth }"
          >
            <div v-if="service.name" class="serviceOptional">
              <div class="serviceOptional-name">{{ service.name }} :</div>
              <div :style="{ lineHeight: '1rem' }">
                <div class="serviceOptional-status" :class="service.checked ? 'enable' : 'disable'">
                  {{
                    service.checked
                      ? $t('getparc.lineDetail.tab1.activatedAt')
                      : service.activationDate
                      ? $t('getparc.lineDetail.tab1.disableAt')
                      : $t('orders.detail.deActivate')
                  }}
                </div>
                <div class="serviceOptional-date">{{ service.activationDate }}</div>
              </div>
            </div>
            <div v-else>
              <UiToggle
                :label="service.labelService"
                :editable="service.editable"
                v-model="service.checked"
                :bold-label="isChanged(service)"
                @change="onServiceChange"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="dataService" class="col-md-4">
        <DataServiceToggle
          :service="dataService"
          @change="onServiceChange"
          :data-params-needed="dataParamsNeeded"
          :bold-label="isChanged(dataService)"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <div class="services-container">
        <div :key="service.id" v-for="service in otherServices" class="single-service">
          <UiToggle
            :label="service.labelService"
            :editable="service.editable"
            :bold-label="isChanged(service)"
            v-model="service.checked"
            @change="onServiceChange"
          />
        </div>
      </div>
      <div v-if="dataService" class="services-container mt-3">
        <DataServiceToggle
          :service="dataService"
          :bold-label="isChanged(dataService)"
          vertical
          :data-params-needed="dataParamsNeeded"
          @change="onServiceChange"
          @apnChange="onApnChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import DataServiceToggle from './DataServiceToggle';

export default {
  components: {
    UiToggle,
    DataServiceToggle,
  },
  props: {
    services: Array,
    initialServices: {
      type: Array,
      default: () => [],
    },
    vertical: Boolean,
    dataParamsNeeded: Boolean,
    fullWidth: Boolean,
  },
  methods: {
    setup() {
      const dataService = this.services.find(s => s.code === 'DATA');
      if (dataService) {
        this.dataService = { ...dataService };
      }
      this.otherServices = [...this.services.filter(s => s.code !== 'DATA')];
    },
    isChanged(service) {
      if (!this.initialServices || !this.initialServices.length) return false;
      const initialService = this.initialServices.find(s => s.code === service.code);
      return initialService.checked !== service.checked;
    },
    onServiceChange(changes) {
      if (typeof changes !== 'object') return;
      const dataService = {
        ...this.dataService,
        checked: changes.checked,
        parameters: [...changes.apns],
      };
      this.$emit('change', {
        services: [...this.otherServices],
        dataService,
      });
    },
    onApnChange(apns) {
      this.dataService = { ...this.dataService, parameters: [...apns] };
      this.onServiceChange();
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

.quarter-size {
  flex-basis: 25% !important;
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
    margin: 0.6rem 0;
  }
}

@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.serviceOptional {
  display: flex;

  > div {
    margin-right: 0.5rem;
  }

  &-status {
    &.enable {
      color: $success;
    }
    &.disable {
      color: $orange;
    }
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

.serviceOptional-date {
  font-size: 0.8rem;
  font-weight: 500;
  color: $gray-400;
}
</style>
