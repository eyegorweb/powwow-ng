<template>
  <MultiSelectSearch
    :items="partners"
    :default-selected-items.sync="selectedPartners"
    :collapsed="collapsed"
    :placeholder="placeholder"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
/**
 * Filtre partenaire,
 *
 * Dépends du contenu de la barre de context ( en haut de la page)
 *
 * doit permettre de séléctionner parmi une liste de partenaires fournis dans la barre de Context
 *
 * Si aucun partenaire n'est saisi, alors le composant fait des recherches sur l'api avec tout les partenaires dans les types choisis dans la barre.
 *
 * Si aucune barre de context n'est dispo ( cas utilisateur non BO) alors faire une recherche sur api sans les paramètres type de partenaire.
 */
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchpartners } from '@/api/partners';

import { mapState } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  props: {
    values: {
      type: Array,
    },
    collapsed: Boolean,
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    // ignorer le contenu du context BO ( ce qui a été choisi dans la barre de contexte)
    ignoreUserContext: Boolean,
    /**
     * utilisée pour limiter les résultats au partenaires des types choisis,
     * ce paramètre n'est pris en compte que si la prop ignoreUserContext est à true
     */
    partnerType: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      lastSearchTerm: '',
      page: 0,
      partners: [],
      canGetNextPage: true,
      asyncMode: true,
      localPartnerTypeIn: undefined,
    };
  },
  async mounted() {
    this.initPartnersList();
  },

  methods: {
    async initPartnersList() {
      if (!this.ignoreUserContext) {
        // priorité aux partenaires séléctionnés
        if (this.contextPartners && this.contextPartners.length) {
          this.partners = this.contextPartners;
          this.asyncMode = false;
          return;
        }
        if (this.contextPartnersType) {
          this.localPartnerTypeIn = this.contextPartnersType;
        }
      } else {
        // à priori la seule fois où on ignore le context utilisateur est dans la barre de contexte ( haut de la page)
        this.localPartnerTypeIn = this.partnerType;
      }
      this.page = 0;
      this.canGetNextPage = true;
      this.asyncMode = true;
      this.partners = await this.fetchFormattedPartnersForDatatable('', { page: 0, limit: 10 });
    },
    async fetchFormattedPartnersForDatatable(q, { page, limit }) {
      const data = await fetchpartners(q, {
        page,
        limit,
        partnerType: this.localPartnerTypeIn,
      });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: p.name,
          orderNumberIsMandatory: p.orderNumberRequired,
          ...p,
        }));
      }
      return undefined;
    },
    async searchValueChanged(q) {
      if (!this.asyncMode) return;
      this.page = 0;
      this.partners = await this.fetchFormattedPartnersForDatatable(q, {
        page: this.page,
        limit: 10,
      });
      this.lastSearchTerm = q;
    },
    async nextPage() {
      if (!this.asyncMode) return;
      if (!this.canGetNextPage) return;
      this.page += 1;
      this.canGetNextPage = false;
      const res = await this.fetchFormattedPartnersForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      this.canGetNextPage = true;
      if (res) {
        this.partners = this.partners.concat(res);
      }
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    selectedPartners: {
      get() {
        return this.values;
      },
      set(partners) {
        this.$emit('updatePartners', partners);
      },
    },
  },
  watch: {
    partnerType(partnerType) {
      if (partnerType) {
        this.localPartnerTypeIn = partnerType;
        // reset search with new partner Types
        this.searchValueChanged('');
      }
    },
    contextPartnersType() {
      this.initPartnersList();
    },
    contextPartners() {
      this.initPartnersList();
    },
    selectedPartners(partners) {
      if (!partners.length) {
        this.initPartnersList();
      }
    },
  },
};
</script>

<style scoped></style>
