<template>
  <nav class="navbar navbar-expand-lg">
    <div>
      <img class="logo" src="@/assets/logo_bouygues.png" alt>
    </div>

    <div class="input-group w-auto flex-grow-1">
      <UiSelect
        class="text-gray"
        placeholder="Type de partenaire"
        v-model="selectedPartnerType"
        :options="partnersTypeOptions"
      />
      <UiSelect
        class="text-gray"
        placeholder="Sélectionner des partenaires"
        v-model="selectedPartner"
        :options="partnersOptions"
      />
      <UiSelect
        class="text-gray"
        placeholder="Sélectionner des comptes de facturation"
        v-model="selectedAccount"
        :options="billingAccounts"
        disabled
      />
    </div>
  </nav>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  name: 'NavBarBackoffice',
  components: {
    UiSelect,
  },
  data() {
    return {
      partnersTypeOptions: ['Partenaire type un', 'Partenaire type deux'],
      partnersOptions: ['Partenaire un', 'Partenaire deux'],
      billingAccounts: ['Compte un', 'Compte deux'],
      selectedPartnerType: null,
      selectedPartner: null,
      selectedAccount: null,
    };
  },
  props: {
    partnersTypes: {
      type: Array,
      required: true,
    },
    partnersNames: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
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
</style>
