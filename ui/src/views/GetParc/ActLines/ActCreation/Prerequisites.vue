<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body prereq-toggles">
          <template v-if="canHaveSearchByIdPrereq">
            <Toggle
              v-if="toggleValues && !currentToggle"
              @update="onToggleChange($event)"
              :values="toggleValues"
              class="pl-2"
              center
              no-default
            />

            <div v-if="toggleValues">
              <MassActionsPrerequisites
                v-if="currentToggle === 'mass' || currentToggle === 'byImport'"
                :act="act"
              />
              <SearchById v-if="currentToggle === 'byId'" :act="act" />
            </div>

            <div v-if="currentToggle" class="d-flex justify-content-end">
              <UiButton variant="link" @click="currentToggle = undefined">
                {{ $t('cancel') }}
              </UiButton>
            </div>
          </template>
          <template v-else>
            <MassActionsPrerequisites :act="act" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//

import MassActionsPrerequisites from './MassActionsPrerequisites.vue';
import SearchById from './prerequisites/SearchById.vue';
import Toggle from '@/components/ui/UiToggle2';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    MassActionsPrerequisites,
    Toggle,
    UiButton,
    SearchById,
  },
  props: {
    act: Object,
  },
  data() {
    return {
      currentToggle: undefined,
      selectedFile: undefined,
      toggleValues: undefined,
    };
  },
  computed: {
    canHaveSearchByIdPrereq() {
      const ignoredActs = [
        'getparc.actCreation.carouselItem.CHANGE_SERVICES',
        'getparc.actCreation.carouselItem.CHANGE_MSISDN',
        'getparc.actCreation.carouselItem.CHANGE_SIMCARD',
        'getparc.actCreation.carouselItem.CHANGE_OFFER',
      ];
      return !ignoredActs.find(a => a === this.act.title);
    },
  },

  methods: {
    onToggleChange(newToggleValue) {
      this.currentToggle = newToggleValue.id;
      this.$emit('toggle', this.currentToggle);
    },
  },
  mounted() {
    this.toggleValues = [
      {
        id: 'mass',
        label: 'getparc.actCreation.mass',
        // default: this.starting === 'graph',
      },
      {
        id: 'byId',
        label: 'getparc.actCreation.byId',
      },
    ];
    if (this.act.id === 'CUSTOM_FIELDS') {
      this.toggleValues = [
        ...this.toggleValues,
        {
          id: 'byImport',
          label: 'getparc.actCreation.byImport',
        },
      ];
    }
  },
};
</script>

<style lang="scss" scoped></style>
