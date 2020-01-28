<template>
  <div class="mb-3">
    <SectionTitle :num="num">
      Choisir la portée de l'alarme
    </SectionTitle>

    <div class="scope-container" :style="{ maxHeight: maxHeight }">
      <div class="scope-selection">
        <UiSelect v-model="selectedType" :options="types" block />
      </div>
      <SearchLineByIdChoice v-if="selectedType === 'line'" @change="filterForCreation = $event" />
      <OfferChoice
        :key="'offer_' + (partner ? partner.id : '')"
        v-if="selectedType === 'offer'"
        :partner="partner"
        @change="filterForCreation = $event"
      />
      <OfferBillingAccountChoice
        :key="'offercf_' + (partner ? partner.id : '')"
        v-if="selectedType === 'offercf'"
        :partner="partner"
        @change="filterForCreation = $event"
      />
      <FileImportChoice
        v-if="selectedType === 'fileimport'"
        :partner="partner"
        @change="filterForCreation = $event"
      />
    </div>
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

import SearchLineByIdChoice from './SearchLineByIdChoice';
import OfferChoice from './OfferChoice';
import OfferBillingAccountChoice from './OfferBillingAccountChoice.vue';
import FileImportChoice from './FileImportChoice.vue';
import SectionTitle from '../SectionTitle.vue';

import get from 'lodash.get';

export default {
  components: {
    UiSelect,
    SearchLineByIdChoice,
    OfferChoice,
    OfferBillingAccountChoice,
    FileImportChoice,
    SectionTitle,
  },
  props: {
    num: Number,
    partner: Object,
  },
  computed: {
    maxHeight() {
      if (this.selectedType === 'fileimport') {
        if (!get(this.filterForCreation, 'searchByFile')) {
          return '15rem';
        }
        return '23rem';
      }
      if (this.selectedType === 'offer') {
        if (!get(this.filterForCreation, 'offer')) {
          return '14rem';
        }
        return '23rem';
      }

      // max-height: 9rem;

      return '9rem';
    },
  },
  watch: {
    selectedType() {
      this.filterForCreation = undefined;
    },
  },
  data() {
    return {
      selectedType: 'partner',
      types: [
        {
          label: 'Partenaire',
          value: 'partner',
        },
        {
          label: 'Ligne',
          value: 'line',
        },
        {
          label: 'Offre',
          value: 'offer',
        },
        {
          label: 'Offre / CF',
          value: 'offercf',
        },
        {
          label: 'Import',
          value: 'fileimport',
        },
      ],

      filterForCreation: undefined,
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

.scope-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  max-height: 23rem;

  .scope-selection {
    width: 50%;
    padding-right: 1rem;
  }
}
</style>
