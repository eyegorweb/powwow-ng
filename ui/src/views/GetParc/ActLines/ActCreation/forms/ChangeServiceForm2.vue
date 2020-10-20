<template>
  <ActFormContainer
    :validate-fn="onValidate"
    :check-errors-fn="checkErrors"
    :prevent-send="!canSend"
  >
    <div class="row">
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">{{
          $t('getparc.actCreation.changeService.servicesToEnable')
        }}</span>
      </div>
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">{{
          $t('getparc.actCreation.changeService.servicesToDisable')
        }}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToEnable"
          :items-to-disable="servicesToDisable"
        />
      </div>
      <div class="col-md-6">
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToDisable"
          :items-to-disable="servicesToEnable"
          selected-color="bg-accent"
        />
      </div>
    </div>
    <div class="row">
      <div class="col d-flex">
        <UiCheckbox v-model="shouldChangeData" :disabled="!(dataService && dataService.editable)" />
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
        this.shouldChangeData ||
        (this.servicesToEnable && this.servicesToEnable.length) ||
        (this.servicesToDisable && this.servicesToDisable.length)
      );
    },
  },
  mounted() {
    this.dataService = getMarketingOfferServices(this.selectedOffer.initialOffer).find(
      s => s.code === 'DATA'
    );
  },
  methods: {
    checkErrors() {
      let isError = false;
      this.isDataParamsError = false;
      if (this.shouldChangeData) {
        this.isDataParamsError =
          this.dataService &&
          this.dataService.parameters &&
          this.dataService.parameters.filter(p => p.selected).length === 0;
        isError = this.isDataParamsError;
      }
      return isError;
    },
    async onValidate(contextValues) {
      return await changeService(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        tempDataUuid: contextValues.tempDataUuid,
        partyId: this.actCreationPrerequisites.partner.id,
        servicesToEnable: this.servicesToEnable,
        servicesToDisable: this.servicesToDisable,
        dataService: this.shouldChangeData ? this.dataService : undefined,
        offerCode: this.actCreationPrerequisites.offer.productCode,
      });
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

<style lang="scss" scoped></style>
