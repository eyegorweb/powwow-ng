<template>
  <ActFormContainer :validate-fn="onValidate">
    <div class="row">
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">
          {{ $t('getparc.actCreation.changeService.servicesToEnable') }}
        </span>
      </div>
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">
          {{ $t('getparc.actCreation.changeService.servicesToDisable') }}
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToEnable"
          :items-to-disable="servicesToDisable"
        />
      </div>
      <div class="col">
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToDisable"
          :items-to-disable="servicesToEnable"
        />
      </div>
    </div>
    <div class="row">
      <div class="col d-flex">
        <UiCheckbox v-model="shouldChangeData" />
        <span>{{ $t('getparc.actCreation.changeService.shouldChangeData') }}</span>
      </div>
    </div>
    <DataServiceToggle
      v-if="shouldChangeData"
      :service="dataService"
      vertical
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
import { getOfferServices } from '@/components/Services/utils.js';
import { changeService } from '@/api/actCreation2.js';

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
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    selectedOffer() {
      if (!this.actCreationPrerequisites) return;
      return this.actCreationPrerequisites.offer.data;
    },
  },
  mounted() {
    this.dataService = getOfferServices(this.selectedOffer.initialOffer).find(
      s => s.code === 'DATA'
    );
  },
  methods: {
    async onValidate(contextValues) {
      return await changeService(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        tempDataUuid: contextValues.tempDataUuid,
        partyId: this.actCreationPrerequisites.partner.id,
        servicesToEnable: this.servicesToEnable,
        servicesToDisable: this.servicesToDisable,
        dataService: this.shouldChangeData ? this.dataService : undefined,
        offerCode: this.actCreationPrerequisites.offer.data.code,
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
