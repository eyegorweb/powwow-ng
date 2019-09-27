<template>
  <ContentBlock>
    <template slot="title">{{ $t('getparc.lineDetail.tab3.controlRequestsTitle') }}</template>
    <template slot="content">
      <PaginatedDataTable
        :key="tableVersion"
        :columns="columns"
        :fetch-data-fn="getFetchDataFn()"
        :size="0"
      />
      <div class="row">
        <div class="col-md-12">
          <button @click="openNewDemandModal" class="btn btn-xs float-right btn-primary">
            Ajouter une nouvelle demande
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
                    @change="newVal => (dateFrom = newVal)"
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
                    @change="newVal => (dateTo = newVal)"
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
        <div slot="footer">
          <button class="modal-default-button btn btn-danger btn-sm" @click.stop="cancel">
            {{ $t('cancel') }}
          </button>
          <button class="modal-default-button btn btn-success btn-sm ml-1" @click.stop="saveDemand">
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
import RealConsumtionCol from './RealConsumtionCol';
import StatutCol from './StatutCol';
import DataCol from './DataCol';
import SMSCol from './SMSCol';
import VoiceCol from './VoiceCol';

import Modal from '@/components/Modal';
import UiDate from '@/components/ui/UiDate2';

import BackendErrors from '@/components/BackendErrors';

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
  methods: {
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

      const dateFromParam = this.dateFrom.replace(/\//g, '-');
      const dateToParam = this.dateTo.replace(/\//g, '-');

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
      return async pageInfo => {
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
        col('Statut', 'Statut', true, false),
        col('Statut', 'id', true, false, { component: StatutCol }),
        col('DATA', 'id', true, false, { component: DataCol }),
        col('SMS', 'id', true, false, { component: SMSCol }),
        col('Voice', 'id', true, false, { component: VoiceCol }),
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
