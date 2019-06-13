<template>
  <nav class="navbar navbar-expand-lg">
    <div class="logoPart">
      <img class="logo" src="@/assets/logo_bouygues.png" alt />
    </div>
    <div class="contentPart">
      <div class="d-flex">
        <div class="partnerTypeSelect">
          <MultiSelectSearch
            :placeholder="$t('partnerType')"
            :items="formattedPartnersTypeOptions"
            :default-selected-items="partnerTypes"
            @update:defaultSelectedItems="setLocalPartnerTypes"
            collapsed
          />
        </div>
        <div class="partnerSelect">
          <PartnersFilter
            class="flex-fill"
            :values="partners"
            :placeholder="$t('choosePartner')"
            :partner-types-in="partnerTypes"
            @updatePartners="setLocalPartners"
            collapsed
            ignore-user-context
          />
        </div>
        <div>
          <UiButton
            slot="trigger"
            variant="primary"
            class="flex-grow-1 py-1 px-3"
            @click="savePartnerContext"
          >
            {{ $t('set') }}
          </UiButton>
          <UiButton
            slot="trigger"
            variant="danger"
            class="flex-grow-1 py-1 px-3 ml-1"
            @click="revertSelection"
          >
            {{ $t('cancel') }}
          </UiButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import UiButton from '@/components/ui/Button';
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';

import { mapMutations, mapState } from 'vuex';

import { fetchPartyTypes } from '@/api/partners';

export default {
  name: 'NavBarBackoffice',
  components: {
    MultiSelectSearch,
    PartnersFilter,
    UiButton,
  },
  data() {
    return {
      partnersTypesOptions: [],

      // selected values
      partnerTypes: [],
      partners: [],
    };
  },

  async mounted() {
    this.partnersTypesOptions = await fetchPartyTypes();
  },

  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    formattedPartnersTypeOptions() {
      return this.partnersTypesOptions.map(a => ({ id: a, label: this.$t('partnerTypes.' + a) }));
    },
  },

  methods: {
    ...mapMutations('userContext', ['setPartnerTypes', 'setPartners']),
    setLocalPartnerTypes(values) {
      this.partnerTypes = values;
    },
    setLocalPartners(values) {
      this.partners = values;
    },

    savePartnerContext() {
      this.setPartnerTypes(this.partnerTypes);
      this.setPartners(this.partners);
    },

    revertSelection() {
      this.partnerTypes = this.contextPartnersTypes;
      this.partners = this.contextPartners;
    },
  },

  watch: {
    partnerTypes() {
      // Ré initialiser la séléction des partnenaires quand le type de partenaire est modifié
      this.setLocalPartners([]);
    },
  },
};
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: $white;
  padding: 10px 15px;
  border-bottom: 1px solid $light-gray;
}

.logo {
  width: auto;
  height: auto;
  margin-right: 15px;
  max-width: 80px;
}

.form-group {
  margin-bottom: 0;
  padding: 0;
}

.logoPart {
  flex-grow: 1;
}

.contentPart {
  flex-grow: 50;
}

.partnerTypeSelect {
  flex-grow: 1;
  display: flex;
  .select-container {
    flex-grow: 0.8;
  }
}

.partnerSelect {
  flex-grow: 4;
}
</style>
