<template>
  <div>
    <template v-if="apiError">
      <div class="mt-2 alert alert-danger">
        {{ $t('coach.apiError') }}
      </div>
    </template>
    <template v-else>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ $t('getparc.lineDetail.standardTest') }}</h5>
          <ul v-if="standardsIndicators" class="list-group list-group-flush">
            <CoachPanelndicatorItem
              v-for="i in standardsIndicators"
              :key="i.id"
              :indicator="i"
              :error="apiError"
            />
          </ul>
        </div>
      </div>
      <div class="card mt-2">
        <div class="card-body">
          <h5 class="card-title">{{ $t('getparc.lineDetail.advancedTest') }}</h5>
          <ul v-if="advancedIndicators" class="list-group list-group-flush">
            <CoachPanelndicatorItem
              v-for="i in advancedIndicators"
              :key="i.id"
              :indicator="i"
              :error="apiError"
            />
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CoachPanelndicatorItem from './CoachPanelndicatorItem';
import { startAnalysis } from '@/api/coach';

export default {
  name: 'CoachpanelIndicators',
  components: {
    CoachPanelndicatorItem,
  },
  props: {
    apId: Number,
  },
  async mounted() {
    this.coachData = await startAnalysis(this.apId);
    if (this.coachData) {
      this.standardsIndicators = this.standardsIndicators.map(i => {
        switch (i.title) {
          case 'getparc.lineDetail.lineStatus': {
            i.subTitle = this.coachData.simcardTrafficAllowedTest;
            i.checked = this.coachData.simcardTrafficAllowedTestSuccess;
            break;
          }
          case 'getparc.lineDetail.testData': {
            i.subTitle = this.coachData.dataTrafficAllowedTest;
            i.checked = this.coachData.dataTrafficAllowedTestSuccess;
            break;
          }
          case 'getparc.lineDetail.networkTest': {
            i.subTitle = this.coachData.simcardAlreadyConnectedTest;
            i.checked = this.coachData.simcardAlreadyConnectedTestSuccess;
            break;
          }
          case 'getparc.lineDetail.ipAssign': {
            i.subTitle = this.coachData.alreadyAssignedIPAdressTest;
            i.checked = this.coachData.alreadyAssignedIPAdressTestSuccess;
            break;
          }
        }
        return i;
      });

      this.advancedIndicators = this.advancedIndicators.map(i => {
        switch (i.title) {
          case 'getparc.lineDetail.localityTest': {
            i.subTitle = this.coachData.linesLocalityTest;
            i.checked = this.coachData.linesLocalityTestSuccess;
            break;
          }
          case 'getparc.lineDetail.cellAnalysis': {
            i.subTitle = this.coachData.linesCellTest;
            i.checked = this.coachData.linesCellTestSuccess;
            break;
          }
          case 'getparc.lineDetail.networkDetectionTest': {
            i.subTitle = this.coachData.lastNetworkDetectionTest;
            i.checked = this.coachData.lastNetworkDetectionTestSuccess;
            break;
          }
          case 'getparc.lineDetail.lastUsageAnalysis': {
            i.subTitle = this.coachData.lastUsageInformation;
            i.checked = this.coachData.lastUsageInformationSuccess;
            break;
          }
        }
        return i;
      });
    } else {
      this.apiError = true;
      this.$emit('apiError');
    }
  },
  data() {
    return {
      coachData: undefined,
      apiError: false,
      standardsIndicators: [
        {
          id: 'i_2',
          title: 'getparc.lineDetail.lineStatus',
          // subTitle: '250 Cartes SIM détéctées',
          // checked: true,
        },
        {
          id: 'i_4',
          title: 'getparc.lineDetail.testData',
        },
        {
          id: 'i_6',
          title: 'getparc.lineDetail.networkTest',
        },
        {
          id: 'i_8',
          title: 'getparc.lineDetail.ipAssign',
        },
      ],
      advancedIndicators: [
        {
          id: 'ai_1',
          title: 'getparc.lineDetail.localityTest',
        },
        {
          id: 'ai_3',
          title: 'getparc.lineDetail.cellAnalysis',
        },
        {
          id: 'ai_5',
          title: 'getparc.lineDetail.networkDetectionTest',
        },
        {
          id: 'i_7',
          title: 'getparc.lineDetail.lastUsageAnalysis',
        },
      ],
    };
  },
};
</script>

<style scoped>
h5 {
  font-size: 1rem;
  font-weight: 400;
}
.card-title {
  text-transform: uppercase;
}
</style>
