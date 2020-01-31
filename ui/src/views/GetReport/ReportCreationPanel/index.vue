<template>
  <div class="creationContainer">
    <div class="panelContent">
      <div class="checkBoxesContainer">
        <SectionTitle :num="1">Choisir les informations</SectionTitle>
        <p>Choisissez dans les rubriques suivantes les informations de ligne que vous souhaitez faire apparaître dans votre rapport personnalisé. Vous pourrez ainsi filtrer et trier ces informations dans votre tableur préféré.</p>

        <div class="mt-4 mb-2">
          <h6>à partir d'un modèle du rapport</h6>
          <UiSelect class="report-field" v-model="reportModel" :options="reportModels" block />
        </div>

        <div class="checkbox-groups">
          <FoldableBlock :title="group.title" :key="group.title" v-for="group in groups">
            <div class="bg-white p-3 bordered checkboxes-container">
              <div v-for="checkbox in group.checkboxes" class="d-flex pt-3 item">
                <UiCheckbox v-model="checkbox.checked" @change="() => selectOrRemove(checkbox)" />
                <span>{{checkbox.label}}</span>
              </div>
            </div>
          </FoldableBlock>
        </div>

        <SectionTitle :num="2">Récurrence et date</SectionTitle>
        <div class="mb-2">
          <h6>Générer un rapport</h6>
          <Toggle
            v-if="generationPeriod"
            @update="generationPeriod = $event.id"
            :values="reportPeriods"
            class="pl-2"
          />
        </div>
        <div class="mt-4 mb-2">
          <h6>Date de génération</h6>
          <UiDate
            time-picker
            @change="newVal => (generationDate = newVal)"
            :value="generationDate"
            :error="dateError ? 'errors.mandatory' : undefined"
            class="d-block report-field"
          >
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>

        <SectionTitle :num="3">Notification</SectionTitle>

        <div class="d-flex">
          <div class="d-flex pt-3">
            <UiCheckbox v-model="shouldNotify" />
            <span>{{ $t('mailNotification') }}</span>
          </div>

          <div class="d-flex mailing-list">
            <span class="pt-3">Liste de diffusion</span>
            <UiSelect class="report-field" v-model="notifList" :options="notifLists" block />
          </div>
        </div>
      </div>
      <div class="fieldsRecap">
        <h5>Données du rapport</h5>
        <ul class="list-unstyled">
          <li v-for="i in selectedItems" :key="'remove_' + i.label">
            <button class="btn btn-link p-1" @click.stop="() => removeItem(i)">
              <i class="ic-Minus-Icon"></i>
            </button>
            {{i.label}}
          </li>
        </ul>
      </div>
    </div>
    <div class="fileInfo">
      <div class="fileInfoContainer">
        <div>
          <h6>Générer un rapport</h6>
          <UiInput v-model="name" class="d-block" />
        </div>
        <div>
          <h6>Générer un rapport</h6>
          <UiSelect class="report-field" v-model="notifList" :options="notifLists" block />
        </div>
        <div>
          <button type="button" class="btn btn-secondary btn-lg btn-block mt-4">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle';
