<template>
  <ActFormContainer
    :validate-fn="onValidate"
    :check-errors-fn="checkErrors"
    :prevent-send="!canSend"
  >
    <div class="flex">
      <div class="serviceBox">
        <div class="serviceBox-title">
          <span class="font-weight-bold mt-4 mb-4">{{
            $t('getparc.actCreation.changeService.servicesToEnable')
          }}</span>
        </div>
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToEnable"
          :items-to-disable="servicesToDisable"
          :activated="true"
        />
      </div>
      <div class="serviceBox">
        <div class="serviceBox-title">
          <span class="font-weight-bold mt-4 mb-4">{{
            $t('getparc.actCreation.changeService.servicesToDisable')
          }}</span>
        </div>
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToDisable"
          :items-to-disable="servicesToEnable"
          selected-color="bg-accent"
          :activated="false"
        />
      </div>
    </div>

    <div slot="messages" class="text-info">
      <div
        class="services"
        v-if="servicesToEnable.length > 0 || shouldChangeData || servicesToDisable.length > 0"
      >
        <span v-if="checkDataMandatory">
          <i class="ic-Alert-Icon"></i>
          {{ $t('getparc.actCreation.changeService.servicesToEnableWarning') }}
        </span>
        <h4 v-if="servicesToEnable.length > 0">
          {{ $t('getparc.actCreation.changeService.servicesToEnable') }}
        </h4>
        <div v-for="service in servicesToEnable" :key="service.id">
          {{ service.label }}
        </div>
        <h4 v-if="servicesToDisable.length > 0">
          {{ $t('getparc.actCreation.changeService.servicesToDisable') }}
        </h4>
        <div v-for="service in servicesToDisable" :key="service.id">
          {{ service.label }}
        </div>
        <h4 v-if="shouldChangeData">Data services</h4>
        <div v-if="dataService && dataService.parameters && shouldChangeData">
          <div v-for="service in dataService.parameters" :key="service.id">
            {{ service.selected ? service.label : '' }}
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col d-flex">
        <UiCheckbox v-model="shouldChangeData" :disabled="isDisabled" />
        <span>{{ $t('getparc.actCreation.changeService.shouldChangeData') }}</span>
      </div>
    </div>
    <DataServiceToggle
      v-if="shouldChangeData"
      :service="dataService"
      vertical
      :data-params-needed="isDataParamsError"
      @change="onDataServiceChange"
      @apnChange="onApnChange"
    />
    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import ServicesChoice from './parts/ServicesChoice';
import { mapState, mapGetters } from 'vuex';

import UiCheckbox from '@/components/ui/Checkbox';

import DataServiceToggle from '@/components/Services/DataServiceToggle';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { changeService } from '@/api/actCreation.js';

import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    ServicesChoice,
    UiCheckbox,
    DataServiceToggle,
  },
  data() {
    return {
      shouldChangeData: false,
      servicesToEnable: [],
      servicesToDisable: [],
      dataService: undefined,
      isDataParamsError: false,
      exceptionError: undefined,
      isDisabled: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    selectedOffer() {
      if (!this.actCreationPrerequisites) return;
      return this.actCreationPrerequisites.offer.data;
    },
    canSend() {
      return (
        (this.shouldChangeData && !this.checkErrors()) ||
        (this.servicesToEnable && this.servicesToEnable.length) ||
        (this.servicesToDisable && this.servicesToDisable.length)
      );
    },
    checkDataMandatory() {
      let mandatory = false;
      if (this.servicesToEnable) {
        const service = this.servicesToEnable.find((s) => {
          let code = null;

          if (s.listServiceMandatory) {
            code = s.listServiceMandatory.find((sm) => 'DATA' === sm[0]);
          }
          return code;
        });
        if (service) {
          mandatory = true;
        }
      }
      return mandatory;
    },
  },
  mounted() {
    this.dataService = getMarketingOfferServices(this.selectedOffer.initialOffer).find((s) => {
      return s.code === 'DATA';
    });
    this.isDisabled = this.dataService && !this.dataService.editable;
  },
  methods: {
    checkErrors() {
      let isError = false;
      this.isDataParamsError = false;
      if (this.shouldChangeData && this.dataService && this.dataService.parameters) {
        this.isDataParamsError =
          this.dataService &&
          this.dataService.parameters &&
          this.dataService.parameters.filter((p) => p.selected).length === 0;
        isError = this.isDataParamsError;
      }
      return isError;
    },
    async onValidate(contextValues) {
      const response = await changeService(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        tempDataUuid: contextValues.tempDataUuid,
        partyId: this.actCreationPrerequisites.partner.id,
        servicesToEnable: this.servicesToEnable,
        servicesToDisable: this.servicesToDisable,
        dataService: this.shouldChangeData ? this.dataService : undefined,
        offerCode: this.actCreationPrerequisites.offer.id,
      });
      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else if (
            e.value === 'MANDATORY_SERVICE_NOT_FOUND' ||
            e.value === 'INCOMPATIBLE_SERVICE' ||
            e.value === 'MANDATORY_SERVICE'
          ) {
            let service = e.key;
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.value, {
              service,
            })}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      }
      return response;
    },
    onDataServiceChange(data) {
      this.dataService = { ...data, parameters: [...data.apns] };
    },
    onApnChange(apns) {
      this.dataService = { ...this.dataService, parameters: [...apns] };
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;

  .serviceBox {
    margin-right: 20px;

    &-title {
      margin-bottom: 10px;
    }
  }
}
.services {
  width: 60%;
  border: 1px solid #d6d6d6;
  padding: 10px;

  h4 {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
  }
  span {
    font-size: 11px;
    margin: 0;
    color: #f00000da;
  }

  div {
    font-size: 14px;
  }
}
</style>
