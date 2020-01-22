<template>
  <div>
    <h5 class="text-primary text-uppercase">
      <span class="badge badge-pill badge-primary">1</span>
      <span class="title">Choisir la portée de l'alarme</span>
    </h5>

    <div class="row mt-4">
      <div class="col">
        <div>
          <h6>{{ $t('getparc.history.col.partyId') }}</h6>
          <PartnerCombo :value.sync="selectedPartner" />
        </div>

        <UiSelect v-model="selectedType" :options="types" block />

        <div class="mt-3">
          <SearchLineById v-if="selectedType === 'line'" />
        </div>
      </div>
      <div class="col">
        <div class="alert alert-primary" role="alert">
          <h5>1 lignes trouvées</h5>
          <p>Cette alarme a une portée limitée à la ligne sélectionnée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

import SearchLineById from './SearchLineById';

export default {
  components: {
    UiSelect,
    SearchLineById,
    PartnerCombo,
  },
  data() {
    return {
      selectedPartner: undefined,
      selectedType: 'line',
      types: [
        {
          label: 'Ligne',
          value: 'line',
        },
        {
          label: 'Offer',
          value: 'offer',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-weight: 700;

  .title {
    position: relative;
    top: 3px;
    padding-left: 5px;
  }
}
.alert {
  background: #ecf6fb;
  border-color: #ecf6fb;

  p {
    color: #0b5ca8;
  }
  h5 {
    color: #0b5ca8;
  }
}
</style>
