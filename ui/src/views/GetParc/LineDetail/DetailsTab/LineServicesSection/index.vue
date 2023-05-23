<template>
  <div>
    <template v-if="!services || !services.length">
      <h4 class="text-primary text-uppercase">
        {{ $t('getparc.lineDetail.tabServices.services') }}
      </h4>
      <div class="bg-white p-4 rounded" v-if="requestErrors && requestErrors.length > 0">
        <ul class="text-danger list-unstyled">
          <li :key="error.message" v-for="error in requestErrors">
            {{ error.message }}
          </li>
        </ul>
      </div>
      <div class="bg-white p-4 rounded" v-else>
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
                      v-if="services"
                      :services="services"
                      :initial-services="initialServices"
                      :data-params-needed="isDataParamsError"
                      :roaming-extended-on-offer="isRoamingExtended"
                      @servicechange="onDataServiceChange"
                      @communityChange="onCommunityChange"
                      @updateProfileData="onUpdateProfileData"
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

          <ContentBlock :key="'block3'" v-if="!userIsMVNO && isIpFixeEnable">
            <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdressFix') }}</template>
            <template slot="content" v-if="canShowParameters">
              <div class="row">
                <div class="col-md-12" v-if="canShowAPN">
                  <table class="table table-blue mt-1 small-text">
                    <thead>
                      <tr>
                        <th>{{ $t('getparc.lineDetail.tabServices.apn') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.ipAddress') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.version') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.param1') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.param2') }}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="param in apnParams" :key="param.code">
                        <td>{{ $loGet(param, 'name', '-') }}</td>
                        <td>{{ $loGet(param, 'ipAdress', '-') }}</td>
                        <td>{{ $loGet(param, 'version', '-') }}</td>
                        <td>{{ $loGet(param, 'parameter1', '-') }}</td>
                        <td>{{ $loGet(param, 'parameter2', '-') }}</td>
                        <td>
                          <UiButton
                            v-if="param.radiusOption"
                            variant="link"
                            @click="modifyParam(param)"
                            :class="{ 'mx-auto': true }"
                            style="padding: 0; font-size: 0.9rem;"
                          >
                            <span class="btn-label">
                              {{ $t('getparc.lineDetail.tabServices.modifyParam') }}
                            </span>
                          </UiButton>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-12" v-if="canShowDNN">
                  <table class="table table-blue mt-1 small-text">
                    <thead>
                      <tr>
                        <th>{{ $t('getparc.lineDetail.tabServices.dnn') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.ipAddress') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.version') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.parameter1') }}</th>
                        <th>{{ $t('getparc.lineDetail.tabServices.parameter2') }}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="param in dnnParams" :key="param.code">
                        <td>{{ $loGet(param, 'name', '-') }}</td>
                        <td>{{ $loGet(param, 'ipAdress', '-') }}</td>
                        <td>{{ $loGet(param, 'version', '-') }}</td>
                        <td>{{ $loGet(param, 'parameter1', '-') }}</td>
                        <td>{{ $loGet(param, 'parameter2', '-') }}</td>
                        <td>
                          <UiButton
                            v-if="param.radiusOption"
                            variant="link"
                            @click="modifyParam(param)"
                            :class="{
                              'mx-auto': true,
                            }"
                            style="padding: 0; font-size: 0.9rem;"
                          >
                            <span class="btn-label">
                              {{ $t('getparc.lineDetail.tabServices.modifyParam') }}
                            </span>
                          </UiButton>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
            <template slot="content" v-else>
              <div class="alert-light" role="alert">{{ $t('noParameter') }}</div>
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
  getParamsServices,
} from '@/components/Services/utils.js';
import { fetchLineServices } from '@/api/linesActions.js';
import { changeService } from '@/api/actCreation.js';
import { formattedCurrentDate } from '@/utils/date';
import { mapMutations, mapGetters } from 'vuex';

