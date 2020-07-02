<template>
  <div class="d-flex justify-content-end">
    <UiDropdownButton>
      <UiButton
        slot="trigger"
        slot-scope="{ staticClass, toggle }"
        variant="link"
        class="flex-grow-1 py-1 px-1"
        @click.prevent="toggle"
        :class="staticClass"
        >{{ $t('getsim.actions.btn') }}</UiButton
      >
      <div slot-scope="{ hide }">
        <div class="list-group" :key="action" v-for="action in actions">
          <button
            v-if="action !== 'getparc.history.actions.EXPORT'"
            type="button"
            class="list-group-item list-group-item-action order-action hover-pointer"
            @click="
              () => {
                hide();
                onActionClicked(action);
              }
            "
          >
            {{ $t(action) }}
          </button>
          <ExportButton
            v-else
            :export-fn="getExportFn()"
            :columns="columns"
            :order-by="orderBy"
            class="list-group-item-action"
          >
            <i slot="icon" />
            <span slot="title">{{ $t(action) }}</span>
          </ExportButton>
        </div>
      </div>
    </UiDropdownButton>
  </div>
</template>

<script>
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import UiButton from '@/components/ui/Button';
import { exportMassAction, cancelMassAction } from '@/api/massActions';
import DetailsCell from '@/views/GetParc/UnitActionsPage/DetailsCell';
import ExportButton from '@/components/ExportButton';

export default {
  components: {
    UiDropdownButton,
    UiButton,
    ExportButton,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.details'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          format: {
            component: DetailsCell,
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'MSISDN',
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          exportId: 'ICCID',
        },

        {
          id: 5,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'UNIT_ACTION_STATUS',
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'error_reason',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_MANUFACTURER',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_REFERENCE',
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
          exportId: 'IMEI',
        },
      ],
    };
  },
  methods: {
    async onActionClicked(action) {
      switch (action) {
        case 'getparc.history.actions.DETAIL': {
          this.$router.push({ name: 'actDetail', params: { massActionId: this.item.id } });
          break;
        }
        case 'getparc.history.actions.EXPORT': {
          this.getExportFn();
          break;
        }
        case 'getparc.history.actions.CANCEL': {
          await cancelMassAction(this.item.id);
          break;
        }
      }
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        return await exportMassAction(
          this.item.id,
          ['WAITING', 'SENT', 'IN_PROGRESS', 'OK', 'KO', 'REPLAYED', 'CANCELLED'],
          '',
          [
            'MASS_ACTION_ID',
            'MASS_ACTION_INFO',
            'UNIT_ACTION_ID',
            'UNIT_ACTION_TYPE',
            'UNIT_ACTION_INFO',
            'ICCID',
            'UNIT_ACTION_STATUS',
            'UNIT_ACTION_START_DATE',
            'UNIT_ACTION_END_DATE',
            'UNIT_ACTION_STATUS_DATE',
            'UNIT_ACTION_STATUS_ERROR',
            'MSISDN',
            'DEVICE_MANUFACTURER',
            'DEVICE_REFERENCE',
            'IMEI',
            'LOGIN',
          ],
          exportFormat,
          asyncExportRequest
        );
      };
    },
  },
  computed: {
    totalFailed() {
      return this.item.errorActionNumber > 1;
    },
    actions() {
      let actions = [];
      switch (this.item.status) {
        case 'WAITING': {
          actions = ['getparc.history.actions.DETAIL', 'getparc.history.actions.EXPORT'];

          break;
        }

        default:
          actions = ['getparc.history.actions.DETAIL', 'getparc.history.actions.EXPORT'];
      }

      if (this.item.cancellable) {
        actions.push('getparc.history.actions.CANCEL');
      }


      return actions;
    },
  },
};
</script>

<style lang="scss">
.list-group-item-action button.export-link {
  float: left !important;
  color: #495057 !important;
}
</style>
