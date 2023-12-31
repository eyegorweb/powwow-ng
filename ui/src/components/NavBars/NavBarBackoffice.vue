<template>
  <nav class="navbar navbar-expand-lg">
    <div class="logoPart">
      <router-link to="/">
        <img class="logo logoSvg" src="@/assets/logo_objenious.svg" alt="logo" />
      </router-link>
    </div>
    <div class="contentPart">
      <div class="d-flex">
        <div class="partnerTypeSelect">
          <PartnerTypeCombo v-model="partnerType" />
        </div>
        <div class="partnerSelect">
          <PartnersFilter
            class="flex-fill"
            :values="partners"
            :placeholder="$t('choosePartner')"
            :partner-type="partnerTypeValue"
            @updatePartners="setLocalPartners"
            collapsed
            ignore-user-context
          />
        </div>
        <div>
          <UiButton
            slot="trigger"
            variant="primary"
            class="context-bar-apply flex-grow-1 py-1 px-3"
            @click="savePartnerContext"
            >{{ $t('set') }}</UiButton
          >
          <UiButton
            v-if="canCancel"
            slot="trigger"
            variant="danger"
            class="context-bar-reinit flex-grow-1 py-1 px-3 ml-1"
            @click="revertSelection"
            >{{ $t('reset') }}</UiButton
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import UiButton from '@/components/ui/Button';
import PartnerTypeCombo from '@/components/CustomComboxes/PartnerTypeCombo.vue';

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'NavBarBackoffice',
  components: {
    PartnersFilter,
    UiButton,
    PartnerTypeCombo,
  },
  data() {
    return {
      partners: [],
      partnerType: undefined,
    };
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    canCancel() {
      return !!this.contextPartnersType || !!(this.contextPartners && this.contextPartners.length);
    },

    partnerTypeValue() {
      return this.partnerType ? this.partnerType.value : undefined;
    },
  },

  methods: {
    ...mapMutations('userContext', ['setPartnerType', 'setPartners']),

    setLocalPartners(values) {
      this.partners = values;
    },

    savePartnerContext() {
      this.setPartnerType(this.partnerTypeValue);
      this.setPartners(this.partners);
    },

    revertSelection() {
      location.reload();
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

.logoSvg {
  width: 100px;
  height: 60px;
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
