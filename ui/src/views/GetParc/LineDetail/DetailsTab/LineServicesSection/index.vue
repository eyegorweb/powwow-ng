<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'" v-if="optionalServices && optionalServices.length">
          <template slot="title">{{
            $t('getparc.lineDetail.tabServices.optionalServices')
          }}</template>
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
                  class="btn btn-primary float-right"
                >
                  <i class="ic-Settings-Icon"></i>
                  Modifier les services
                </button>
                <button v-else class="btn btn-primary float-right" disabled>
                  {{ $t('processing') }}
                  <CircleLoader />
                </button>
                <button class="btn btn-outline-primary float-right mr-3" @click="revertServices">
                  <i class="ic-Refresh-Icon"></i>
                  Annuler les modifications
                </button>
              </div>
            </div>
          </template>
        </ContentBlock>

        <ContentBlock :key="'block3'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdressFix') }}</template>
          <template slot="content">
            <div class="row" v-if="canShowTable">
              <div class="col-md-12">
                <table class="table table-blue mt-1 small-text">
                  <thead>
                    <tr>
                      <th>
                        {{ $t('getparc.lineDetail.tabServices.apn') }}
                      </th>
                      <th>
                        {{ $t('getparc.lineDetail.tabServices.ipAdress') }}
                      </th>
                      <th>
                        {{ $t('getparc.lineDetail.tabServices.version') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="service in apnServices[0]" :key="service.code">
                      <td>
                        {{ getValue(service, 'name') }}
                      </td>
                      <td>
                        {{ getValue(service, 'ipAdress') }}
                      </td>
                      <td>
                        {{ getValue(service, 'version') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="alert-light" role="alert">
              {{ $t('noResult') }}
            </div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
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
import { mapMutations } from 'vuex';

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
    };
  },
  async mounted() {
    this.isLoadingServices = true;
    const services = await fetchLineServices(this.content.id);
    this.isLoadingServices = false;
    const offerServices = getOfferServices(services);
    this.initialServices = cloneDeep(offerServices);
    this.optionalServices = getOptionalServices(services);
    this.services = offerServices;
    this.apnServices = getApnServices(services);
  },
  methods: {
    ...mapMutations(['flashMessage']),

    async saveChanges() {
      const changedServices = this.services.filter(s => {
        const originalService = this.initialServices.find(os => os.code === s.code);
        return originalService.checked !== s.checked;
      });
      const servicesToEnable = changedServices
        .filter(s => s.code !== 'DATA')
        .filter(s => s.checked);
      const servicesToDisable = changedServices
        .filter(s => s.code !== 'DATA')
        .filter(s => !s.checked);
      const partyId = this.content.party.id;
      const dataService = changedServices.find(s => s.code === 'DATA');
      const offerCode = get(this.content, 'accessPoint.offer.marketingOffer.code');

      try {
        this.isDataParamsError =
          dataService &&
          dataService.parameters &&
          dataService.parameters.filter(p => p.selected).length === 0;

        if (this.isDataParamsError) return;

        this.savingChanges = true;
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
        if (response.errors && response.errors.length) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          this.flashMessage({ level: 'success', message: 'Opération effectuée avec succès' });
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
      this.services = [...selectedServices.services, selectedServices.dataService];
    },
    getValue(objectToUse, path, defaultValue = '') {
      if (objectToUse == null || objectToUse == undefined) {
        return '-';
      }
      const value = get(objectToUse, path, defaultValue);
      return value !== null ? value : '-';
    },
  },
  computed: {
    canShowTable() {
      return this.apnServices && this.apnServices[0] && this.apnServices[0].length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
