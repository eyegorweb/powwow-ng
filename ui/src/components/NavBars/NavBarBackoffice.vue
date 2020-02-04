<template>
  <nav class="navbar navbar-expand-lg">
    <div class="logoPart">
      <router-link to="/">
        <img class="logo" src="@/assets/logo_bouygues.png" alt />
      </router-link>
    </div>
    <div class="contentPart">
      <div class="d-flex">
        <div class="partnerTypeSelect">
          <UiSelect
            v-model="partnerType"
            @input="canCancel = true"
            :placeholder="$t('partnerType')"
            :options="partnersTypesOptions"
          />
        </div>
        <div class="partnerSelect">
          <PartnersFilter
            class="flex-fill"
            :values="partners"
            :placeholder="$t('choosePartner')"
            :partner-type="partnerType"
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
            >{{ $t('set') }}</UiButton
          >
          <UiButton
            v-if="canCancel"
            slot="trigger"
            variant="danger"
            class="flex-grow-1 py-1 px-3 ml-1"
            @click="revertSelection"
            >{{ $t('cancel') }}</UiButton
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import UiButton from '@/components/ui/Button';
import UiSelect from '@/components/ui/UiSelect';

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'NavBarBackoffice',
  components: {
    PartnersFilter,
    UiButton,
    UiSelect,
  },
  data() {
    return {
      canCancel: false,
      partnersTypesOptions: [
        {
          label: '',
          value: '',
        },
        {
          label: 'M2M',
          value: 'CUSTOMER',
        },
        {
          label: 'MVNO',
          value: 'MVNO',
        },
        {
          label: 'MARQUE BLANCHE',
          value: 'MULTI_CUSTOMER',
        },
      ],
      partners: [],
      partnerType: undefined,
    };
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
  },

  methods: {
    ...mapMutations('userContext', ['setPartnerType', 'setPartners']),

    setLocalPartners(values) {
      this.canCancel = true;
      this.partners = values;
    },

    savePartnerContext() {
      this.setPartnerType(this.partnerType);
      this.setPartners(this.partners);
      this.canCancel = false;
    },

    revertSelection() {
      this.partnerType = this.contextPartnersType;
      this.partners = this.contextPartners;
      this.canCancel = false;
    },
  },

  watch: {
    partnerType() {
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
