<template>
  <div>
    <div class="cards">
      <CardsSkeleton v-if="isLoading" />
      <template v-else>
        <div
          v-if="allCustomFields.length < MAX_ALLOWED_CUSTOM_FIELDS && canUpdate"
          class="addNew"
          @click="addNewCustomField"
        >
          <div class="addNew-logo">
            <i class="icon ic-Edit-Icon"></i>
          </div>
          <div>{{ $t('getadmin.customize.addCustomField') }}</div>
        </div>
        <template v-if="allCustomFields">
          <Card
            v-for="(cf, index) in allCustomFields"
            :key="cf.id"
            :can-delete="canUpdate"
            @modify="modifyCustomField(cf)"
            @delete="deleteCF(cf)"
            :can-modify="canUpdate"
          >
            <div class="cardBloc-infos-name">{{ $t('col.customFields', { num: ++index }) }}</div>
            <h2 class="titleCard">Titre:</h2>
            <div class="cardBloc-infos-username">{{ cf.label }}</div>
            <h2 class="titleCard">Type:</h2>
            <div class="cardBloc-infos-username">{{ cf.type }}</div>
            <h2 class="titleCard">Obligatoire:</h2>
            <div class="cardBloc-infos-username">{{ cf.mandatory }}</div>
          </Card>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import CardsSkeleton from '@/views/GetAdmin/PartnerDetail/CardsSkeleton.vue';
import Card from '@/components/Card';
import { fetchCustomFields, deleteCustomField } from '@/api/customFields';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Card,
    CardsSkeleton,
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
      allCustomFields: [],
      customFieldsValues: [],
      customFieldsErrors: [],
      MAX_ALLOWED_CUSTOM_FIELDS: 6,
      isLoading: true,
    };
  },

  async mounted() {
    await this.fetchCustomFieldsForPartner();
    console.log(this.allCustomFields);
  },

  computed: {
    ...mapGetters(['havePermission']),
    canUpdate() {
      return this.havePermission('party', 'update_custom_field');
    },
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    async fetchCustomFieldsForPartner() {
      this.isLoading = true;
      const customFields = await fetchCustomFields(this.partnerid);
      this.allCustomFields = customFields.customFields;
      this.isLoading = false;
    },
    onValueChanged(item, newVal) {
      this.$emit('change', item, newVal);
    },
    async deleteCF(cf) {
      const doReset = () => {
        this.refreshLists();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await deleteCustomField(this.partnerid, cf.code);
          doReset();
        },
      });
    },
    getSelectedValue() {
      console.log('get selected value');
    },
    addNewCustomField() {
      const doReset = () => {
        this.fetchCustomFieldsForPartner();
      };
      this.openPanel({
        title: this.$t('getadmin.customize.addCustomField'),
        panelId: 'getadmin.customize.addCustomField',
        payload: { currentNbCF: this.allCustomFields.length, partnerId: this.partnerid },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },
    async refreshLists() {
      this.fetchCustomFieldsForPartner();
    },
    modifyCustomField(cf) {
      const doReset = () => {
        this.refreshLists();
      };
      this.openPanel({
        title: this.$t('getadmin.customize.modifyCustomField'),
        panelId: 'getadmin.customize.addCustomField',
        payload: { modifyCustomField: cf, partnerId: this.partnerid },
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
.titleCard {
  font-size: 16px;
  margin: 0;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .addNew {
    width: 49%;
    height: 20rem;
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
    &-username {
      font-size: 14px;
      margin-bottom: 10px;
    }

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
