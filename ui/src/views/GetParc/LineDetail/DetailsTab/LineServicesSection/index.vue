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
                <ServicesOptionalBlock :services="optionalServices" full-width />
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
                      :roaming-extended-on-offer="isRoamingExtended"
                      @datachange="onDataServiceChange"
                      @communityChange="onCommunityChange"
                    />
                  </LoaderContainer>
                </div>
              </div>
              <div class="row mt-2" v-if="havePermission('act', 'manage_main')">
                <div class="col" v-if="!userIsM2MLight">
                  <button
                    v-if="!savingChanges"
                    @click="saveChanges"
                    :disabled="!canSave()"
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
                    v-if="canCancel && !justSaved"
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
                        <th>{{ $t('getparc.lineDetail.tabServices.parameter1') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.parameter2') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="service in apnServices[0]" :key="service.code">
                        <td>{{ $loGet(service, 'name', '-') }}</td>
                        <td>{{ $loGet(service, 'ipAdress', '-') }}</td>
                        <td>{{ $loGet(service, 'version', '-') }}</td>
                        <td>{{ $loGet(service, 'parameter1', '-') }}</td>
                        <td>{{ $loGet(service, 'parameter2', '-') }}</td>
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
import ServicesOptionalBlock from '@/components/Services/ServicesOptionalBlock.vue';
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
    ServicesOptionalBlock,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      communityHaveChanged: false,
      justSaved: false,
      services: undefined,
      initialServices: undefined,
      apnServices: undefined,
      isLoadingServices: true,
      savingChanges: false,
      servicesVersion: 1,
      isDataParamsError: false,
      newCommunityChange: undefined,

      optionalServices: undefined,

      initialDataParams: undefined,
      lastDataParams: undefined,
      initDataCheck: false,
      dataCheck: false,
      componentInitialized: false,
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
    setTimeout(() => {
      this.componentInitialized = true;
    });
    const ltem = this.services.find((s) => s.code === 'LTE-M');
    if (ltem && ltem.checked === false) {
      this.services.forEach((e) => {
        if (e.code === 'NB-IoT') {
          e.checked = false;
          e.editable = false;
        }
      });
    }
  },
  methods: {
    ...mapMutations(['flashMessage']),

    onCommunityChange(value) {
      // cette fonction est appelée durant le mount du composant ServiceBlocks, on veux ignorer la première valeur
      // envoyée par cet evenement car non saisie par l'utilisateur
      if (this.componentInitialized) {
        this.newCommunityChange = value;
      }
    },

    canSave() {
      const { servicesToEnable, servicesToDisable, dataChanged, dataParams } = this.changes;
      if (this.isRoamingExtended) {
        return (
          this.isTypeRoamingChanged ||
          !!(
            (servicesToEnable && servicesToEnable.length) ||
            (servicesToDisable && servicesToDisable.length) ||
            (dataParams && dataParams.length) ||
            dataChanged
          ) ||
          (!this.isTypeRoamingChanged &&
            !!(
              (servicesToEnable && servicesToEnable.length) ||
              (servicesToDisable && servicesToDisable.length) ||
              (dataParams && dataParams.length) ||
              dataChanged
            ))
        );
      }
      return !!(
        (servicesToEnable && servicesToEnable.length) ||
        (servicesToDisable && servicesToDisable.length) ||
        (dataParams && dataParams.length) ||
        dataChanged
      );
    },

    async saveChanges() {
      const partyId = this.content.party.id;
      const offerCode = get(this.content, 'accessPoint.workflowCode');
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
          this.lastDataParams.filter((p) => p.selected).length === 0;

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
          dueDate: formattedCurrentDate(true),
          tempDataUuid: undefined,
          partyId,
          servicesToEnable,
          servicesToDisable,
          dataService,
          offerCode,
          newCommunityChange: this.newCommunityChange ? this.newCommunityChange : undefined,
        });

        this.savingChanges = false;
        if (response && response.errors && response.errors.length) {
          // TEMP: send OK, waiting for update ChangeServices api
          response.errors.forEach((e) => {
            if (
              e.extensions &&
              e.extensions.selectedServices &&
              e.extensions.selectedServices === 'EmptyList'
            ) {
              this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
            } else {
              this.flashMessage({ level: 'danger', message: e.message });
            }
          });
        } else {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        }
      } catch (e) {
        this.savingChanges = false;
        console.log(e);
      }
      this.justSaved = true;
    },
    revertServices() {
      this.services = cloneDeep(this.initialServices);
      setTimeout(() => {
        this.componentInitialized = true;
        this.newCommunityChange = undefined;
      });
      this.servicesVersion += 1;
    },
    onDataServiceChange(selectedServices) {
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
          const correspondingInChanges = this.lastDataParams.find((s) => s.code === current.code);

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
    ...mapGetters(['userIsMVNO', 'userIsM2MLight', 'havePermission']),

    isRoamingExtended() {
      return this.$loGet(this.content, 'workflow.roamingExtended', false);
    },

    canCancel() {
      return (
        (this.isDataParamChanged() ||
          (this.changedServices && this.changedServices.length) ||
          this.isTypeRoamingChanged) &&
        !this.justSaved
      );
    },

    isTypeRoamingChanged() {
      let initialTypeRoaming;
      const foundTypeRoaming = this.initialServices.find((s) => s.code === 'ROAMING');
      if (foundTypeRoaming) {
        if (foundTypeRoaming.roamingType === 'MONDE') {
          initialTypeRoaming = {
            id: 'world',
            label: 'services.roaming.world',
            default: true,
          };
        } else if (foundTypeRoaming.roamingType === 'EUROPE') {
          initialTypeRoaming = {
            id: 'europe',
            label: 'services.roaming.europe',
            default: true,
          };
        } else {
          initialTypeRoaming = null;
        }
      }
      if (!this.newCommunityChange || (this.newCommunityChange && !initialTypeRoaming))
        return false;
      if (initialTypeRoaming.id !== this.newCommunityChange.id) {
        return true;
      }
      return false;
    },

    canShowTable() {
      return this.apnServices && this.apnServices[0] && this.apnServices[0].length;
    },
    changedServices() {
      return this.services.filter((s) => {
        const originalService = this.initialServices.find((os) => os.code === s.code);
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
        .filter((s) => s.code !== 'DATA')
        .filter((s) => s.checked);
      const servicesToDisable = this.changedServices
        .filter((s) => s.code !== 'DATA')
        .filter((s) => !s.checked);

      let dataParams = undefined;

      if (this.isDataParamChanged()) {
        dataParams = this.lastDataParams;
      }

      return {
        servicesToEnable,
        servicesToDisable,
        dataChanged: this.dataCheck !== this.initDataCheck,
        dataParams,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
