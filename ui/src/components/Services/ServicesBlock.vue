<template>
  <div v-if="!vertical">
    <div class="row">
      <div
        v-if="servicesToShow && servicesToShow.length"
        :class="{ 'col-md-8': !fullWidth, 'col-md-12': fullWidth }"
      >
        <div class="s-container">
          <div
            :key="service.code"
            v-for="service in servicesToShow"
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
                :editable="!noClick && service.editable"
                :bold-label="isChanged(service)"
                :no-click="noClick"
                v-model="service.checked"
                :can-change-fn="
                  (value) => {
                    return canChangeValue(service, value);
                  }
                "
              />
            </div>
          </div>
        </div>
        <template v-if="canShowRoamingTypes">
          <div class="row">
            <div class="pl-4">
              <p class="label_before_toggle">{{ $t('services.roaming.title') }}</p>
            </div>
            <div class="pl-4">
              <MultiToggle
                v-if="roamingValues"
                @update="onRoamingExtChange"
                :values="roamingValues"
                :disabled="!canChangeRoamingExtended"
                block
                class="pl-2"
              />
            </div>
          </div>
        </template>
      </div>
      <div class="col-md-4">
        <template v-if="dataService">
          <DataServiceToggle
            v-if="dataService"
            :service="dataService"
            @change="onDataServiceChange"
            :data-params-needed="dataParamsNeeded"
            :bold-label="isChanged(dataService)"
            :no-click="noClick"
          />
        </template>
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <div class="services-container">
        <div :key="service.id" v-for="service in servicesToShow" class="single-service">
          <UiToggle
            :label="service.labelService"
            :editable="isServiceEditable(service)"
            :bold-label="isChanged(service)"
            :no-click="noClick"
            v-model="service.checked"
            :can-change-fn="
              (value) => {
                return canChangeValue(service, value);
              }
            "
          />
        </div>
      </div>
      <div v-if="dataService" class="services-container mt-3">
        <DataServiceToggle
          :service="dataService"
          :bold-label="isChanged(dataService)"
          vertical
          :data-params-needed="dataParamsNeeded"
          @change="onDataServiceChange"
          @apnChange="onApnChange"
          :disabled="noClick"
          :no-click="noClick"
          :read-only="readOnly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import DataServiceToggle from './DataServiceToggle';
import { mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import MultiToggle from '@/components/ui/UiToggle2';

export default {
  components: {
    UiToggle,
    DataServiceToggle,
    MultiToggle,
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
    noClick: Boolean,
    disabled: Boolean,
    readOnly: Boolean,
    roamingExtendedOnOffer: Boolean,
  },
  computed: {
    ...mapGetters(['userIsMVNO']),

    servicesToShow() {
      const excludedServicesForMVNO = [
        'INCOMING_VOICE',
        'OUTGOING_VOICE',
        'INCOMING_SMS',
        'OUTGOING_SMS',
        'DATA_CSD_NUMBER',
        'INCOMING_DATA_CSD',
        'ROAMING',
        'OUTGOING_DATA_CSD',
      ];

      if (this.otherServices && this.userIsMVNO) {
        return this.otherServices.filter((s) => !excludedServicesForMVNO.find((c) => c === s.code));
      }

      return this.otherServices;
    },
    roamingType() {
      if (!this.roamingService) return;
      return this.roamingService && this.roamingService.roamingType;
    },
    roamingValues() {
      return [
        {
          id: 'europe',
          label: 'services.roaming.europe',
          default: this.roamingType === 'EUROPE',
          value: 'EUROPE',
        },
        {
          id: 'world',
          label: 'services.roaming.world',
          default: this.roamingType === 'MONDE',
          value: 'MONDE',
        },
      ];
    },
    canShowRoamingTypes() {
      return this.roamingExtendedOnOffer;
    },
  },
  methods: {
    ...mapMutations(['popupMessage']),

    onRoamingExtChange(newValue) {
      this.extendedRoamingValue = newValue;
      this.$emit('communityChange', newValue);
    },

    isServiceEditable(service) {
      if (this.readOnly) return false;

      return !this.noClick && service.editable;
    },

    setup() {
      const dataService = this.services.find((s) => s.code === 'DATA');
      if (dataService) {
        this.dataService = { ...dataService };
      }
      this.otherServices = [...this.services.filter((s) => s.code !== 'DATA')];
      this.roamingService = this.services.find((s) => s.code === 'ROAMING');
    },
    isChanged(service) {
      if (!this.initialServices || !this.initialServices.length) return false;
      const initialService = this.initialServices.find((s) => s.code === service.code);
      return initialService.checked !== service.checked;
    },
    canChangeValue(service) {
      if (this.readOnly) return false;

      let canChange = true;

      if (service.preServiceCode) {
        // dependency chould be active to change value here
        const serviceThatIDependOn = this.services.find((s) => s.code === service.preServiceCode);
        if (serviceThatIDependOn.checked) {
          canChange = true;
        } else {
          this.popupMessage(
            this.$t('getadmin.partners.optionsDetails.services.mustBeActive', {
              service: serviceThatIDependOn.labelService,
            })
          );

          canChange = false;
        }
      } else {
        const servicesThatDependOnMe = this.services.filter(
          (s) => s.preServiceCode === service.code
        );
        if (servicesThatDependOnMe && servicesThatDependOnMe.length) {
          const checkedServices = servicesThatDependOnMe.filter((s) => s.checked);
          if (checkedServices.length === 0) {
            canChange = true;
          } else {
            this.popupMessage(
              this.$t('getadmin.partners.optionsDetails.services.mustBeInactive', {
                service: checkedServices[0].labelService,
              })
            );
            canChange = false;
          }
        }
      }

      return canChange;
    },

    checkInServices(service, checked) {
      const newServices = cloneDeep(this.services).map((s) => {
        if (s.code === service.code) {
          s.checked = checked;
        }

        return s;
      });
      this.services = [...newServices];
    },

    onDataServiceChange(changes) {
      if (typeof changes !== 'object') return;
      const dataService = {
        ...this.dataService,
        checked: changes.checked,
        parameters: [...changes.apns],
      };
      this.$emit('datachange', {
        services: [...this.otherServices],
        dataService,
      });
    },
    onApnChange(apns) {
      this.dataService = { ...this.dataService, parameters: [...apns] };
    },
  },
  data() {
    return {
      otherServices: undefined,
      dataService: undefined,
      extendedRoamingValue: undefined,
      roamingService: undefined,
      canChangeRoamingExtended: false,
    };
  },
  watch: {
    roamingService: {
      handler(roamingService) {
        if (roamingService && roamingService.checked) {
          this.canChangeRoamingExtended = true;
        } else {
          this.canChangeRoamingExtended = false;
        }
      },
      deep: true,
    },
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

.label_before_toggle {
  color: #454545;
  margin: 0;
  font-size: 0.9rem;
}

.quarter-size {
  flex-basis: 25% !important;
}

.third-size {
  flex-basis: 30% !important;
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
