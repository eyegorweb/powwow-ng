<template>
  <div class="container bg-white clearfix pb-3 partners-search">
    <SearchInput
      :items="partners"
      :fields="['label']"
      @clear="removeSelection()"
    >
      <template slot="beforeInput">
        <div v-if="!allSelectionsVisible">
          <div
            v-for="selected in cutSelectedPartners"
            class="selection ml-2 my-2 text-white bg-secondary py-1 rounded"
            :key="selected.id"
          >
            {{ selected.label }}
            <img
              class="remove-item close-icon"
              style="font-size: 24px"
              src="@/assets/close-white.svg"
              @click="removeSelection(selected)"
            >
          </div>
          <button
            class="display-selections text-secondary underlined shadow-none bg-transparent p-0 mx-2 border-0"
            v-if="maximumPartnersReached"
            @click="allSelectionsVisible = true"
          >{{ `+${selectedPartners.length - maximumSelectablePartners}` }}</button>
        </div>

        <div v-else>
          <div
            v-for="selected in selectedPartners"
            class="selection ml-2 my-2 text-white bg-secondary py-1 rounded"
            :key="selected.id"
          >
            {{ selected.label }}
            <img
              class="remove-item close-icon"
              style="font-size: 24px"
              src="@/assets/close-white.svg"
              @click="removeSelection(selected)"
            >
          </div>
        </div>
      </template>
      <div
        class="checkboxes"
        slot-scope="{ results }"
      >
        <UiCheckbox
          :value="results.map(r => r.item)"
          :checked="multiSelectValues(results.map(r => r.item))"
          @change="addAllToSelectedPartners($event, results.map(r => r.item)), updateTextLabel($event, results.map(r => r.item))"
          class="text-secondary"
        >{{ labelText }} ({{ results.length }})</UiCheckbox>
        <UiCheckbox
          v-for="result in results"
          v-model="selectedPartners"
          :value="result.item"
          :key="result.item.id"
          @change="updateTextLabel($event, results.map(r => r.item))"
        >
          <span v-html="result.highlighted.label" />
        </UiCheckbox>
      </div>
    </SearchInput>
    <UiButton
      class="float-right px-5"
      variant="primary"
    >Appliquer</UiButton>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput';
import UiCheckbox from '@/components/ui/Checkbox';
import UiButton from '@/components/ui/Button';
import unionBy from 'lodash.unionby';
import differenceBy from 'lodash.differenceby';

export default {
  data() {
    return {
      labelText: 'Tout sélectionner',
      maximumSelectablePartners: 2,
      maximumPartnersReached: false,
      allSelectionsVisible: false,
      selectedPartners: [],
      partners: [
        {
          label: 'erdf linky prod',
          id: 0,
        },
        {
          label: 'erdf grdf usl-ouest',
          id: 1,
        },
        {
          label: 'erdf linky services',
          id: 2,
        },
        {
          label: 'GEOLOC SYSTEMS',
          id: 3,
        },
        {
          label: 'GEOMOBILE',
          id: 4,
        },
        {
          label: 'GEOTRACTEUR SARL',
          id: 5,
        },
      ],
    };
  },

  watch: {
    selectedPartners: function(val) {
      // TODO: gerer le cas ou on fait une recherche texte
      this.maximumPartnersReached = val.length > this.maximumSelectablePartners ? true : false;
    },

    maximumPartnersReached: function(val) {
      if (val && this.allSelectionsVisible) {
        this.allSelectionsVisible = true;
      }
    },
  },

  methods: {
    addAllToSelectedPartners(partners, displayedPartners) {
      if (!partners.length)
        this.selectedPartners = differenceBy(this.selectedPartners, displayedPartners, 'id');
      else this.selectedPartners = unionBy(this.selectedPartners, partners, 'id');
    },
    // supprime toutes les selections courantes au clic sur l'icone, sinon supprime la selection cliquée
    removeSelection(currentSelection) {
      const updatedSelections = !currentSelection
        ? []
        : this.selectedPartners.filter(selection => selection != currentSelection);
      this.selectedPartners = updatedSelections;
      this.updateTextLabel(this.selectedPartners);
    },
    updateTextLabel(results, displayedPartners) {
      function isMatching(displayedValues) {
        const selectedPartners = results;
        if (displayedValues) {
          return displayedValues.every(function(v) {
            return selectedPartners.includes(v);
          });
        }
      }
      this.labelText = isMatching(displayedPartners) ? 'Tout désélectionner' : 'Tout sélectionner';
    },
  },

  computed: {
    multiSelectValues() {
      const selectedPartners = this.selectedPartners;
      return displayedValues => displayedValues.filter(v => selectedPartners.includes(v));
    },
    cutSelectedPartners() {
      // renvoit les N premiers partenaires sélectionnés
      return this.selectedPartners.slice(0, this.maximumSelectablePartners);
    },
  },

  components: {
    SearchInput,
    UiCheckbox,
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
.selection {
  position: relative;
  text-transform: uppercase;
  padding-left: 1rem;
  padding-right: 2rem;
  max-height: 2rem;
  flex: 0 1 auto;
  display: inline-flex;

  .remove-item {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      cursor: pointer;
    }
  }
}

.display-selections {
  appearance: none;
  text-decoration: underline;
  border: 0;

  &:hover {
    cursor: pointer;
  }
}

.partners-search /deep/ .search-input {
  & > label {
    border-bottom: 1px solid $medium-gray;
    align-items: center;
    display: flex;
    flex-flow: wrap;
    padding-left: 2rem;
    width: 100%;
    & > input {
      padding-left: 0.8rem;
      border: 0;
      flex: 1 1;
      min-width: 140px;
      max-width: 100%;
      width: 100%;
    }
  }
}
</style>
