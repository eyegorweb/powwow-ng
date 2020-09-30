<template>
  <UiApiAutocomplete
    :placeholder="$t('common.billingAccount')"
    :items="localItems"
    v-model="selectedValue"
    :disabled="disabled"
    display-results-while-empty
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchBillingAccounts } from '@/api/billingAccounts.js';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    value: Object,
    partners: Array,
    disabled: Boolean,
    preselectFirst: Boolean,
  },
  data() {
    return {
      localItems: undefined,
      isRefreshing: false,
      partnershaveChanged: false,
      partnerChangeCount: 0,
    };
  },
  async mounted() {
    if (!this.partners) return;
    await this.refreshList();
  },
  watch: {
    async partners() {
      if (this.isRefreshing) {
        this.partnershaveChanged = true;
      } else {
        this.partnerChangeCount += 1;
        await this.refreshList();

        /**
         * Choisir le premier compte de facturation et offre dans la combo, mais pour la première fois
         * le but est d'avoir un composant visible au premier affichage de la page pour les utilisateurs
         * de type partenaire...
         */
        if (this.preselectFirst && this.partnerChangeCount === 1 && this.localItems) {
          this.selectedValue = this.localItems[0];
        }
      }
    },
    async isRefreshing(newValue, oldValue) {
      // console.log('Values>>', newValue, oldValue)
      if (newValue === false && oldValue === true && this.partnershaveChanged) {
        this.partnershaveChanged = false;
        await this.refreshList();
      }
    },
  },
  methods: {
    async refreshList() {
      try {
        this.isRefreshing = true;
        const data = await fetchBillingAccounts('', this.partners, {
          page: 0,
          limit: 999,
          partnerType: this.contextPartnersType,
        });
        this.localItems = data.map(p => ({
          id: p.id,
          label: p.name,
          data: p,
        }));
        this.isRefreshing = false;
      } catch (e) {
        console.log('Erreur api', e);
        this.isRefreshing = false;
      }
    },
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    selectedValue: {
      get() {
        if (this.value && this.value.id && this.localItems && this.localItems.length) {
          return this.localItems.find(i => i.id === this.value.id);
        }

        return this.value;
      },
      set(value) {
        if (value && value.label === '') {
          this.$emit('input', undefined);
          return;
        }
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
