<template>
  <LoaderContainer :is-loading="loadingGeoloc" loading-key="loading">
    <div slot="on-loading">
      <LineAnalysisSkeleton />
    </div>
    <div class="row">
      <div class="col-md-5">
        <div>
          <h4 class="text-primary text-uppercase">
            {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.locationSection') }}
          </h4>
          <LocalisationBlock :data="geographicalLocation" />
        </div>
      </div>
      <div class="col-md-7">
        <div>
          <h4 class="text-primary text-uppercase">
            {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.lastConnectionStatus') }}
          </h4>
          <div class="bg-white p-4 rounded">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionStatus') }}:</h6>
                <p>{{ getConnectionStatus() }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>
                  {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.closingConnexionReason') }}:
                </h6>
                <p>{{ getClosingReason() }}</p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionDebut') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'startDate') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionEnd') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'endDate') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="text-primary text-uppercase">
            {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.ApnIdLastConnexion') }}
          </h4>
          <div class="bg-white p-4 rounded">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentApn') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'apn') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.IPType') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'ipAddressTypeTranslated') }}</p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv4Address') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'ipV4Address') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv6Address') }}:</h6>
                <p>{{ getValue(pdpConnexionData, 'ipV6Address') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h4 class="text-primary text-uppercase">
          {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.LastLocation') }}
        </h4>
        <div class="bg-white p-4 rounded">
          <div class="d-flex">
            <div class="item">
              <h6>
                {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.geographicalCoordinates') }}:
              </h6>
              <p>{{ getValue(geographicalLocation, 'geographicalCoordinates') }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.lastLocationDate') }}:</h6>
              <p>{{ getValue(geographicalLocation, 'lastCommunicationDate') }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.useTypeAndDetail') }}:</h6>
              <p>{{ getValue(geographicalLocation, 'usageDetailsByDirection') }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.technology') }}:</h6>
              <p>
                {{
                  $t('getparc.lineDetail.tab2.lineAnalysisContent.technologies', {
                    value: technology,
                  })
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center pt-2 mt-3 mb-3">
        <div>
          <Toggle
            v-if="toggleValues"
            no-default
            @update="selectedAnalzeTab = $event"
            :values="toggleValues"
            class="pl-2"
          ></Toggle>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col">
        <AnalyzeTable
          v-if="selectedAnalzeTab && selectedAnalzeTab.id === 'localisation'"
          :key="selectedAnalzeTab.id"
          :line="content"
          localisation-type="CP"
        />
        <AnalyzeTable
          v-if="selectedAnalzeTab && selectedAnalzeTab.id === 'cell'"
          :key="selectedAnalzeTab.id"
          :line="content"
          localisation-type="CELL"
        />
      </div>
    </div>
  </LoaderContainer>
</template>

<script>
import Toggle from '@/components/ui/UiToggle2';
import AnalyzeTable from './AnalyzeTable';
import LoaderContainer from '@/components/LoaderContainer';

import { dataUsage } from '@/api/consumption';
import { lastGeographicalLocation } from '@/api/geographicalLocation';
import get from 'lodash.get';
import LocalisationBlock from './LocalisationBlock';
import LineAnalysisSkeleton from './LineAnalysisSkeleton';

export default {
  components: {
    LocalisationBlock,
    Toggle,
    AnalyzeTable,
    LoaderContainer,
    LineAnalysisSkeleton,
  },
  data() {
    return {
      pdpConnexionData: undefined,
      geographicalLocation: undefined,
      loadingGeoloc: false,
      selectedAnalzeTab: undefined,
      toggleValues: [
        {
          id: 'localisation',
          label: 'getparc.lineDetail.tab3.analyzeLocation',
          default: false,
        },
        {
          id: 'cell',
          label: 'getparc.lineDetail.tab3.analyzeCell',
          default: false,
        },
      ],
    };
  },

  props: {
    content: Object,
  },
  async mounted() {
    if (this.getValue(this.content, 'id')) {
      this.loadingGeoloc = true;
      const pdpResponse = await dataUsage(this.getValue(this.content, 'id'), { page: 0, limit: 1 });
      if (pdpResponse && pdpResponse.items && pdpResponse.items.length) {
        this.pdpConnexionData = {
          ...pdpResponse.items[0],
          ...pdpResponse.items[0].pdpConnectionDateInfo,
          ...pdpResponse.items[0].pdpConnectionHistory,
        };
      }
      this.geographicalLocation = await lastGeographicalLocation(this.getValue(this.content, 'id'));
      this.loadingGeoloc = false;
    }
  },
  methods: {
    getValue(objectToUse, path, defaultValue = '') {
      if (objectToUse == null || objectToUse == undefined) {
        return '-';
      }
      const value = get(objectToUse, path, defaultValue);
      return value !== null ? value : '-';
    },
    getConnectionStatus() {
      const connectionStatus = this.getValue(this.pdpConnexionData, 'connectionStatusTranslated');
      if (connectionStatus === '-') return '-';
      return connectionStatus;
    },
    getClosingReason() {
      const connectionClosingReason = this.getValue(
        this.pdpConnexionData,
        'connectionClosingReasonTranslated'
      );
      if (connectionClosingReason === '-') return '-';
      return connectionClosingReason;
    },
  },
  computed: {
    technology() {
      if (!this.geographicalLocation) return '-';
      return this.getValue(this.geographicalLocation, 'ticketGenerationTranslated');
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  p {
    font-size: 0.8rem;
  }
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
