<template>
  <div class="home">
    <NavBars is-backoffice-profile />
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
        <div v-if="show">Hello there</div>
      </TransitionCollapse>
    </div>

    <hr>

    <div class="container bg-white">
      <UiApiAutocomplete :api-method="searchAddress" />
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
        <template slot-scope="{ tab, index, selectTab, selectedIndex }">
          <UiButton
            :variant="selectedIndex === index ? 'success' : 'link'"
            @click="selectTab(index)"
          >{{ index }} - {{ tab.label }}</UiButton>
        </template>
        <p slot="Client">Step Client</p>
      </UiTabs>
    </div>

    <div class="container">
      <div class="card">
        <div class="card-body">
          <h4>Choix multiples</h4>

          <div class="row">
            <div class="col-md-6">
              <MultiChoices
                :values="valuesForMultiChoice"
                :selected-values.sync="selectedValuesForMultiChoice"
              />
            </div>
            <div class="col-md-6">
              <pre>{{ selectedValuesForMultiChoice }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <SearchWithSelect
            :options="valuesForSelectOptions"
            :result.sync="result"
            query=""
            :type="null"
          />
          <div class="col-md-6">
            <pre>{{ result }}</pre>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <ActionCarousel :actions="carouselItems" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DataTable from '@/components/DataTable';
import UiCheckbox from '@/components/ui/Checkbox';
import UiButton from '@/components/ui/Button';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import TransitionCollapse from '@/components/TransitionCollapse';
import Stepper from '@/components/ui/Stepper';
import UiTabs from '@/components/ui/Tabs';
import NavBars from '@/components/NavBars';
import MultiChoices from '@/components/MultiChoices';
import SearchWithSelect from '@/components/SearchWithSelect';
import ActionCarousel from '@/components/ActionCarousel';
import { searchAddress } from '@/api/address';

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

    const valuesForMultiChoice = [
      {
        code: 'c1',
        label: 'Pepsi',
      },
      {
        code: 'c2',
        label: 'Coca',
      },
      {
        code: 'c3',
        label: 'Orangina',
      },
    ];
    const selectedValuesForMultiChoice = [];
    const valuesForSelectOptions = [
      {
        code: 'c1',
        value: 'Type 1',
        label: 'Type 1',
      },
      {
        code: 'c2',
        value: 'Type 2',
        label: 'Type 2',
      },
      {
        code: 'c3',
        value: 'Type 3',
        label: 'Type 3',
      },
    ];
    const carouselItems = [
      {
        icon: 'ic-Heart-Rythm-Icon',
        title: 'En cours consommation',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Stats-Icon',
        title: 'Export consommation',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Gérer des alarmes',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Clock-Icon',
        title: 'Export dernier usage',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Wallet-Icon',
        title: 'Changement de C.F.',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Cart-Icon',
        title: "Changement d'offre",
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Positionner une alarme7',
        subtitle: '50 cartes éligibles',
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
      valuesForMultiChoice,
      selectedValuesForMultiChoice,
      valuesForSelectOptions,
      result: undefined,
      carouselItems,
    };
  },

  methods: {
    searchAddress,
  },

  components: {
    UiCheckbox,
    UiButton,
    Stepper,
    UiTabs,
    TransitionCollapse,
    DataTable,
    NavBars,
    MultiChoices,
    SearchWithSelect,
    ActionCarousel,
    UiApiAutocomplete,
  },
};
</script>
