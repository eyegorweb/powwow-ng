<template>
  <div class="home">
    <div class="container">
      <DataTable
        :columns.sync="columns"
        :extra-columns="extraColumns"
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
      </Stepper>
      <UiTabs :tabs="steps">
        <p slot="Client">Step Client</p>
      </UiTabs>
      <UiTabs :tabs="steps">
        <template
          slot-scope="{ tab, index, selectTab, selectedIndex }"
        >
          <UiButton
            :variant="selectedIndex === index ? 'success' : 'link'"
            @click="selectTab(index)"
          >{{ index }} - {{ tab.label }}</UiButton>
        </template>
        <p slot="Client">Step Client</p>
      </UiTabs>
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
import UiTabs from '@/components/ui/Tabs';

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
        name: 'partner',
        label: 'Partenaire',
      },
    ];
    const rows = [
      {
        id: 1,
        firstName: 'Leroy',
        lastName: 'Jenkins',
        partner: 'Partenaire 1',
        orderId: '12345',
        orderStatus: 'OK',
      },
    ];
    const extraColumns = [
      {
        name: 'partner',
        label: 'Partenaire',
      },
      {
        name: 'orderId',
        label: 'ID de commande',
      },
      {
        name: 'orderStatus',
        label: 'Statut de commande',
      },
    ];
    return {
      columns,
      rows,
      extraColumns,
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
    UiTabs,
    TransitionCollapse,
    DataTable,
  },
};
</script>
