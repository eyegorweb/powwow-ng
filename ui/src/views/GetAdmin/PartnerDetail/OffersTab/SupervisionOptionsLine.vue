<template>
  <tr>
    <td>{{ row.workflowCode + ' ' + row.description }}</td>
    <td>{{ yesOrNo('autoDiagnosticEnabled') }}</td>
    <td>{{ yesOrNo('fleetEnabled') }}</td>
    <td v-if="userIsBO">
      <tr>
        <td>
          <tr>
            <td>{{ yesOrNo('geolocalisationEnabled') }}</td>
            <td>{{ row.dmdGeolocCPT }}</td>
            <td>{{ row.dmdGeolocLimit }}</td>
          </tr>
        </td>
      </tr>
    </td>

    <td v-if="userIsBO">
      <tr>
        <td>
          <tr>
            <td>{{ yesOrNo('requestConsoEnabled') }}</td>
            <td>{{ row.dmdConsoCPT }}</td>
            <td>{{ row.dmdConsoLimit }}</td>
          </tr>
        </td>
      </tr>
    </td>

    <td v-if="!userIsBO">{{ yesOrNo('requestConsoEnabled') }}</td>
    <td>{{ yesOrNo('imeiEnabled') }}</td>
    <td>
      <select name="reporting" v-model="reporting" :selected="row.reportAvaiPDPEnabled">
        <option value="true">{{ $t('common.YES') }}</option>
        <option value="false">{{ $t('common.NO') }}</option>
      </select>
    </td>
    <td>
      <select name="rCard" v-model="rCard" :selected="row.rCard">
        <option value="true">{{ $t('common.YES') }}</option>
        <option value="false">{{ $t('common.NO') }}</option>
      </select>
    </td>
  </tr>
</template>

<script>
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    return {
      rCard: undefined,
      reporting: undefined,
      rCardMounted: false,
      reportingMounted: false,
    };
  },
  computed: {
    ...mapGetters(['userIsBO']),
  },
  mounted() {
    this.rCard = this.row.rCard;
    this.reporting = this.row.reportAvaiPDPEnabled;
  },
  watch: {
    rCard(val) {
      this.rCardMounted
        ? this.$emit('rCard', { id: this.row.workflowId, value: val })
        : (this.rCardMounted = true);
    },
    reporting(val) {
      this.reportingMounted
        ? this.$emit('reporting', { id: this.row.workflowId, value: val })
        : (this.reportingMounted = true);
    },
  },
  methods: {
    yesOrNo(element) {
      return get(this.row, element) ? this.$t('common.YES') : this.$t('common.NO');
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  > td {
    font-size: 0.9rem;
    font-weight: normal;
    padding: 10px;
    border-top: 1px solid #dee2e6;
    font-size: 1rem;

    tr {
      width: 100%;
      display: block;

      td {
        width: 100%;
        display: block;
        border: none;

        tr td {
          display: inline-block;
          width: 33%;
          border: none;
          text-align: center;
        }
      }
    }
  }
}
</style>
