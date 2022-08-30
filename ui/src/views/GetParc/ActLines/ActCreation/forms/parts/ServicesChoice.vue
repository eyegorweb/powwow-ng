<template>
  <div class="flex">
    <MultiSelectServices
      :items="offerServices"
      :default-selected-items.sync="selectedServices"
      :selected-color="selectedColor"
      :disabled-items="itemsToDisable"
    />
  </div>
</template>

<script>
// import get from 'lodash.get';
import MultiSelectServices from './MultiSelectServices';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { mapMutations } from 'vuex';

export default {
  props: {
    offer: Object,
    selectedItems: Array,
    selectedColor: {
      type: String,
      required: false,
    },
    itemsToDisable: {
      type: Array,
      default: () => [],
    },
    activated: Boolean,
  },
  components: {
    MultiSelectServices,
  },

  mounted() {
    this.initServices();
  },

  data() {
    return {
      disabledServices: [],
      offerServices: [],
      allOfferServices: [],
    };
  },

  methods: {
    ...mapMutations(['popupMessage']),

    initServices() {
      this.allOfferServices = getMarketingOfferServices(this.offer.initialOffer);
      const multiselectFormat = (s) => {
        return {
          ...s,
          id: s.code,
          label: s.labelService,
        };
      };
      const filteredOfferServices = this.allOfferServices
        .filter((s) => s.code !== 'DATA')
        .map(multiselectFormat);
      this.allOfferServices = this.allOfferServices.map(multiselectFormat);
      const disabledServices = filteredOfferServices.filter((s) => !s.editable);
      const allDisabledServices = [...disabledServices, ...this.itemsToDisable];

      this.offerServices = filteredOfferServices.filter(
        (s) => !allDisabledServices.find((d) => d.code === s.code)
      );
    },
    handleError(errors, offerMissingService) {
      let key;
      if (offerMissingService) {
        key = 'getadmin.partners.optionsDetails.services.offerMissingServiceToActivateX';
      } else {
        key = 'getadmin.partners.optionsDetails.services.yMustBeActiveToActivateX';
      }
      // console.log('handleError errors', errors);
      let message = '';
      errors.forEach((error) => {
        message += this.$t(key, {
          serviceX: error.serviceLabel,
          serviceY: error.serviceMandatoryLabel,
        });
        message += '<br />'; // new line
      });
      // console.log('handleError message', message);
      this.popupMessage(message);

      return false;
    },
    handleMandatoryServices(service) {
      var canChange = true;
      // Traitement des services obligatoires
      if (service.listServiceMandatory) {
        var addedServices = [];
        var servicesToManage = [];
        let sourceServiceList = this.activated ? this.offerServices : this.selectedServices;
        // on parcourt les services obligatoires
        for (var i = 0; i < service.listServiceMandatory.length; i++) {
          let lsmOrTab = service.listServiceMandatory[i];
          // console.log(
          //   'handleMandatoryServices service.listServiceMandatory',
          //   service.listServiceMandatory
          // );

          if (canChange) {
            let errors = [];
            let isOk = false;
            let offerMissingService = true;
            let orServicesCode = [];
            for (var j = 0; j < lsmOrTab.length; j++) {
              let lsm = lsmOrTab[j];
              if ('DATA' !== lsm) {
                orServicesCode.push(lsm);
              }
              // console.log('handleMandatoryServices lsm', lsm);
              let deletedMandatoryService = undefined;
              let foundMandatoryService = sourceServiceList.find((serv) => serv.code === lsm);
              // on ne prend que les services maîtres concernés

              if (foundMandatoryService) {
                // gestion erreur activation du service obligatoire impossible
                offerMissingService = false;
                if (this.activated) {
                  if (!foundMandatoryService.editable && !foundMandatoryService.checked) {
                    errors.push({
                      serviceLabel: service.label,
                      serviceMandatoryLabel: foundMandatoryService.label,
                    });
                  }
                  deletedMandatoryService = this.selectedServicesToDisable.find(
                    (sd) => sd.code === foundMandatoryService.code
                  );
                  if (!deletedMandatoryService) {
                    isOk = true;
                  }
                }

                // activer (checked: true) ces services
                const serviceFound = this.selectedServices.find(
                  (serv) => serv.code === foundMandatoryService.code
                );

                if (this.activated && !deletedMandatoryService) {
                  if (!serviceFound) {
                    addedServices.push(foundMandatoryService);
                  } else {
                    servicesToManage.push(foundMandatoryService);
                  }
                } else {
                  if (serviceFound) {
                    const index = this.selectedServices.indexOf(serviceFound);
                    foundMandatoryService.managed = false;
                    foundMandatoryService.addedToDisable = false;
                    this.selectedServices.splice(index, 1);
                  }
                }
                if (isOk) {
                  break;
                }
              }
            }
            if (this.activated && orServicesCode.length > 0 && offerMissingService) {
              orServicesCode.forEach((c) => {
                errors.push({
                  serviceLabel: service.label,
                  serviceMandatoryLabel: c,
                });
              });
            }
            if (!isOk && errors.length > 0) {
              canChange = this.handleError(errors, offerMissingService);
            }
          }
        }

        return { canChange, addedServices, servicesToManage };
      }
    },
    handleDependantServices(service) {
      // Cas d'une désactivation de service
      // Recherche des services dépendant
      let sourceServiceList = this.activated ? this.selectedServices : this.offerServices;
      // console.log('handleDependantServices sourceServiceList', sourceServiceList);
      const foundDependantServices = sourceServiceList.filter(
        (s) =>
          s.listServiceMandatory &&
          s.listServiceMandatory.find((ss) => {
            let result;
            if (this.activated) {
              result = this.findDependantService(ss, service.code);
            } else {
              result = this.findMandatoryServiceForDeletedAddedAction(ss, false, service.code);
            }
            return result;
          })
      );
      if (foundDependantServices) {
        // Pour chaque service dépendant trouvé, on le recherche dans les selected
        foundDependantServices.forEach((s) => {
          const serviceFound = this.selectedServices.find((serv) => serv.code === s.code);

          if (this.activated && serviceFound) {
            const index = this.selectedServices.indexOf(serviceFound);
            this.selectedServices.splice(index, 1);
          } else if (!this.activated && !serviceFound) {
            s.managed = false;
            s.addedToDisable = true;
            this.selectedServices.push(s);
          }
        });
      }

      if (this.activated) {
        // Recherche des services obligatoires pour les rendre editables
        const foundMandatoryServices = this.selectedServices.filter((s) => {
          if (service.listServiceMandatory) {
            // console.log('handleDependantServices start service ', s.code);
            return service.listServiceMandatory.find((ms) => this.findDependantService(ms, s.code));
          }
          return false;
        });
        if (foundMandatoryServices) {
          let foundAnotherDependantServices = undefined;
          foundMandatoryServices.forEach((s) => {
            foundAnotherDependantServices = this.selectedServices.filter((ss) => {
              if (ss.listServiceMandatory && s.code !== ss.code) {
                let result = ss.listServiceMandatory.find((ssmCode) =>
                  this.findDependantService(ssmCode, s.code)
                );
                return result;
              }
              return false;
            });

            if (!foundAnotherDependantServices || foundAnotherDependantServices.length === 0) {
              s.managed = false;
            }
            foundAnotherDependantServices = undefined;
          });
        }
      }
    },
    handleIncompatibleServicesForAddedAction(service) {
      var canChange = true;

      var addedServices = [];
      var servicesToManage = [];
      service.listServiceIncompatible.forEach((lsi) => {
        if (canChange) {
          let foundIncompatibleService = this.offerServices.find((serv) => serv.code === lsi);
          // pour chaque service incompatible
          if (foundIncompatibleService) {
            // gestion erreur désactivation du service incompatible impossible
            if (!foundIncompatibleService.editable && foundIncompatibleService.checked) {
              canChange = this.handleError({
                serviceLabel: service.label,
                serviceMandatoryLabel: foundIncompatibleService.label,
              });
            }
            // lorsque ce service est modifiable (editable: true)
            // désactiver (checked: false) ces services
            const found = this.selectedServicesToDisable.find(
              (serv) => serv.code === foundIncompatibleService.code
            );
            if (!found) {
              // foundIncompatibleService.managed = true;
              // this.selectedServicesToDisable.push(foundIncompatibleService);
              addedServices.push(foundIncompatibleService);
            } else {
              // found.managed = true;
              servicesToManage.push(found);
            }
            // Le service DATA est isolé des autres services
            // Il faut vérifier s'il fait partie des services incompatibles pour autant
          }
        }
      });
      return { canChange, addedServices, servicesToManage };
    },
    handleIncompatibleServicesForDeletedAction(service) {
      service.listServiceIncompatible.forEach((lsi) => {
        let foundIncompatibleService = this.offerServices.find((serv) => serv.code === lsi);
        // pour chaque service incompatible
        if (foundIncompatibleService) {
          // gestion erreur désactivation du service incompatible impossible
          // if (!foundIncompatibleService.editable && foundIncompatibleService.checked) {
          //   this.handleError(foundIncompatibleService.code);
          //   return;
          // }

          let foundAnother = false;
          this.selectedServices.forEach((ss) => {
            let anotherIncompatibleService = undefined;
            if (ss.listServiceIncompatible) {
              anotherIncompatibleService = ss.listServiceIncompatible.find((code) => {
                return foundIncompatibleService.code === code && service.code !== code;
              });
            }
            if (anotherIncompatibleService) {
              foundAnother = true;
            }
          });

          if (!foundAnother) {
            let foundSelectedServiceToDisable = this.selectedServicesToDisable.find(
              (serv) => serv.code === foundIncompatibleService.code
            );
            const index = this.selectedServicesToDisable.indexOf(foundSelectedServiceToDisable);
            if (!foundSelectedServiceToDisable.addedToDisable) {
              this.selectedServicesToDisable.splice(index, 1);
            }
            foundSelectedServiceToDisable.managed = false;
          }

          // Le service DATA est isolé des autres services
          // Il faut vérifier s'il fait partie des services incompatibles pour autant
        }
      });
    },
    findOr(orCodeList, code) {
      for (var i = 0; i < orCodeList.length; i++) {
        let aCode = orCodeList[i];
        if (aCode === code) {
          return true;
        }
      }
      return false;
    },

    findDependantService(elem, serviceCodeDesactivated) {
      let foundAnotherMandatoryService = false,
        foundMandatoryService = false;

      console.log(
        'handleDependantServices elem:' +
          elem +
          ', serviceCodeDesactivated: ' +
          serviceCodeDesactivated
      );
      if (elem) {
        let sourceServicesList = this.activated
          ? this.selectedServices
          : this.selectedServicesToDisable;
        elem.forEach((subElem) => {
          if (subElem.length > 1) {
            console.log('handleDependantServices elem.length=', subElem.length);
            // // Gestion niveau 1 'OU'
            if (subElem !== serviceCodeDesactivated) {
              if (!foundAnotherMandatoryService) {
                foundAnotherMandatoryService = !!sourceServicesList.find((s) => s.code === subElem);
              }
            } else {
              foundMandatoryService = true;
            }
          } else {
            // Gestion niveau 1 'ET'
            foundMandatoryService = elem[0].code === serviceCodeDesactivated;
          }
        });
        console.log(
          'findDependantService  return foundMandatoryService && !foundAnotherMandatoryService',
          foundMandatoryService,
          foundAnotherMandatoryService
        );
        return foundMandatoryService && !foundAnotherMandatoryService;
      }
      return foundMandatoryService;
    },
    findMandatoryServiceForDeletedAddedAction(elem, desactivateControl, serviceCodeDesactivated) {
      let foundMandatoryService = undefined;
      if (elem) {
        if (Array.isArray(elem) && elem.includes(serviceCodeDesactivated)) {
          // Gestion des services en mode "OU"
          foundMandatoryService = this.findMandatoryServiceForDeletedAddedAction(
            serviceCodeDesactivated,
            desactivateControl
          );
          elem.find((sc) => {
            if (sc !== serviceCodeDesactivated) {
              let foundOrMandatoryService = this.findMandatoryServiceForDeletedAddedAction(
                sc,
                desactivateControl,
                serviceCodeDesactivated
              );
              if (foundOrMandatoryService) {
                let foundDeletedMandatoryService = this.selectedServices.find(
                  (s) => s.code === foundOrMandatoryService.code
                );
                if (!foundDeletedMandatoryService) {
                  foundMandatoryService = undefined;
                  return true;
                }
              }
            }
          });
        } else {
          // Gestion d'un code de service
          foundMandatoryService = this.offerServices.find(
            (service) => service.code === elem // && (desactivateControl || service.checked || service.editable)
          );
          console.log(
            'findDependantService  Gestion code de service for code elem: ' +
              elem +
              ', code to deactivate:' +
              serviceCodeDesactivated +
              ', foundMandatoryService ',
            foundMandatoryService
          );
        }
      }
      return foundMandatoryService;
    },
    updateServicesForActivatedAddedAction(handleMandatoryServices, handleIncompatibleServices) {
      handleMandatoryServices.servicesToManage.forEach((s) => (s.managed = true));
      handleMandatoryServices.addedServices.forEach((s) => {
        s.managed = true;
        this.selectedServices.push(s);
      });

      handleIncompatibleServices.servicesToManage.forEach((s) => (s.managed = true));
      handleIncompatibleServices.addedServices.forEach((s) => {
        s.managed = true;
        this.selectedServicesToDisable.push(s);
      });
    },
  },

  watch: {
    offer() {
      this.initServices();
    },
    selectedItems(newList, oldList) {
      if (newList && oldList) {
        if (this.activated) {
          if (newList.length > oldList.length) {
            newList.forEach((service) => {
              if (!oldList.includes(service)) {
                let handleMandatoryServices = this.handleMandatoryServices(service);
                let handleIncompatibleServices = {};
                if (handleMandatoryServices.canChange) {
                  handleIncompatibleServices = this.handleIncompatibleServicesForAddedAction(
                    service
                  );
                }
                if (handleMandatoryServices.canChange && handleIncompatibleServices.canChange) {
                  this.updateServicesForActivatedAddedAction(
                    handleMandatoryServices,
                    handleIncompatibleServices
                  );
                } else {
                  const index = newList.indexOf(service);
                  if (index !== -1) {
                    newList.splice(index, 1);
                  }
                }
              }
            });
          } else {
            oldList.forEach((service) => {
              if (!newList.includes(service)) {
                this.handleDependantServices(service);
                this.handleIncompatibleServicesForDeletedAction(service);
              }
            });
          }
        } else {
          if (newList.length > oldList.length) {
            newList.forEach((service) => {
              if (!oldList.includes(service)) {
                service.addedToDisable = true;
                service.managed = false;
                this.handleDependantServices(service);
              }
            });
          } else {
            oldList.forEach((service) => {
              if (!newList.includes(service)) {
                service.addedToDisable = false;
                service.managed = false;
                this.handleMandatoryServices(service);
              }
            });
          }
        }
      }
    },
  },

  computed: {
    selectedServices: {
      get() {
        return this.selectedItems;
      },
      set(newValues) {
        this.$emit('update:selectedItems', newValues);
      },
    },
    selectedServicesToDisable: {
      get() {
        return this.itemsToDisable;
      },
      // set(newValues) {
      //   this.$emit('update:itemsToDisable', newValues);
      // },
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>
