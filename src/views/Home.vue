<template>
  <div class="home">
    <div class="container">
      <DataTable
        :columns.sync="columns"
        :rows="rows"
      />
      <UiCheckbox>Example</UiCheckbox>
      <UiButton
        variant="primary"
        @click="show = !show"
      >Afficher le volet</UiButton>
      <TransitionCollapse>
        <div
          v-if="show"
        >Hello there</div>
      </TransitionCollapse>
    </div>
    <hr>
    <div class="container bg-white">
      <Stepper :steps="steps">
        <p slot="Client">Step Client</p>
        <p slot="Livraison">Livraison</p>
        <p class="alert text-danger">Invalid step</p>
      </Stepper>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DataTable from '@/components/DataTable';
import UiCheckbox from '@/components/ui/Checkbox';
import UiButton from '@/components/ui/Button';
import TransitionCollapse from '@/components/TransitionCollapse';
import Stepper from '@/components/ui/Stepper';

export default {
  name: 'Home',
  data() {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
      {
        label: 'Age',
        name: 'age',
      },
      {
        label: 'birthday',
        name: 'birthday',
      },
    ];
    const rows = [
      {
        id: 1,
        firstName: 'Leroy',
        lastName: 'Jenkins',
      },
    ];
    return {
      columns,
      rows,
      show: false,
      steps: [
        { label: 'Client' },
        { label: 'Produit' },
        { label: 'Livraison' },
        { label: 'Service' },
        { label: 'Paramètres' },
      ],
    };
  },
  components: {
    UiCheckbox,
    UiButton,
    Stepper,
    TransitionCollapse,
    DataTable,
  },
};
</script>
