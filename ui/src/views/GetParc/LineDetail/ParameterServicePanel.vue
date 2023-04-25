<template>
  <BaseDetailPanelContent white>
    <div class="m-3">
      <div class="row mb-3">
        <div class="col">
          <div class="d-flex gender">{{ content.param.type }}:</div>
        </div>
      </div>

      <div
        class="entries-line"
        v-if="content.param.radiusType === 'IP' || content.param.radiusType === 'IP_LOGIN'"
      >
        <div class="form-entry">
          <label>
            {{ $t('getparc.lineDetail.tabServices.parameterServiceFormPanel.chooseIp') }}</label
          >
          <UiApiAutocomplete
            :api-method="fetchIpAddressesAvailable"
            v-model="form.ipAddress"
            scroll-for-next
            display-results-while-empty
            :placeholder="$t('getparc.lineDetail.tabServices.ipAddress')"
          />
        </div>
      </div>
      <div
        class="entries-line"
        v-if="content.param.radiusType === 'LOGIN' || content.param.radiusType === 'IP_LOGIN'"
      >
        <div class="form-entry">
          <FormControl
            class="param1"
            label="getparc.lineDetail.tabServices.param1"
            v-model="form.param1"
          />
        </div>
      </div>
      <div
        class="entries-line"
        v-if="content.param.radiusType === 'LOGIN' || content.param.radiusType === 'IP_LOGIN'"
      >
        <div class="form-entry">
          <FormControl
            class="param2"
            label="getparc.lineDetail.tabServices.param2"
            v-model="form.param2"
          />
        </div>
      </div>
    </div>

    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="closePanel" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="doRequest" block>
          {{ $t('save') }}
        </UiButton>
      </div>
    </div>
    <FormReport v-if="report" :data="report" />
    <ErrorsPanel v-if="errors" :errors="errors"></ErrorsPanel>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import { mapMutations } from 'vuex';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { searchIpAddresses } from '@/api/offers';
import uuid from 'uuid/v1';
import FormReport from '@/views/GetParc/LineDetail/ActCreation/FormReport.vue';
import ErrorsPanel from '@/views/GetParc/LineDetail/ActCreation/ErrorsPanel.vue';
import { createUpdateRadiusAdmin } from '@/api/actCreation';
import { formatBackErrors } from '@/utils/errors';

// API
export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    FormControl,
    UiApiAutocomplete,
    FormReport,
    ErrorsPanel,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      form: {
        ipAddress: undefined,
        param1: undefined,
        param2: undefined,
      },
      report: undefined,
      errors: undefined,
    };
  },

  methods: {
    ...mapMutations([
      'flashMessage',
      'closePanel',
      'openPanel',
      'confirmAction',
      'setPendingExportsStatus',
    ]),

    async fetchIpAddressesAvailable(q = '', page = 1) {
      const data = await searchIpAddresses(
        q,
        this.content.sim.party.id,
        this.content.param.type,
        this.content.param.code,
        {
          page,
          limit: 10,
        }
      );
      if (data) {
        return data.items.map((p) => {
          const formattedIpAddresses = {
            key: uuid(),
            label: `${p}`,
            meta: p,
          };
          return formattedIpAddresses;
        });
      }
    },
    async doRequest() {
      const params = {
        iccid: this.$loGet(this.content, 'sim.iccid'),
        addressIP: this.$loGet(this.form, 'ipAddress.meta'),
        param1: this.$loGet(this.form, 'param1'),
        param2: this.$loGet(this.form, 'param2'),
        techno: this.$loGet(this.content, 'param.type'),
        partyId: this.$loGet(this.content, 'sim.party.id'),
        workflowId: this.$loGet(this.content, 'sim.workflow.id'),
        apnCode: this.$loGet(this.content, 'param.code'),
        action: 'UPDATE',
        customerAccountId: this.$loGet(
          this.content,
          'sim.accessPoint.offerGroup.customerAccount.id'
        ),
        resetEmptyField: true,
      };

      const response = await createUpdateRadiusAdmin(params);
      // if there are error in the tempDataReport else if there are error with the input
      if (response && response.errors && response.errors.length && response.tempDataUuid) {
        this.report = { report: { ...response }, errors: response.errors };
      } else if (response && response.errors && response.errors.length) {
        this.errors = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel();
        this.setPendingExportsStatus(true);
      }
    },

    async save() {},
  },

  computed: {
    canSave() {
      if (this.content.param.radiusType == 'IP_LOGIN')
        return !!this.form.ipAddress && !!this.form.param1 && !!this.form.param2;
      else if (this.content.param.radiusType == 'IP') {
        return !!this.form.ipAddress;
      } else if (this.content.param.radiusType == 'LOGIN') {
        return !!this.form.param1 && !!this.form.param2;
      } else {
        return false;
      }
    },
  },
  async mounted() {
    console.log('on mounted get form', this.form);
    console.log('on mounted get content', this.content);
  },
};
</script>

<style lang="scss" scoped>
.language {
  margin-bottom: 20px;
}

.noDisplay {
  display: none !important;
}

.form-input {
  font-size: 1.5rem !important;
}

.form-entry {
  flex-grow: 1;

  h5 {
    font-size: 1rem;
    color: $dark-gray;
  }
}

h6 a:hover {
  cursor: pointer;
  text-decoration: none;
}

.overview-item {
  flex-grow: 1;
}

.entries-line {
  display: flex;
  justify-content: space-between;
}
.labels-container {
  display: flex;
  border-bottom: 1px dashed $medium-gray;
  .overview-item {
    border: none !important;
  }
}

.radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
}

.language {
  margin-right: 10px;
}

.rolesType {
  display: flex;

  h4 {
    width: 50%;
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    cursor: pointer;

    &.active {
      border-bottom: 2px solid #009dcc;
      font-weight: 500;
      color: #009dcc;
    }
  }
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 1px solid $gray-400;
}

.radio-container {
  input:checked ~ .checkmark {
    background-color: white;
    border: 1px solid $secondary;
  }
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.radio-container {
  input:checked ~ .checkmark:after {
    display: block;
  }
  .checkmark:after {
    top: 5px;
    left: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $secondary;
  }
}
</style>
