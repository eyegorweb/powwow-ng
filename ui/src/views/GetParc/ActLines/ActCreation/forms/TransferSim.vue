<template>
  <div class="transferSim">
    <div>
      <PaginatedDataTable
        v-if="columns"
        storage-id="getparc.table.sim-validation"
        storage-version="002"
        :columns="columns"
        :order="orderBy"
        :fetch-data-fn="getFetchTransferSimDataFN()"
        :size="8"
        @colEvent="onRowSelect"
      >
        <template slot="topLeftCorner">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{
              $t('getparc.actLines.selected', {
                total: $formatLargeNumber(formattedTotal),
              })
            }}
          </h2>
        </template>
      </PaginatedDataTable>
    </div>
    <div class="mt-2 row" v-if="total">
      <div class="col-8">
        <UiButton
          @click="transferRequest('IN_PROGRESS')"
          :variant="'info'"
          class="transferSim-button"
          >{{ $t('processing') }}</UiButton
        >
        <UiButton
          @click="transferRequest('VALIDATE')"
          :variant="'primary'"
          class="transferSim-button"
          >{{ $t('getparc.actCreation.transferSIM.validate') }}</UiButton
        >
        <UiButton
          @click="transferRequest('CANCEL')"
          :variant="'danger'"
          class="transferSim-button"
          >{{ $t('getparc.actCreation.transferSIM.deny') }}</UiButton
        >
      </div>
      <div class="col-4">
        <div class="text-right">
          <button @click="clearForm" class="clear-form">
            {{ $t('cancel') }}
            <i class="ic-Cross-Icon" />
          </button>
        </div>
        <div v-if="exceptionError" class="text-info">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import CheckBoxCell from '@/views/GetVision/alarmDetail/TargetedLinesByAlarmTab/CheckBoxCell.vue';
import ToPartner from './parts/ToPartner.vue';
import FromPartner from './parts/FromPartner.vue';
import UiButton from '@/components/ui/Button';
import { fetchTransferSim, updateTransferSim } from '@/api/linesActions.js';
import { formatBackErrors } from '@/utils/errors';
import { col } from '@/components/DataTable/utils';
import { mapMutations } from 'vuex';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
  },

  data() {
    return {
      selectedRows: [],
      transferIds: [],
      orderBy: { key: 'transferId', direction: 'DESC' },
      data: {},
      columns: undefined,
      exceptionError: undefined,
    };
  },

  mounted() {
    this.columns = [
      {
        id: 99,
        label: '',
        name: '',
        orderable: false,
        visible: true,
        noHandle: true,
        notConfigurable: true,
        format: {
          component: CheckBoxCell,
        },
      },
      col(2, 'ID', 'transferId', true, true),
      col(3, 'ICCID', 'iccid', true, true),
      col(4, 'Partenaire source', 'fromPartner', true, true, {
        component: FromPartner,
      }),
      col(5, 'Partenaire cible', 'toPartner', true, true, {
        component: ToPartner,
      }),
      col(6, 'Statut de la ligne', 'status', true, true),
      col(7, 'Date de statut', 'created', true, true),
    ];
  },

  computed: {
    total() {
      if (this.data && this.data.total) return this.data.total;
      return 0;
    },
    totalSelectedRows() {
      return this.selectedRows.length;
    },
    confirmationMessage() {
      let count = this.totalSelectedRows > 0 ? this.totalSelectedRows : this.total;
      return `${this.$t('getparc.actCreation.transferSim.confirmationWarning', { count })}`;
    },
    formattedTotal() {
      return this.totalSelectedRows || this.total;
    },
  },

  methods: {
    ...mapMutations(['confirmAction', 'flashMessage']),
    ...mapMutations('actLines', ['clearActSimTransfer']),
    async transferRequest(status) {
      this.fetchTransferId();

      this.confirmAction({
        message: this.confirmationMessage,
        actionFn: async () => {
          const response = await updateTransferSim(this.transferIds, status);
          if (response.errors && response.errors.length) {
            let errorMessage = '',
              massActionLimitError = '',
              count;
            const formatted = formatBackErrors(response.errors)
              .map((e) => e.errors)
              .flat();
            formatted.forEach((e) => {
              if (e.key === 'limit') {
                count = e.value;
              }
              if (e.key === 'error') {
                massActionLimitError = `${e.key}.${e.value}`;
              } else if (
                e.value === 'MANDATORY_SERVICE_NOT_FOUND' ||
                e.value === 'INCOMPATIBLE_SERVICE' ||
                e.value === 'MANDATORY_SERVICE'
              ) {
                let service = e.key;
                errorMessage = `${this.$t('getparc.actCreation.report.' + e.value, {
                  service,
                })}`;
              } else {
                errorMessage = `${e.key}: ${e.value}`;
              }
            });
            if (massActionLimitError) {
              this.exceptionError = `${this.$t(
                'getparc.actCreation.report.errors.' + massActionLimitError,
                {
                  count,
                }
              )}`;
            } else {
              this.exceptionError = errorMessage;
            }

            return {
              errors: response.errors,
            };
          } else {
            if (response) {
              this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
              this.resetState();
            } else {
              this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
            }
          }
        },
      });
    },

    fetchTransferId() {
      this.transferIds = [];
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach((e) => {
          this.transferIds.push(e.transferId);
        });
      }
    },

    onRowSelect(payload) {
      if (payload.add) {
        this.selectedRows.push(payload.add);
      }
      if (payload.remove) {
        this.selectedRows = this.selectedRows.filter(
          (r) => r.transferId !== payload.remove.transferId
        );
      }
    },

    getFetchTransferSimDataFN() {
      return async (pageInfo, orderBy) => {
        this.data = await fetchTransferSim(pageInfo, orderBy);
        return {
          rows: this.data.items,
          total: this.data.total,
        };
      };
    },

    resetState() {
      this.data = {};
      this.columns = undefined;
      this.clearActSimTransfer();
    },

    clearForm() {
      this.resetState();
    },
  },
};
</script>

<style lang="scss">
.transferSim {
  margin-bottom: 3rem;

  &-button {
    margin-right: 2rem;
  }

  > .row {
    background: white;
    margin-left: 0;
    padding: 20px 0;
  }

  .clear-form {
    appearance: none;
    outline: none;
    border: none;
    background-color: transparent;
  }
}
</style>
