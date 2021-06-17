<template>
  <div>
    <LoaderContainer :is-loading="isLoading">
      <div slot="on-loading">
        <LastTestSkeleton />
      </div>

      <template v-if="coachData">
        <div class="row">
          <div class="col">
            <permission domain="getParc" action="manage_supervision">
              <UiButton
                variant="link"
                class="export-link"
                @click="doExport('coach.advancedExport')"
              >
                {{ $t('coach.advancedExport') }}
              </UiButton>
            </permission>
            <UiButton variant="link" class="export-link" @click="doExport('coach.simpleExport')">
              {{ $t('coach.simpleExport') }}
            </UiButton>
          </div>
        </div>
        <ContentBlock>
          <template slot="title">{{ $t('getparc.lineDetail.standardTest') }}</template>
          <template slot="content">
            <div class="coach-container">
              <CoachIndicator
                label="coach.indicators.lineStatus"
                :value="coachData.simcardTrafficAllowedTest"
                :success="coachData.simcardTrafficAllowedTestSuccess"
              />
              <CoachIndicator
                label="coach.indicators.testData"
                :value="coachData.dataTrafficAllowedTest"
                :success="coachData.dataTrafficAllowedTestSuccess"
              />
              <CoachIndicator
                label="coach.indicators.networkTest"
                :value="coachData.simcardAlreadyConnectedTest"
                :success="coachData.simcardAlreadyConnectedTestSuccess"
              />
              <CoachIndicator
                label="coach.indicators.ipAssign"
                :value="coachData.alreadyAssignedIPAdressTest"
                :success="coachData.alreadyAssignedIPAdressTestSuccess"
              />
              <CoachIndicator
                label="coach.indicators.isPowered"
                :value="coachData.devicePoweredTest"
                :success="coachData.devicePoweredTestSuccess"
              />
              <CoachIndicator
                label="coach.indicators.isTraced"
                :value="coachData.localisation"
                :success="coachData.localisationSuccess"
              />
            </div>
          </template>
        </ContentBlock>
        <permission domain="getVision" action="read">
          <ContentBlock>
            <template slot="title">{{ $t('getparc.lineDetail.advancedTest') }}</template>
            <template slot="content">
              <div class="coach-container">
                <CoachIndicator
                  label="coach.indicators.localityTest"
                  :value="coachData.linesLocalityTest"
                  :success="coachData.linesLocalityTestSuccess"
                />
                <CoachIndicator
                  label="coach.indicators.cellAnalysis"
                  :value="coachData.linesCellTest"
                  :success="coachData.linesCellTestSuccess"
                />
                <CoachIndicator
                  label="coach.indicators.networkDetectionTest"
                  :value="coachData.lastNetworkDetectionTest"
                  :success="coachData.lastNetworkDetectionTestSuccess"
                />
                <CoachIndicator
                  label="coach.indicators.lastUsageAnalysis"
                  :value="coachData.lastUsageInformation"
                  :success="coachData.lastUsageInformationSuccess"
                />
              </div>
            </template>
          </ContentBlock>
        </permission>

        <div class="update-date">{{ $t('lastUpdate') }} {{ coachData.updateDate }}</div>
      </template>
      <div v-else class="alert alert-light m-0" role="alert">
        {{ $t('getparc.lineDetail.noCoach') }}
      </div>
    </LoaderContainer>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import CoachIndicator from './CoachIndicator';
import LastTestSkeleton from './LastTestSkeleton';
import LoaderContainer from '@/components/LoaderContainer';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';
import { getBaseURL } from '@/utils.js';

import { findCoach, simpleExport, advancedExport } from '@/api/coach.js';

import get from 'lodash.get';

export default {
  components: {
    ContentBlock,
    CoachIndicator,
    LoaderContainer,
    LastTestSkeleton,
    UiButton,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      coachData: undefined,
      isLoading: true,
    };
  },

  async mounted() {
    const apID = get(this.content, 'accessPoint.id');
    if (apID) {
      this.coachData = await findCoach(apID);
    }
    this.isLoading = false;
  },

  methods: {
    ...mapMutations(['flashMessage', 'startDownload']),

    async doExport(exportType) {
      try {
        let downloadResponse;
        if (exportType === 'coach.simpleExport') {
          downloadResponse = await simpleExport([this.coachData.id]);
        } else {
          downloadResponse = await advancedExport([this.coachData.id]);
        }
        if (downloadResponse && downloadResponse.downloadUri) {
          this.startDownload(getBaseURL() + downloadResponse.downloadUri);
        }
      } catch (e) {
        console.log(e);
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.coach-container {
  display: flex;
  flex-wrap: wrap;

  & > div {
    flex-basis: 50%;
  }
}
</style>
