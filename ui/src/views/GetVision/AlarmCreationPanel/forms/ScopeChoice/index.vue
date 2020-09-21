<template>
  <div class="mb-4">
    <SectionTitle v-if="!skipScopeCheck" :num="num">Choisir la portée de l'alarme</SectionTitle>

    <div class="scope-container" :style="{ maxHeight: maxHeight }">
      <slot>
        <div class="scope-selection">
          <UiSelect v-model="selectedType" :options="types" block />
        </div>
        <SearchLineByIdChoice
          v-if="selectedType === 'LINE'"
          @change="filterForCreation = $event"
          :partner="partner"
        />
        <OfferChoice
          :key="'offer_' + (partner ? partner.id : '')"
          v-if="selectedType === 'OFFER'"
          :partner="partner"
          @change="filterForCreation = $event"
        />

        <FileImportChoice
          v-if="selectedType === 'fileimport'"
          :partner="partner"
          @change="filterForCreation = $event"
        />

        <PartnerChoice
          v-if="selectedType === 'PARTY'"
          :partner="partner"
          @change="filterForCreation = $event"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

import SearchLineByIdChoice from './SearchLineByIdChoice';
import OfferChoice from './OfferChoice';
import FileImportChoice from './FileImportChoice.vue';
import PartnerChoice from './PartnerChoice.vue';
import SectionTitle from '@/components/SectionTitle.vue';

import get from 'lodash.get';

export default {
  components: {
    UiSelect,
    SearchLineByIdChoice,
    OfferChoice,
    FileImportChoice,
    SectionTitle,
    PartnerChoice,
  },
  props: {
    num: Number,
    partner: Object,
    skipScopeCheck: Boolean,
    containerHeight: {
      type: String,
      required: false,
    },
  },

  computed: {
    maxHeight() {
      if (this.containerHeight) return this.containerHeight;

      if (this.selectedType === 'fileimport') {
        if (!get(this.filterForCreation, 'searchByFile')) {
          return '15rem';
        }
        return '23rem';
      }
      if (this.selectedType === 'OFFER') {
        if (!get(this.filterForCreation, 'offer')) {
          return '14rem';
        }
        return '23rem';
      }

      if (this.selectedType === 'PARTY') {
        if (
          this.filterForCreation &&
          this.filterForCreation.partner &&
          this.filterForCreation.partner.id
        ) {
          return '4rem';
        }
        return '3rem';
      }

      // max-height: 9rem;

      return '9rem';
    },
  },
  watch: {
    selectedType() {
      this.filterForCreation = undefined;
    },
    filterForCreation() {
      this.$emit('scope', this.filterForCreation);
    },
  },
  data() {
    return {
      selectedType: 'PARTY',
      types: [
        {
          label: 'Partenaire',
          value: 'PARTY',
        },
        {
          label: 'Ligne',
          value: 'LINE',
        },
        {
          label: 'Offre',
          value: 'OFFER',
        },
        /*
        {
          label: 'Offre / CF',
          value: 'offercf',
        },
        //*/
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
