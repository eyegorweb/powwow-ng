<template>
  <div v-if="!vertical">
    <div class="row">
      <div
        v-if="servicesToShow && servicesToShow.length"
        :class="{ 'col-md-8 displayFlex': !fullWidth, 'col-md-12': fullWidth }"
      >
        <div class="s-container">
          <div
            :key="service.code + '_' + index"
            v-for="(service, index) in servicesToShowOthers"
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
            <div
              v-else-if="
                service.code !== 'ROAMING' || (service.code == 'ROAMING' && !canShowRoamingTypes)
              "
            >
              <UiToggle
                :label="service.labelService"
                :editable="isServiceEditable(service)"
                :bold-label="isChanged(service)"
                :no-click="noClick"
                v-model="service.checked"
                @change="checkServices(service)"
                @click="onClick(service)"
                :can-change-fn="
                  (value) => {
                    return canChangeValue(service, value);
                  }
                "
              />
            </div>
          </div>
          <!-- RoamingExtended is check in services toggles for the simple toggle -->
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
                  green-active
                  block
                  class="mt-2"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="s-container">
          <div
            :key="service.code + '_' + index"
            v-for="(service, index) in servicesToShowData"
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
                @change="checkServices(service)"
                @click="onClick(service)"
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
            :can-change-fn="
              (value) => {
                return canChangeValue(dataService, value);
              }
            "
          />
        </template>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="displayFlex">
      <div class="services-container s-container">
        <div
          :key="service.code + '_' + index"
          v-for="(service, index) in servicesOthers"
          class="single-service"
        >
          <UiToggle
            :label="service.labelService"
            :editable="isServiceEditable(service)"
            :bold-label="isChanged(service)"
            :no-click="noClick"
            v-model="service.checked"
            @change="checkServices(service)"
            @click="onClick(service)"
            :can-change-fn="
              (value) => {
                return canChangeValue(service, value);
              }
            "
          />
        </div>
      </div>
      <div class="s-container">
        <div class="services-container">
          <div
            :key="service.code + '_' + index"
            v-for="(service, index) in servicesData"
            class="single-service"
          >
            <UiToggle
              :label="service.labelService"
              :editable="isServiceEditable(service)"
              :bold-label="isChanged(service)"
              :no-click="noClick"
              v-model="service.checked"
              @change="checkServices(service)"
              @click="onClick(service)"
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
            :can-change-fn="
              (value) => {
                return canChangeValue(dataService, value);
              }
            "
          />
        </div>
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
    dataServiceVersion: Number,
    offer: Object,
  },
  computed: {
    ...mapGetters(['userIsMVNO']),

    servicesToShowOthers() {
      return this.servicesToShow.filter((s) => s.type === 'OTHER');
    },

    servicesToShowData() {
      return this.servicesToShow.filter((s) => s.type === 'DATA');
    },

    servicesOthers() {
      return this.services.filter((s) => s.type === 'OTHER');
    },

    servicesData() {
      return this.services.filter((s) => s.type === 'DATA');
    },

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
          id: 'off',
          label: 'off',
          default: this.roamingType === 'OFF',
          value: 'OFF',
        },
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

    setup() {
      const dataService = this.services.find((s) => s.code === 'DATA');
      if (dataService) {
        this.dataService = { ...dataService };
      }
      this.otherServices = [...this.services.filter((s) => s.code !== 'DATA')];
      this.roamingService = this.services.find((s) => s.code === 'ROAMING');
    },

    setupOffer() {
      this.defaultServices = cloneDeep(this.services);
      this.listServiceMandatory = this.defaultServices.filter(
        (s) => !!s.listServiceMandatory && s.listServiceMandatory.length > 0
      );
      this.listServiceIncompatible = this.defaultServices.filter(
        (s) => !!s.listServiceIncompatible && s.listServiceIncompatible.length > 0
      );
      this.defaultDataService = cloneDeep(this.initialServices.find((s) => s.code === 'DATA'));
    },

    handleError(code) {
      console.error('modification automatique du service ' + code + ' impossible');
    },

    displayServices(doInitNbiot = true) {
      this.initNbIoT(doInitNbiot);
      const activatedServicesWithMandatoryServices = this.services.filter(
        (s) => s.checked && s.listServiceMandatory && s.listServiceMandatory.length > 0
      );
      const activatedServicesWithIncompatibleServices = this.services.filter(
        (s) => s.checked && s.listServiceIncompatible && s.listServiceIncompatible.length > 0
      );

      if (activatedServicesWithMandatoryServices) {
        activatedServicesWithMandatoryServices.forEach((s) => {
          return s.listServiceMandatory.forEach((serv) => {
            let foundMandatoryService = this.findMandatoryService(serv, false);

            if (!foundMandatoryService) {
              foundMandatoryService = this.findMandatoryService(serv, true);
              this.setupDependencies(foundMandatoryService);
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: s.labelService,
                  serviceY: foundMandatoryService.labelService,
                })
              );
              return;
            }
            if (foundMandatoryService) {
              foundMandatoryService.checked = true;
            }
            return foundMandatoryService;
          });
        });
      }

      if (activatedServicesWithIncompatibleServices) {
        activatedServicesWithIncompatibleServices.forEach((s) => {
          return s.listServiceIncompatible.forEach((serv) => {
            let service = this.services.find((s) => s.code === serv);
            // Activation
            if (
              service &&
              !service.editable &&
              ((service.checked && !service.barring) || (!service.checked && service.barring))
            ) {
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: s.labelService,
                  serviceY: service.labelService,
                })
              );
              return;
            }
            if (service) {
              service.checked = service.barring;
            }

            return service;
          });
        });
      }
    },

    initNbIoT(doManageNbiot = true) {
      let nbiotService = this.services.find((s) => s.code === 'NB-IoT');
      if (nbiotService) {
        nbiotService.notify = false;
      }
      if (doManageNbiot) this.manageNbIoTDisplay();
    },

    manageNbIoTDisplay() {
      const ltemService = this.services.find((s) => s.code === 'LTE-M');
      let nbiotService = this.services.find((s) => s.code === 'NB-IoT');
      const initialNbiotService = this.initialServices.find((s) => s.code === 'NB-IoT');
      console.log('initial nbiot service', initialNbiotService);
      if (ltemService && nbiotService) {
        console.log('ltem service', ltemService);
        console.log('nbiot service', nbiotService);
        // Si ltem est non activé
        if (!ltemService.checked) {
          // alors Nb-IoT est inactif
          if (nbiotService.checked) {
            nbiotService.checked = false;
          }
          // Sinon si ltem est actif
        } else {
          if (!initialNbiotService.checked) {
            // alors Nb-IoT est actif si le baring Nb-IoT initial n'est pas actif
            if (nbiotService.checked) {
              nbiotService.checked = false;
            }
          } else {
            if (!nbiotService.checked && !nbiotService.editable) {
              nbiotService.checked = true;
            }
          }
        }
      }
    },

    handleNbIoT(service) {
      if (service.code === 'LTE-M') {
        let nbiotService = this.services.find((s) => s.code === 'NB-IoT');
        if (nbiotService) {
          if (!service.checked && nbiotService.checked) {
            nbiotService.checked = false;
            // nbiotService.notify = true;
          } else if (service.checked && !nbiotService.editable) {
            // Si le service NbIoT n'est pas éditable, dans ce cas là on active NbIoT lorsqu'on active LTE-M
            const initialNbiotService = this.defaultServices.find((s) => s.code === 'NB-IoT');
            nbiotService.checked = initialNbiotService.checked;
            // nbiotService.notify = true;
          }
          if (nbiotService.editable) {
            nbiotService.notify = true;
          }
        }
      }
    },

    findMandatoryService(elem, desactivateControl) {
      let foundMandatoryService = undefined;
      if (elem) {
        if (Array.isArray(elem)) {
          // Gestion des services en mode "OU"
          elem.find((sc) => {
            if (typeof sc === 'string') {
              let foundOrMandatoryService = this.findMandatoryService(sc, desactivateControl);
              if (foundOrMandatoryService) {
                foundMandatoryService = foundOrMandatoryService;
                return true;
              }
            }
          });
        } else {
          // Gestion d'un code de service
          foundMandatoryService = this.services.find(
            (service) =>
              service.code === elem && (desactivateControl || service.checked || service.editable)
          );
        }
      }
      return foundMandatoryService;
    },

    findDependantService(elem, serviceCodeDesactivated) {
      let foundAnotherMandatoryService = false,
        foundMandatoryService = false;
      if (elem) {
        if (Array.isArray(elem)) {
          elem.forEach((subElem) => {
            if (elem.length > 1) {
              // // Gestion niveau 1 'OU'
              if (subElem !== serviceCodeDesactivated) {
                if (!foundAnotherMandatoryService) {
                  foundAnotherMandatoryService = !!this.services.find(
                    (s) => s.code === subElem && s.checked
                  );
                }
              } else {
                foundMandatoryService = true;
              }
            } else {
              // Gestion niveau 1 'ET'
              foundMandatoryService = subElem === serviceCodeDesactivated;
            }
          });
          return foundMandatoryService && !foundAnotherMandatoryService;
        }
      }
      return foundMandatoryService;
    },

    /**
     * Configurer les services dépendants obligatoires et incompatibles
     * @param {Object} payload current service
     */
    setupDependencies(payload) {
      payload.isClicked = true;
      this.handleNbIoT(payload);
      // Cas d'une activation de service
      if (payload.checked) {
        // Traitement des services obligatoires
        if (payload.listServiceMandatory) {
          // on parcourt les services obligatoires
          payload.listServiceMandatory.forEach((lsm) => {
            let foundMandatoryService = this.findMandatoryService(lsm, false);
            // on ne prend que les services maîtres concernés
            // gestion erreur activation du service obligatoire impossible lancée par écoute sur le service de canChangeValue
            if (!foundMandatoryService) {
              foundMandatoryService = this.findMandatoryService(lsm, true);
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: payload.labelService,
                  serviceY: foundMandatoryService.labelService,
                })
              );
              return;
            }

            // activer (checked: true) ces services
            foundMandatoryService.checked = true;
            this.handleNbIoT(foundMandatoryService);
            foundMandatoryService.isClicked = false;

            // Désactiver les services incompatibles des services activés automatiquement
            if (
              foundMandatoryService.checked &&
              foundMandatoryService.listServiceIncompatible &&
              foundMandatoryService.listServiceIncompatible.length > 0
            ) {
              let foundIncompatibleService = this.services.find((serv) => {
                return foundMandatoryService.listServiceIncompatible.find((s) => serv.code === s);
              });

              // pour chaque service incompatible
              if (foundIncompatibleService) {
                // gestion erreur désactivation du service incompatible impossible
                if (!foundIncompatibleService.editable && foundIncompatibleService.checked) {
                  this.popupMessage(
                    this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                      serviceX: payload.labelService,
                      serviceY: foundIncompatibleService.labelService,
                    })
                  );
                  return;
                }
                // lorsque ce service est modifiable (editable: true)
                // désactiver (checked: false) ces services
                foundIncompatibleService.checked = false;
                this.handleNbIoT(foundIncompatibleService);
                foundIncompatibleService.isClicked = false;
                // Le service DATA est isolé des autres services
                // Il faut vérifier s'il fait partie des services incompatibles pour autant
                if (foundIncompatibleService.code === 'DATA') {
                  if (this.dataService) {
                    this.dataService.checked = false;
                    this.autoDataServiceChange({
                      checked: this.dataService.checked,
                      editable: this.dataService.editable,
                      parameters: this.dataService.parameters,
                      code: 'DATA',
                    });
                  }
                }
              }
            }
            // Le service DATA est isolé des autres services
            // Il faut vérifier s'il fait partie des services obligatoires pour autant
            if (foundMandatoryService.code === 'DATA') {
              if (this.dataService) {
                this.dataService.checked = true;
                // TODO: constructeur
                this.autoDataServiceChange({
                  editable: this.dataService.editable,
                  checked: this.dataService.checked,
                  parameters: this.dataService.parameters,
                  code: 'DATA',
                });
              }
            }
          });
        }

        // Traitement des services incompatibles
        if (payload.listServiceIncompatible) {
          payload.listServiceIncompatible.forEach((lsi) => {
            let foundIncompatibleService = this.services.find((serv) => serv.code === lsi);
            // pour chaque service incompatible
            if (foundIncompatibleService) {
              // gestion erreur désactivation du service incompatible impossible
              if (
                !foundIncompatibleService.editable &&
                ((foundIncompatibleService.checked && !foundIncompatibleService.barring) ||
                  (!foundIncompatibleService.checked && foundIncompatibleService.barring))
              ) {
                this.popupMessage(
                  this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                    serviceX: payload.labelService,
                    serviceY: foundIncompatibleService.labelService,
                  })
                );
                return;
              }
              // lorsque ce service est modifiable (editable: true)
              // désactiver (checked: false) ces services
              foundIncompatibleService.checked = foundIncompatibleService.barring;
              this.handleNbIoT(foundIncompatibleService);
              foundIncompatibleService.isClicked = false;
              // Le service DATA est isolé des autres services
              // Il faut vérifier s'il fait partie des services incompatibles pour autant
              if (foundIncompatibleService.code === 'DATA') {
                if (this.dataService) {
                  this.dataService.checked = false;
                  this.autoDataServiceChange({
                    checked: this.dataService.checked,
                    editable: this.dataService.editable,
                    parameters: this.dataService.parameters,
                    code: 'DATA',
                  });
                }
              }
            }
          });
        }
      } else {
        // Cas d'une désactivation
        // Gestion des services dépendants
        const foundDependantServices = this.services.filter(
          (s) => s.listServiceMandatory && s.listServiceMandatory.length
        );
        let foundMandatoryService = false;
        foundDependantServices.forEach((service) => {
          foundMandatoryService = false;
          service.listServiceMandatory.find((lsm) => {
            foundMandatoryService =
              foundMandatoryService || this.findDependantService(lsm, payload.code);
          });
          // gestion erreur activation du service obligatoire impossible
          if (foundMandatoryService) {
            if (service.checked && !service.editable) {
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: payload.labelService,
                  serviceY: service.labelService,
                })
              );
              return false;
            } else {
              service.checked = false;
              this.handleNbIoT(service);
            }
          }
        });

        // Gestion des services incompatibles des services barring de la matrice
        if (payload.barring) {
          const foundServiceWithIncompatibleServices = this.services.filter(
            (s) => s.listServiceIncompatible && s.listServiceIncompatible.length
          );
          let foundIncompatibleService = false;
          foundServiceWithIncompatibleServices.forEach((service) => {
            foundIncompatibleService = !!service.listServiceIncompatible.find((lsi) => {
              return lsi === payload.code;
            });
            // gestion erreur activation du service obligatoire impossible
            if (foundIncompatibleService) {
              if (service.checked && !service.editable) {
                this.popupMessage(
                  this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                    serviceX: payload.labelService,
                    serviceY: service.labelService,
                  })
                );
                return false;
              } else {
                service.checked = false;
                this.handleNbIoT(service);
              }
            }
          });
        }
      }
    },

    checkServices(service) {
      this.setupDependencies(service);
    },

    onRoamingExtChange(newValue) {
      this.extendedRoamingValue = newValue;
      this.$emit('communityChange', newValue);
    },

    isServiceEditable(service) {
      if (this.readOnly) return false;

      return !this.noClick && service.editable;
    },

    isChanged(service) {
      if (!this.initialServices || !this.initialServices.length) return false;
      const initialService = this.initialServices.find((s) => s.code === service.code);
      let haveToNotify = service.notify;
      return initialService.checked !== service.checked && haveToNotify;
    },

    onClick(service) {
      if (service.editable) service.notify = true;
    },

    canChangeValue(service, checkValue) {
      if (this.readOnly) return false;

      let canChange = true;

      let foundMandatoryService = undefined;
      if (checkValue) {
        // Gestion des services obligatoires
        // Activation du service
        if (service.listServiceMandatory) {
          // on parcourt les services obligatoires
          service.listServiceMandatory.forEach((lsm) => {
            foundMandatoryService = this.findMandatoryService(lsm, false);
            if (!foundMandatoryService) {
              foundMandatoryService = this.findMandatoryService(lsm, true);
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: service.labelService,
                  serviceY: foundMandatoryService.labelService,
                })
              );
              canChange = false;
              return;
            }
          });
        }

        // Gestion des services incompatibles
        const foundIncompatibleServices =
          service.listServiceIncompatible && service.listServiceIncompatible.length > 0
            ? service.listServiceIncompatible
            : [];
        if (foundIncompatibleServices.length) {
          const checkedIncompatibleServices = this.services.filter((s) => {
            if (
              foundIncompatibleServices.find(
                (ss) =>
                  ss === s.code &&
                  !s.editable &&
                  ((s.checked && !s.barring) || (!s.checked && s.barring))
              )
            ) {
              return s;
            }
          });
          if (checkedIncompatibleServices && checkedIncompatibleServices.length) {
            this.popupMessage(
              this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                serviceX: service.labelService,
                serviceY: checkedIncompatibleServices.map((s) => s.labelService).join(', '),
              })
            );
            canChange = false;
          }
        }
      } else {
        // Désactivation du service
        // Gestion des services obligatoires
        const foundDependantServices = this.services.filter(
          (s) => s.listServiceMandatory && s.listServiceMandatory.length
        );
        let foundMandatoryService = false;
        foundDependantServices.forEach((serv) => {
          foundMandatoryService = false;
          serv.listServiceMandatory.find((lsm) => {
            foundMandatoryService =
              foundMandatoryService || this.findDependantService(lsm, service.code);
            if (foundMandatoryService) {
              return false;
            }
          });
          // gestion erreur activation du service obligatoire impossible
          if (foundMandatoryService) {
            if (serv.checked && !serv.editable) {
              this.popupMessage(
                this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                  serviceX: service.labelService,
                  serviceY: serv.labelService,
                })
              );
              canChange = false;
              return;
            }
          }
        });

        // gestion des services incompatibles
        if (service.barring) {
          const foundServiceWithIncompatibleServices = this.services.filter(
            (s) => s.listServiceIncompatible && s.listServiceIncompatible.length
          );
          let foundIncompatibleService = false;
          foundServiceWithIncompatibleServices.forEach((serv) => {
            foundIncompatibleService = !!serv.listServiceIncompatible.find((lsi) => {
              return lsi === service.code;
            });
            // gestion erreur activation du service obligatoire impossible
            if (foundIncompatibleService) {
              if (serv.checked && !serv.editable) {
                this.popupMessage(
                  this.$t('getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX', {
                    serviceX: service.labelService,
                    serviceY: serv.labelService,
                  })
                );
                return false;
              } else {
                serv.checked = false;
              }
            }
          });
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

    autoDataServiceChange(dataService) {
      this.$emit('datachange', {
        services: [...this.otherServices],
        dataService,
      });
    },

    onDataServiceChange(changes) {
      if (typeof changes !== 'object') return;
      const dataService = {
        ...this.dataService,
        checked: changes.checked,
        parameters: [...changes.apns],
      };
      this.autoDataServiceChange(dataService);
      this.setupDependencies(dataService);
    },
    onApnChange(apns) {
      this.dataService = { ...this.dataService, parameters: [...apns] };
    },
  },
  data() {
    return {
      otherServices: undefined,
      dataService: undefined,
      defaultDataService: undefined,
      extendedRoamingValue: undefined,
      roamingService: undefined,
      canChangeRoamingExtended: false,
      defaultServices: undefined,
      listServiceMandatory: undefined,
      listServiceIncompatible: undefined,
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
      this.displayServices(false);
    },
    offer() {
      this.setupOffer();
      this.displayServices();
    },
  },
  mounted() {
    this.setup();
    this.setupOffer();
    this.displayServices();
  },
};
</script>

<style lang="scss" scoped>
.displayFlex {
  display: flex;
  justify-content: space-between;
}
.s-container {
  width: 50%;
}

.service {
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
