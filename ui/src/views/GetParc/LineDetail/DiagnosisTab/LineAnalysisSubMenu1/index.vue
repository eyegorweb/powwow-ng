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
                <p>{{ getValue(geographicalLocation, 'pdpConnectionStatus') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>
                  {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.closingConnexionReason') }}:
                </h6>
                <p>{{ getValue(geographicalLocation, 'connectionClosingReason') }}</p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionDebut') }}:</h6>
                <p>{{ getValue(geographicalLocation, 'pdpConnectionStartDate') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionEnd') }}:</h6>
                <p>{{ getValue(geographicalLocation, 'pdpConnectionEndDate') }}</p>
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
                <p>{{ getValue(geographicalLocation, 'apn') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.IPType') }}:</h6>
                <p>{{ getValue(geographicalLocation, 'ipAddressType') }}</p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv4Address') }}:</h6>
                <p>{{ getValue(geographicalLocation, 'ipV4Address') }}</p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv6Address') }}:</h6>
                <p>{{ getValue(geographicalLocation, 'ipV6Address') }}</p>
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
              <LineCoordinate :geographical-location="geographicalLocation" />
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

import { lastGeographicalLocation } from '@/api/geographicalLocation';
import get from 'lodash.get';
import LocalisationBlock from './LocalisationBlock';
import LineAnalysisSkeleton from './LineAnalysisSkeleton';

import LineCoordinate from '@/views/GetParc/LineDetail/DiagnosisTab/LineAnalysisSubMenu1/LineCoordinate.vue';

export default {
  components: {
    LocalisationBlock,
    Toggle,
    AnalyzeTable,
    LoaderContainer,
    LineAnalysisSkeleton,
    LineCoordinate,
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

      this.geographicalLocation = await lastGeographicalLocation(this.getValue(this.content, 'id'));

      this.loadingGeoloc = false;
    }

    if (this.$route.params.cellAnalysis) {
      this.selectedAnalzeTab = this.toggleValues[1];
      this.selectedAnalzeTab.default = true;
    }

    if (this.$route.params.analyzeLocation) {
      this.selectedAnalzeTab = this.toggleValues[0];
      this.selectedAnalzeTab.default = true;
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
