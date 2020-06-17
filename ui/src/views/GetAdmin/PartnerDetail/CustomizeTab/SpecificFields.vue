<template>
  <div>
    <div class="cards">
      <div
        v-if="allSpecificFields.length < MAX_ALLOWED_SPECIFIC_FIELDS"
        class="addNew"
        @click="addNewSpecificField"
      >
        <div class="addNew-logo">
          <i class="icon ic-Edit-Icon"></i>
        </div>
        <div>{{ $t('getadmin.customize.addSpecificField') }}</div>
      </div>
      <template v-if="allSpecificFields">
        <Card
          v-for="(sf, index) in allSpecificFields"
          :key="sf.id"
          :can-delete="false"
          @modify="modifySpecificField(sf)"
          :can-modify="false"
        >
          <div class="cardBloc-infos-name">{{ $t('col.specificFields', { num: ++index }) }}</div>
          <div class="cardBloc-infos-username">{{ sf.label }}</div>
        </Card>
      </template>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import { fetchCustomFields } from '@/api/customFields';
import { mapMutations } from 'vuex';

export default {
  components: {
    Card,
  },
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
    specificFields: {
      type: Array,
    },
    errors: {
      type: Array,
    },
    canEditList: Boolean,
    showOptionalField: Boolean,
  },

  data() {
    return {
      allSpecificFields: [],
      specificFieldsValues: [],
      specificFieldsErrors: [],
      MAX_ALLOWED_SPECIFIC_FIELDS: 2,
    };
  },

  async mounted() {
    await this.fetchCustomFieldsForPartner();
  },

  methods: {
    ...mapMutations(['openPanel']),

    async fetchCustomFieldsForPartner() {
      const specificFields = await fetchCustomFields(this.partnerid);
      this.allSpecificFields = specificFields.specificFields;
    },
    onValueChanged(item, newVal) {
      this.$emit('change', item, newVal);
    },
    getSelectedValue() {
      console.log('get selected value');
    },
    async refreshLists() {
      await fetchCustomFields(this.partnerid);
    },
    addNewSpecificField() {
      const doReset = () => {
        this.fetchCustomFieldsForPartner();
      };
      this.openPanel({
        title: this.$t('getadmin.customize.specificFields'),
        panelId: 'getadmin.customize.specificFields',
        payload: { currentNbCF: this.allSpecificFields.length, partnerId: this.partnerid },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },
    modifySpecificField(cf) {
      const doReset = () => {
        this.refreshLists();
      };
      this.openPanel({
        title: this.$t('getadmin.customize.specificFields'),
        panelId: 'getadmin.customize.specificFields',
        payload: { modifySpecificField: cf, partnerId: this.partnerid },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .addNew {
    width: 49%;
    height: 220px;
    border-radius: 5px;
    font-size: 14px;
    padding: 20px;
    border: #dddddd solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    flex-direction: column;
    cursor: pointer;

    &-logo {
      width: 50px;
      height: 50px;
      background-color: #009dcc;
      border-radius: 100px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        color: white;
      }
    }
  }

  .cardBloc-infos {
    &-name {
      font-weight: 500;
      color: #454545;
      margin-bottom: 7px;
      font-size: 16px;
    }

    &-role {
      font-size: 12px;
      margin-top: 5px;
      margin-bottom: 15px;
    }

    &-email {
      margin-top: 5px;

      a {
        color: #009dcc;
        text-decoration: underline;
      }
    }
  }
}
</style>
