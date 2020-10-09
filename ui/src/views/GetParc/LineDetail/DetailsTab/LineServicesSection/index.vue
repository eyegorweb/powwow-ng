<template>
  <div>
    <template v-if="!services || !services.length">
      <h4 class="text-primary text-uppercase">
        {{ $t('getparc.lineDetail.tabServices.services') }}
      </h4>
      <div class="bg-white p-4 rounded">
        <div class="alert alert-light m-0" role="alert">
          {{ $t('noResult') }}
        </div>
      </div>
    </template>
    <template v-else>
      <draggable handle=".handle">
        <transition-group>
          <ContentBlock :key="'block1'" v-if="optionalServices && optionalServices.length">
            <template slot="title">
              <span>{{ $t('getparc.lineDetail.tabServices.optionalServices') }}</span>
            </template>
            <template slot="content">
              <div>
                <ServicesBlock :services="optionalServices" full-width />
              </div>
            </template>
          </ContentBlock>

          <ContentBlock :key="'block2'">
            <template slot="title">{{ $t('getparc.lineDetail.tabServices.services') }}</template>
            <template slot="content">
              <div class="row">
                <div class="col">
                  <LoaderContainer :is-loading="isLoadingServices">
                    <div slot="on-loading">
                      <ServicesSkeleton />
                    </div>
                    <ServicesBlock
                      :key="servicesVersion"
                      v-if="services"
                      :services="services"
                      :initial-services="initialServices"
                      :data-params-needed="isDataParamsError"
                      @change="onServiceChange"
                    />
                  </LoaderContainer>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <button
                    v-if="!savingChanges"
                    @click="saveChanges"
                    :disabled="!canSave"
                    class="btn btn-primary float-right"
                  >
                    <i class="ic-Settings-Icon"></i>
                    {{ $t('getparc.lineDetail.tabServices.modifyServices') }}
                  </button>
                  <button v-else class="btn btn-primary float-right" disabled>
                    {{ $t('processing') }}...
                    <CircleLoader />
                  </button>
                  <button
                    v-if="canCancel"
                    class="btn btn-outline-primary float-right mr-3"
                    @click="revertServices"
                  >
                    <i class="ic-Refresh-Icon"></i>
                    {{ $t('getparc.lineDetail.tabServices.cancelModifications') }}
                  </button>
                </div>
              </div>
            </template>
          </ContentBlock>

          <ContentBlock :key="'block3'" v-if="!userIsMVNO">
            <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdressFix') }}</template>
            <template slot="content">
              <div class="row" v-if="canShowTable">
                <div class="col-md-12">
                  <table class="table table-blue mt-1 small-text">
                    <thead>
                      <tr>
                        <th>{{ $t('getparc.lineDetail.tabServices.apn') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.ipAdress') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.version') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="service in apnServices[0]" :key="service.code">
                        <td>{{ $loGet(service, 'name', '-') }}</td>
                        <td>{{ $loGet(service, 'ipAdress', '-') }}</td>
                        <td>{{ $loGet(service, 'version', '-') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="alert-light" role="alert">{{ $t('noResult') }}</div>
            </template>
          </ContentBlock>
        </transition-group>
      </draggable>
    </template>
  </div>
</template>

<script>
import ServicesSkeleton from '@/components/Services/ServicesSkeleton.vue';
import LoaderContainer from '@/components/LoaderContainer';
import CircleLoader from '@/components/ui/CircleLoader';

import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import {
  getOfferServices,
  getOptionalServices,
  getApnServices,
} from '@/components/Services/utils.js';
import { fetchLineServices } from '@/api/linesActions.js';
import { changeService } from '@/api/actCreation.js';
import { formattedCurrentDate } from '@/utils/date';
import { mapMutations, mapGetters } from 'vuex';

import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';

export default {
  components: {
    draggable,
    ContentBlock,
    ServicesBlock,
    ServicesSkeleton,
    LoaderContainer,
    CircleLoader,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      services: undefined,
      initialServices: undefined,
      apnServices: undefined,
      isLoadingServices: true,
      savingChanges: false,
      servicesVersion: 1,
      isDataParamsError: false,

      optionalServices: undefined,

      initialDataParams: undefined,
      lastDataParams: undefined,
      initDataCheck: false,
      dataCheck: false,
    };
  },
  async mounted() {
    this.isLoadingServices = true;
    const services = await fetchLineServices(this.content.id);
    this.isLoadingServices = false;
    if (services && services.length) {
      const offerServices = getOfferServices(services);
      this.initialServices = cloneDeep(offerServices);
      this.optionalServices = getOptionalServices(services);
      this.services = offerServices;
      this.apnServices = getApnServices(services);
    }
  },
  methods: {
    ...mapMutations(['flashMessage']),

    async saveChanges() {
      const partyId = this.content.party.id;
      const offerCode = get(this.content, 'accessPoint.offer.marketingOffer.code');
      const {
        servicesToEnable,
        servicesToDisable,
        // dataService,
        dataChanged,
        dataParams,
      } = this.changes;

      try {
        this.isDataParamsError =
          this.dataCheck &&
          this.lastDataParams &&
          this.lastDataParams.filter(p => p.selected).length === 0;

        if (this.isDataParamsError) return;

        const canSaveData = dataChanged || (dataParams && dataParams.length);

        this.savingChanges = true;
        const dataService = canSaveData
          ? {
              checked: this.dataCheck,
              parameters: this.lastDataParams,
              code: 'DATA',
            }
          : undefined;
        const response = await changeService([], [this.content], {
          notifEmail: false,
          dueDate: formattedCurrentDate(),
          tempDataUuid: undefined,
          partyId,
          servicesToEnable,
          servicesToDisable,
          dataService,
          offerCode,
        });

        this.savingChanges = false;
        if (response && response.errors && response.errors.length) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        }
      } catch (e) {
        this.savingChanges = false;
        console.log(e);
      }
    },
    revertServices() {
      this.services = cloneDeep(this.initialServices);
      this.servicesVersion += 1;
    },
    onServiceChange(selectedServices) {
      if (!this.initialDataParams && selectedServices.dataService) {
        this.initialDataParams = cloneDeep(selectedServices.dataService.parameters);
        this.initDataCheck = selectedServices.dataService.checked;
      }

      if (selectedServices.dataService && selectedServices.dataService.checked) {
        this.lastDataParams = cloneDeep(selectedServices.dataService.parameters);
        this.dataCheck = selectedServices.dataService.checked;
      } else {
        this.lastDataParams = undefined;
        this.dataCheck = false;
      }

      this.services = [...selectedServices.services, selectedServices.dataService];
    },

    isDataParamChanged() {
      let arrayIsNotIdentical = false;

      if (this.initialDataParams && this.lastDataParams) {
        for (let i = 0, max = this.initialDataParams.length; i < max; i++) {
          const current = this.initialDataParams[i];
          const correspondingInChanges = this.lastDataParams.find(s => s.code === current.code);

          if (correspondingInChanges && current.selected !== correspondingInChanges.selected) {
            arrayIsNotIdentical = true;
            break;
          }
        }
      }

      return arrayIsNotIdentical;
    },
  },
  computed: {
    ...mapGetters(['userIsMVNO']),

    canCancel() {
      return this.isDataParamChanged() || (this.changedServices && this.changedServices.length);
    },

    canShowTable() {
      return this.apnServices && this.apnServices[0] && this.apnServices[0].length;
    },
    changedServices() {
      return this.services.filter(s => {
        const originalService = this.initialServices.find(os => os.code === s.code);
        return originalService.checked !== s.checked;
      });
    },
    changes() {
      if (!this.services) {
        return {
          servicesToEnable: undefined,
          servicesToDisable: undefined,
          dataService: undefined,
        };
      }

      const servicesToEnable = this.changedServices
        .filter(s => s.code !== 'DATA')
        .filter(s => s.checked);
      const servicesToDisable = this.changedServices
        .filter(s => s.code !== 'DATA')
        .filter(s => !s.checked);

      let dataParams = undefined;

      if (this.isDataParamChanged()) {
        dataParams = this.lastDataParams;
      }

      return {
        servicesToEnable,
        servicesToDisable,
        dataChanged: this.dataCheck != this.initDataCheck,
        dataParams,
      };
    },

    canSave() {
      const { servicesToEnable, servicesToDisable, dataChanged, dataParams } = this.changes;

      return !!(
        (servicesToEnable && servicesToEnable.length) ||
        (servicesToDisable && servicesToDisable.length) ||
        (dataParams && dataParams.length) ||
        dataChanged
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
