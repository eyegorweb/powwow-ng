<template>
  <nav class="navbar navbar-expand-lg">
    <a
      class="navbar-brand"
      href="#"
    >BOUYGUES</a>
    <InputSelect
      :is-disabled="false"
      field-width="form-group--small"
      field-name="Type de partenaire"
      :field-options="['un', 'deux', 'trois']"
    />
    <InputSelect
      :is-disabled="false"
      field-width="form-group--medium"
      field-name="Sélectionner des partenaires"
      :field-options="['un', 'deux', 'trois']"
    />
    <InputSelect
      :is-disabled="true"
      field-width="form-group--medium"
      field-name="Sélectionner des comptes de facturation"
      :field-options="['un', 'deux', 'trois']"
    />
  </nav>
</template>

<script>
import InputSelect from './ui/InputSelect';

export default {
  name: 'NavBarBackoffice',
  components: {
    InputSelect,
  },
};
</script>

<style scoped lang="scss">
@import '../theme/scss/variables';

.navbar {
  background-color: $white;
  padding: 10px 15px;
}
</style>
