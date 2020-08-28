<template>
  <div>
    <LoaderContainer :is-loading="isLoading">
      <div slot="on-loading">
        <LastTestSkeleton />
      </div>

      <template v-if="coachData">
        <ContentBlock>
          <template slot="title">{{ $t('getparc.lineDetail.standardTest') }}</template>
          <template slot="content">
            <div class="row">
              <div class="col">
                <CoachIndicator
                  label="getparc.lineDetail.lineStatus"
                  :value="coachData.simcardTrafficAllowedTest"
                  :success="coachData.simcardTrafficAllowedTestSuccess"
                />
              </div>
              <div class="col">
                <CoachIndicator
                  label="getparc.lineDetail.testData"
                  :value="coachData.dataTrafficAllowedTest"
                  :success="coachData.dataTrafficAllowedTestSuccess"
                />
              </div>
              <div class="col">
                <CoachIndicator
                  label="getparc.lineDetail.networkTest"
                  :value="coachData.simcardAlreadyConnectedTest"
                  :success="coachData.simcardAlreadyConnectedTestSuccess"
                />
              </div>
              <div class="col">
                <CoachIndicator
                  label="getparc.lineDetail.ipAssign"
                  :value="coachData.alreadyAssignedIPAdressTest"
                  :success="coachData.alreadyAssignedIPAdressTestSuccess"
                />
              </div>
            </div>
          </template>
        </ContentBlock>
        <permission domain="getVision" action="read">
          <ContentBlock>
            <template slot="title">{{ $t('getparc.lineDetail.advancedTest') }}</template>
            <template slot="content">
              <div class="row">
                <div class="col">
                  <CoachIndicator
                    label="getparc.lineDetail.localityTest"
                    :value="coachData.linesLocalityTest"
                    :success="coachData.linesLocalityTestSuccess"
                  />
                </div>
                <div class="col">
                  <CoachIndicator
                    label="getparc.lineDetail.cellAnalysis"
                    :value="coachData.linesCellTest"
                    :success="coachData.linesCellTestSuccess"
                  />
                </div>
                <div class="col">
                  <CoachIndicator
                    label="getparc.lineDetail.networkDetectionTest"
                    :value="coachData.lastNetworkDetectionTest"
                    :success="coachData.lastNetworkDetectionTestSuccess"
                  />
                </div>
                <div class="col">
                  <CoachIndicator
                    label="getparc.lineDetail.lastUsageAnalysis"
                    :value="coachData.lastUsageInformation"
                    :success="coachData.lastUsageInformationSuccess"
                  />
                </div>
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

import { findCoach } from '@/api/coach.js';

import get from 'lodash.get';

export default {
  components: {
    ContentBlock,
    CoachIndicator,
    LoaderContainer,
    LastTestSkeleton,
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
};
</script>

<style lang="scss" scoped></style>
