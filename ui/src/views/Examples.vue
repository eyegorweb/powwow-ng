<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
    </div>
    <VoiceTable :simcard="simcard" />
    <div id="nav">
      <router-link to="/getsim">GetSim</router-link>|
      <router-link to="/filters">Filters</router-link>|
      <router-link to="/secured">Secured</router-link>|
    </div>
    <div class="container">
      <StepperNonLinear :stepper-data="stepperData" />
      <hr />
      <div class="container">
        <div class="card">
          <div class="card-body">
            <h4>Date de la commande</h4>
            <div class="row">
              <div class="col-md-4">
                <!-- class input-group mb-3 -->
                <UiDateRange :start="startDate" :end="endDate" />
              </div>
              <div class="col-md-4">
                <InputRange />
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>

      <br />

      <div class="container">
        <div class="row">
          <div class="col-md-12"></div>
        </div>
      </div>
      <UiCheckbox>Example</UiCheckbox>
      <UiButton variant="primary" @click="show = !show">Afficher le volet</UiButton>
      <TransitionCollapse>
        <div v-if="show">Hello there</div>
      </TransitionCollapse>
    </div>

    <hr />

    <div class="container bg-white">
      {{ selectedAddress }}
      <UiApiAutocomplete :api-method="searchAddress" v-model="selectedAddress" />
    </div>

    <hr />

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
            >{{ index }} - {{ tab.label }}</UiButton
          >
        </template>
        <p slot="Client">Step Client</p>
      </UiTabs>
    </div>
    <hr />
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
    <hr />
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <SearchWithSelect
            :options="valuesForSelectOptions"
            :result.sync="result"
            query
            :type="null"
          />
          <div class="col-md-6">
            <pre>{{ result }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import UiCheckbox from '@/components/ui/Checkbox';
import UiButton from '@/components/ui/Button';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import TransitionCollapse from '@/components/TransitionCollapse';
import Stepper from '@/components/ui/Stepper';
import UiTabs from '@/components/ui/Tabs';
import MultiChoices from '@/components/MultiChoices';
import SearchWithSelect from '@/components/SearchWithSelect';
import UiDateRange from '@/components/ui/UiDateRange';
import InputRange from '@/components/ui/InputRange';
import { searchAddress } from '@/api/address';
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import VoiceTable from '@/views/GetParc/LineDetail/DiagnosisTab/Supervision/VoiceTable';

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
        label: 'Partenaire',
        name: 'partner',
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
        inactive: true,
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
      simcard: {
        id: 330,
      },
      columns,
      selectedAddress: {},
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
      startDate: null, // new Date(),
      endDate: null,
      stepperData: {
        currentIndex: 2,
        data: [
          { label: 'Enregistrée', date: "Il y'a 4 jours" },
          { label: 'Validée', date: "Il y'a 4 jours" },
          { label: 'Confirmée', date: "Il y'a 3 jours" },
          { label: 'Terminée', date: "Il y'a 3 jours" },
        ],
      },
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
    MultiChoices,
    SearchWithSelect,
    UiApiAutocomplete,
    UiDateRange,
    InputRange,
    StepperNonLinear,
    SearchTranslationKey,
    VoiceTable,
  },
};
</script>