import Toggle from '@/components/ui/UiToggle2';
import UiDate from '@/components/ui/UiDate';
import UiCheckbox from '@/components/ui/Checkbox';
import UiSelect from '@/components/ui/UiSelect';
import FoldableBlock from '@/components/FoldableBlock';
import UiToggle from '@/components/ui/UiToggle';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    SectionTitle,
    Toggle,
    UiDate,
    UiCheckbox,
    UiSelect,
    FoldableBlock,
    UiToggle,
    UiInput,
  },

  methods: {
    removeItem(checkbox) {
      checkbox.checked = false;
      this.selectedItems = this.selectedItems.filter(i => i.label !== checkbox.label);
    },
    selectOrRemove(checkbox) {
      if (checkbox.checked) {
        this.selectedItems.push(checkbox);
      } else {
        this.selectedItems = this.selectedItems.filter(i => i.label !== checkbox.label);
      }
    },
  },
  data() {
    return {
      selectedItems: [],
      generationDate: undefined,
      dateError: false,
      shouldNotify: false,
      generationPeriod: 'once',
      name: undefined,
      reportPeriods: [
        {
          id: 'once',
          label: 'Une seule fois',
        },
        {
          id: 'daily',
          label: 'Journalier',
        },
        {
          id: 'weekly',
          label: 'Hebdomadaire',
        },
        {
          id: 'mounthly',
          label: 'Mensuel',
        },
      ],

      reportModel: undefined,
      reportModels: [
        {
          label: 'Liste 1',
          value: 'list1',
        },
      ],

      notifList: undefined,
      notifLists: [
        {
          label: 'Liste 1',
          value: 'list1',
        },
      ],

      groups: [
        {
          title: 'Informations Dual SIM',
          checkboxes: [
            { label: 'Dual ICCID', checked: false },
            { label: 'Dual MSISDN', checked: false },
            { label: 'Dual IMSI', checked: false },
          ],
        },

        {
          title: 'Informations commerciales',
          checkboxes: [
            { label: 'Nom de l’offre', checked: false },
            { label: 'Services de la ligne et', checked: false },
            { label: 'Nom du compte de facturation', checked: false },
            { label: 'Code du compte de facturation', checked: false },
            { label: 'Nom du partenaire', checked: false },
            { label: 'Code du partenaire', checked: false },
            { label: 'Date de fin d’engagement', checked: false },
            { label: 'Statut commercial ', checked: false },
            { label: 'Statut de facturation', checked: false },
          ],
        },

        {
          title: 'Informations de la commande',
          checkboxes: [
            { label: 'ID de commande', checked: false },
            { label: 'Nom du partenaire de la commande ', checked: false },
            { label: 'Code du partenaire de la commande', checked: false },
            { label: 'Référence client', checked: false },
            { label: 'Pré-Activation / Activation', checked: false },
            { label: 'Offre de la commande', checked: false },
            { label: 'Date de la commande ', checked: false },
            { label: 'Créateur de la commande', checked: false },
            { label: 'Statut de la commande', checked: false },
            { label: 'Date du statut', checked: false },
            { label: 'Contact de livraison', checked: false },
            { label: 'Société', checked: false },
            { label: 'Adresse de livraison', checked: false },
            { label: 'Adresse de facturation', checked: false },
            { label: 'Référence contrat ', checked: false },
            { label: 'Quantité de SIM commandées ', checked: false },
            { label: 'Quantité de SIM importées', checked: false },
            { label: 'Code du compte de facturation de la commande', checked: false },
            { label: 'Nom du compte de facturation de la commande ', checked: false },
          ],
        },

        {
          title: 'Consommation',
          checkboxes: [
            { label: 'Encours Data montant (mensuel)', checked: false },
            { label: 'Encours Data descendant (mensuel)', checked: false },
            { label: 'Encours SMS (mensuel)', checked: false },
            { label: 'Encours Voix (mensuel)', checked: false },
          ],
        },

        {
          title: 'Informations dernier usage',
          checkboxes: [
            { label: 'Statut de la dernière connexion', checked: false },
            { label: 'Début de la dernière connexion', checked: false },
            { label: 'Fin de la dernière connexion', checked: false },
            { label: 'Motif de fermeture de la connexion ', checked: false },
            { label: 'Volume montant de la dernière connexion', checked: false },
            { label: 'Volume descendant de la dernière connexion', checked: false },
            { label: 'Date du dernier SMS', checked: false },
            { label: 'Direction du dernier SMS', checked: false },
            { label: 'Date de la dernière communication voix', checked: false },
            { label: 'Durée de la dernière communication voix', checked: false },
            { label: 'Direction de la dernière communication voix ', checked: false },
            { label: 'Type adresse IP', checked: false },
            { label: 'Adresse IP V4', checked: false },
            { label: 'Adresse IP V6', checked: false },
            { label: 'APN', checked: false },
            { label: 'Pays', checked: false },
            { label: 'Opérateur ', checked: false },
            { label: 'Code postal', checked: false },
            { label: 'Ville', checked: false },
            { label: 'Id de cellule', checked: false },
            { label: 'Coordonnées géographiques ', checked: false },
            { label: 'Date de dernière localisation', checked: false },
            { label: "Type d'usage", checked: false },
            { label: 'Détail', checked: false },
            { label: 'PLMN', checked: false },
            { label: 'PLMN réel ', checked: false },
            { label: 'Type appel', checked: false },
            { label: 'IMEI du dernier usage', checked: false },
            { label: 'Code offre du dernier usage ', checked: false },
            { label: 'Génération du ticket', checked: false },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.checkbox-groups {
  .foldable-block.is-open {
    & /deep/ .title,
    & /deep/ a i {
      color: $secondary;
    }
  }
}
.creationContainer {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;

  .panelContent {
    flex-grow: 1;
    height: 80%;

    display: flex;
    flex-flow: row nowrap;

    .checkBoxesContainer {
      width: 70%;
      background: white;
      overflow: auto;
      padding: 1rem;
    }

    .fieldsRecap {
      width: 30%;
      background: #f1f1f1;
      overflow: auto;
      padding: 1rem;

      h5 {
        font-weight: 400;
        padding: 1rem;
      }
    }
  }

  .fileInfo {
    padding: 1rem;
    height: 6rem;
    background: white;
    border-top: 1px solid $medium-gray;

    .fileInfoContainer {
      display: flex;
      justify-content: space-between;

      div {
        flex-basis: 15rem;
      }
    }
  }
}

.report-field {
  width: 15rem;
}

.mailing-list {
  flex-grow: 1;
  span {
    padding-top: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-basis: 18rem;
    text-align: end;
  }
}

.checkboxes-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    flex-basis: 50%;
  }
}
</style>
