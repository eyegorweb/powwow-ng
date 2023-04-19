<template>
  <ActFormContainer
    :validate-fn="onValidate"
    :check-errors-fn="checkErrors"
    :prevent-send="!canSend"
  >
    <div class="flex">
      <ServicesChoice
        :offer="selectedOffer"
        :selected-items.sync="servicesToEnable"
        :items-to-disable="servicesToDisable"
        :activated="true"
      />
      <div class="serviceBox">
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
    <div class="row" v-if="showDataService">
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
    <div class="d-flex mb-3">
      <div v-if="upfService">
        <UpfServiceToggle
          :service="upfService"
          :profile-data="profileData"
          vertical
          @change="onUpfServiceChange"
          @initprofiles="onProfilesChange"
        />
      </div>
      <div slot="messages" class="text-info">
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
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
import UpfServiceToggle from '@/components/Services/UpfServiceToggle';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { changeService } from '@/api/actCreation.js';

import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    ServicesChoice,
    UiCheckbox,
    DataServiceToggle,
    UpfServiceToggle,
  },
  data() {
    return {
      shouldChangeData: false,
      servicesToEnable: [],
      servicesToDisable: [],
      dataService: undefined,
      upfService: undefined,
      profileData: undefined,
      isDataParamsError: false,
      exceptionError: undefined,
      isDisabled: false,
      showDataService: false,
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
        (this.servicesToDisable && this.servicesToDisable.length) ||
        (this.upfService && this.profileData)
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
    this.showDataService = this.dataService && this.dataService.editable;
    this.upfService = getMarketingOfferServices(this.selectedOffer.initialOffer).find((s) => {
      return s.type === 'UPF';
    });
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
        upfService: this.upfService,
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
    onUpfServiceChange(changes) {
      if (typeof changes !== 'object') return;
      this.profileData = null;
      if (changes.profile) {
        this.profileData = {
          ...changes.profile,
          active: true,
          initialProfilCode: changes.defaultProfilCode,
        };
      }
      this.upfService.parameters = [this.profileData];
    },
    onProfilesChange(profiles) {
      this.upfService = { ...this.upfService, parameters: [...profiles] };
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
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
