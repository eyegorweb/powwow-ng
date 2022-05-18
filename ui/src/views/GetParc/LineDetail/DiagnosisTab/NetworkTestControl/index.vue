<template>
  <ContentBlock>
    <template slot="title">{{ $t('getparc.lineDetail.tab3.controlRequestsTitle') }}</template>
    <template slot="content">
      <PaginatedDataTable
        :key="tableVersion"
        :columns="columns"
        :columns-sub="columnsSub"
        :fetch-data-fn="getFetchDataFn()"
        :size="0"
        sub-rows
        @colEvent="onCancelDone"
      >
      </PaginatedDataTable>
      <div class="row">
        <div class="col-md-12">
          <button @click="openNewDemandModal" class="btn btn-xs float-right btn-primary">
            {{ $t('getparc.lineDetail.tab3.addRequest') }}
          </button>
        </div>
      </div>
      <Modal v-if="showForm">
        <div class="text-left" slot="body">
          <form @submit.prevent="() => {}">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="message">{{ $t('filters.actDateStart') }}</label>
                  <UiDate
                    time-picker
                    @change="(newVal) => (dateFrom = newVal)"
                    :value="dateFrom"
                    class="d-block"
                    :error="dateFromInError ? 'errors.mandatory' : undefined"
                  >
                    <i slot="icon" class="select-icon ic-Flag-Icon" />
                  </UiDate>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label for="message">{{ $t('filters.actDateEnd') }}</label>
                  <UiDate
                    time-picker
                    @change="(newVal) => (dateTo = newVal)"
                    :value="dateTo"
                    class="d-block"
                    :error="dateToInError ? 'errors.mandatory' : undefined"
                  >
                    <i slot="icon" class="select-icon ic-Flag-Icon" />
                  </UiDate>
                </div>
              </div>
            </div>
          </form>
          <BackendErrors
            v-if="formErrors"
            :errors="formErrors"
            trad-prefix="getparc.lineDetail.tab3.errors"
          />
        </div>
        <div slot="footer" class="btnsContainer" >
          <button class="btns btns--cancel" @click.stop="cancel">
            {{ $t('cancel') }}
          </button>
          <button class="btns btns--confirm" @click.stop="saveDemand">
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </template>
  </ContentBlock>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';

import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { col } from '@/components/DataTable/utils';
import { consumptionOnDemand, createConsumptionOnDemand } from '@/api/consumption';

import ObservationRangeCol from './ObservationRangeCol';
import SubStream from './SubStream';
import RealConsumtionCol from './RealConsumtionCol';
import StatutCol from './StatutCol';
import DataCol from './DataCol';
import SMSCol from './SMSCol';
import VoiceCol from './VoiceCol';

import Modal from '@/components/Modal';
import UiDate from '@/components/ui/UiDate';

import BackendErrors from '@/components/BackendErrors';
import { formatBackErrors } from '@/utils/errors';
import { mapMutations } from 'vuex';

export default {
  components: {
    PaginatedDataTable,
    ContentBlock,
    Modal,
    UiDate,
    BackendErrors,
  },
  props: {
    content: Object,
  },
  mounted() {
    if (this.$route.params.createTestRequest) {
      this.openNewDemandModal();
    }
  },
  methods: {
    ...mapMutations(['flashMessage']),

    onCancelDone(payload) {
      if (payload.response.errors && payload.response.errors.length) {
        const errors = formatBackErrors(payload.response.errors);
        errors.forEach((e) => {
          e.errorKeys.forEach((ekey) => {
            this.flashMessage({
              level: 'danger',
              message: this.$t('getparc.lineDetail.tab3.errors.' + ekey),
            });
          });
        });
      } else {
        this.reloadTable();
      }
    },
    openNewDemandModal() {
      this.dateFromInError = undefined;
      this.dateToInError = undefined;
      this.dateFrom = undefined;
      this.dateTo = undefined;
      this.showForm = true;
    },
    cancel() {
      this.showForm = false;
    },
    async saveDemand() {
      this.dateFromInError = !this.dateFrom;
      this.dateToInError = !this.dateTo;
      const haveErrors = this.dateFromInError || this.dateToInError;
      this.formErrors = undefined;

      if (haveErrors) return;

      const dateFromParam = this.dateFrom.replace(/\//g, '/');
      const dateToParam = this.dateTo.replace(/\//g, '/');

      const response = await createConsumptionOnDemand(this.content.id, dateFromParam, dateToParam);

      if (response.errors && response.errors.length) {
        this.formErrors = response.errors;
      } else {
        this.reloadTable();
        this.cancel();
      }
    },
    reloadTable() {
      this.tableVersion += 1;
    },
    getFetchDataFn() {
      return async (pageInfo) => {
        const response = await consumptionOnDemand(this.content.id, pageInfo);
        return {
          rows: response.consumptionsOnDemands.items,
          total: response.consumptionsOnDemands.total,
        };
      };
    },
  },
  data() {
    return {
      showForm: false,
      dateFrom: undefined,
      dateTo: undefined,
      dateFromInError: false,
      dateToInError: false,
      tableVersion: 0,
      formErrors: undefined,
      columns: [
        col('Période d’observation', 'id', true, false, { component: ObservationRangeCol }),
        col('Consommation réelle', 'id', true, false, { component: RealConsumtionCol }),
        col('Statut', 'id', true, false, { component: StatutCol }),
        col('DATA', 'id', true, false, { component: DataCol }),
        col('SMS', 'id', true, false, { component: SMSCol }),
        col('Voice', 'id', true, false, { component: VoiceCol }),
      ],
      columnsSub: [
        col('Période d’observation', 'id', true, false, { component: SubStream }),
        col('Consommation réelle', 'id', true, false, { component: RealConsumtionCol }),
        col('', 'empty', true, false),
        col('DATA', 'id', true, false, { component: DataCol }),
        col('', 'empty2', true, false),
        col('', 'empty3', true, false),
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
  .btnsContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .btns {
    border: none;
    width: 48%;
    border-radius: 5px;
    padding: 10px;
    transition: 0.3s;

    &--confirm {
      background-color: #0055a4;
      color: white;

      &:hover {
        background-color: #00417e;
      }
    }

    &--cancel {
      border: 1px solid #0055a4;
      color: #0055a4;
      background-color: white;
    }
  }
</style>