import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';
import { isFeatureAvailable } from '@/api/partners';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    draggable,
    ContentBlock,
    ServicesBlock,
    ServicesSkeleton,
    LoaderContainer,
    CircleLoader,
    ServicesOptionalBlock,
    UiButton,
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
      paramServices: undefined,
      apnParams: [],
      dnnParams: [],
      isLoadingServices: true,
      savingChanges: false,
      servicesVersion: 1,
      newCommunityChange: undefined,

      optionalServices: undefined,

      initialDataParams: undefined,
      lastDataParams: undefined,
      initDataCheck: false,
      dataCheck: false,
      componentInitialized: false,
      dataService: undefined,
      isIpFixeEnable: false,
      upfProfileDataChange: false,

      requestErrors: undefined,
    };
  },
  async mounted() {
    this.isLoadingServices = true;
    const response = await fetchLineServices(this.content.id);

    if (response && response.errors && response.errors.length) {
      const formatted = formatBackErrors(response.errors)
        .map((e) => e.errors)
        .flat();

      formatted.forEach((r) => {
        if (r.key === 'NotFound') {
          const errorMessage = this.$t('errors.NotFound.' + r.value);
          this.requestErrors = [
            {
              message: errorMessage,
            },
          ];
        } else {
          this.requestErrors = [
            {
              message: this.$t('genericErrorMessage'),
            },
          ];
        }
      });
      this.isLoadingServices = false;
      return;
    }

    this.isLoadingServices = false;
    if (response && response.length) {
      const offerServices = getOfferServices(response);
      this.initialServices = cloneDeep(offerServices);
      this.optionalServices = getOptionalServices(response);
      this.services = offerServices;
      // extract All parameters
      this.paramServices = getParamsServices(response);
      // extract APN parameters
      this.paramServices.forEach((array) =>
        array.filter((p) => p.type === 'APN').forEach((elem) => this.apnParams.push(elem))
      );
      // extract DNN parameters
      this.paramServices.forEach((array) =>
        array.filter((p) => p.type === 'DNN').forEach((elem) => this.dnnParams.push(elem))
      );
      this.isIpFixeEnable = await isFeatureAvailable(
        'IP_FIXE_ENABLED',
        null,
        get(this.content, 'party.id')
      );
      this.setup();
      setTimeout(() => {
        this.componentInitialized = true;
      });
    }
  },
  methods: {
    ...mapMutations(['flashMessage', 'confirmAction', 'openPanel']),
    modifyParam(param) {
      this.openPanel({
        title: this.$t('getparc.lineDetail.tabServices.parameterServiceFormPanel.title'),
        panelId: 'getparc.lineDetail.parameterServiceFormPanel',
        payload: { param, sim: this.content },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
      });
    },
    setup() {
      const services = cloneDeep(this.services);
      const dataService = services.find((s) => s.code === 'DATA');
      if (dataService) {
        this.initDataCheck = dataService.checked;
        this.dataService = { ...dataService };
      }
    },

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
        dataChanged ||
        this.upfProfileDataChange
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

      if (this.isDataParamsError) return;

      let upfService = undefined;
      if (this.upfProfileDataChange) {
        upfService = this.services.find((s) => s.type === 'UPF');
      }

      const actionFn = async () => {
        this.savingChanges = true;
        const canSaveData = dataChanged || (dataParams && dataParams.length);
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
          upfService,
        });

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
          this.justSaved = true;
        }
        this.savingChanges = false;
      };

      this.confirmAction({
        message: this.warningMessage,
        actionFn,
        listStyle: !!this.warningMessage,
      });
    },
    revertServices() {
      this.services = cloneDeep(this.initialServices);

      const dataService = this.services.find((s) => s.code === 'DATA');
      if (dataService) {
        this.lastDataParams = cloneDeep(dataService.parameters);
      }
      setTimeout(() => {
        this.componentInitialized = true;
        this.newCommunityChange = undefined;
      });
      this.servicesVersion += 1;
    },
    onDataServiceChange(selectedServices) {
      if (!this.initialDataParams && selectedServices.dataService) {
        this.initialDataParams = cloneDeep(selectedServices.dataService.parameters);
      }

      if (selectedServices.dataService && selectedServices.dataService.checked) {
        this.lastDataParams = cloneDeep(selectedServices.dataService.parameters);
        this.dataCheck = selectedServices.dataService.checked;
      } else {
        this.lastDataParams = undefined;
        this.dataCheck = false;
      }

      if (selectedServices.upfService) {
        this.services = [...selectedServices.services, selectedServices.upfService];
      }
      if (selectedServices.dataService) {
        this.services = [...selectedServices.services, selectedServices.dataService];
      }
    },
    onUpdateProfileData(payload) {
      let canModify;
      if (payload) {
        canModify = true;
        if (payload.initialProfilCode && payload.initialProfilCode === payload.code) {
          canModify = false;
        }
      } else {
        canModify = false;
      }
      this.upfProfileDataChange = canModify;
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
      if (!this.services) return false;
      return (
        (this.isDataParamChanged() ||
          (this.changedServices && this.changedServices.length) ||
          this.isTypeRoamingChanged) &&
        !this.justSaved
      );
    },

    isDataParamsError() {
      return (
        this.dataCheck &&
        this.lastDataParams &&
        this.lastDataParams.filter((p) => p.selected).length === 0
      );
    },

    isTypeRoamingChanged() {
      if (!this.services) return false;
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

    canShowParameters() {
      return !!(this.paramServices && this.paramServices.length);
    },
    canShowAPN() {
      return !!(this.apnParams && this.apnParams.length);
    },
    canShowDNN() {
      return !!(this.dnnParams && this.dnnParams.length);
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
    changedServices() {
      if (!this.services) return [];
      return this.services.filter((s) => {
        const originalService = this.initialServices.find((os) => os.code === s.code);
        return originalService.checked !== s.checked && (s.code !== 'NB-IoT' || s.notify);
      });
    },
    // Services activés automatiquement
    listAutoServiceMandatory() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    // Services désactivés automatiquement
    listAutoServiceIncompatible() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => !s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    warningMessage() {
      let list = '',
        newLine = '';
      let message = '';
      if (this.listAutoServiceMandatory.length > 0) {
        list += `${this.$t(
          'services.listAutoServiceMandatory'
        )}: ${this.listAutoServiceMandatory.map((s) => s).join(',')}`;
      }
      if (this.listAutoServiceIncompatible.length > 0) {
        if (this.listAutoServiceMandatory.length) {
          newLine = '<br />';
        }
        list += `${newLine}${this.$t(
          'services.listAutoServiceIncompatible'
        )}: ${this.listAutoServiceIncompatible.map((s) => s).join(',')}`;
      }
      if (!list) {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmAction')}`;
      } else {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmationWarning', {
          list,
        })}`;
      }
      return message;
    },
  },
};
</script>

<style lang="scss" scoped></style>
