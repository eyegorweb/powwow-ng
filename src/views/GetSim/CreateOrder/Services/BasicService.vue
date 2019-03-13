<template>
  <UiToggle :label="$t('services.' + name)" :editable="isEditable" :checked="isChecked" />
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';

export default {
  props: {
    offer: {
      type: Object,
    },
    name: String,
    dependencyCode: String,
  },
  created() {},
  computed: {
    isEditable() {
      return this.serviceData ? this.serviceData.partyAccess : false;
    },
    isChecked() {
      return this.serviceData ? this.serviceData.activatedByDefault : false;
    },

    /**
     * Il faut scanner tout les éléments de nonSystemServiceGroupList > standardAndSemiGlobalCatalogServiceGroups > catalogService pour extraire les données du service
     */
    serviceData() {
      return this.offer.initialOffer.nonSystemServiceGroupList
        .map(g => g.standardAndSemiGlobalCatalogServiceGroups)
        .flat()
        .find(s => s.catalogService.code === this.dependencyCode);
    },
  },

  components: {
    UiToggle,
  },
};
</script>

<style scoped></style>
