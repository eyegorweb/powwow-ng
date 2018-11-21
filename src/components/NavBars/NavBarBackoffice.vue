<template>
  <nav class="navbar navbar-expand-lg">
    <img
      class="logo"
      src="@/assets/logo_bouygues.png"
      alt=""
    >
    <InputSelect
      :is-disabled="false"
      field-width="form-group--small"
      field-name="Type de partenaire"
      :field-options="partnersTypes"
    />
    <InputSelect
      :is-disabled="false"
      field-width="form-group--medium"
      field-name="Sélectionner des partenaires"
      :field-options="partnersNames"
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
import InputSelect from './../ui/InputSelect';

export default {
  name: 'NavBarBackoffice',
  components: {
    InputSelect,
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
  border-bottom: 1px solid $light-grey;
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
