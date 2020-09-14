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
      <div v-if="advancedIndicators" class="card mt-2">
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
import { mapGetters } from 'vuex';

export default {
  name: 'CoachpanelIndicators',
  components: {
    CoachPanelndicatorItem,
  },
  props: {
    apId: Number,
  },

  async mounted() {
    if (!this.apId) {
      this.apiError = true;
      this.$emit('apiError');
    }

    if (this.havePermission('getVision', 'read')) {
      this.advancedIndicators = [
        {
          id: 'ai_1',
          title: 'coach.indicators.localityTest',
        },
        {
          id: 'ai_3',
          title: 'coach.indicators.cellAnalysis',
        },
        {
          id: 'ai_5',
          title: 'coach.indicators.networkDetectionTest',
        },
        {
          id: 'i_7',
          title: 'coach.indicators.lastUsageAnalysis',
        },
      ];
    }
    this.coachData = await startAnalysis(this.apId);
    if (this.coachData) {
      this.standardsIndicators = this.standardsIndicators.map(i => {
        switch (i.title) {
          case 'coach.indicators.lineStatus': {
            i.subTitle = this.coachData.simcardTrafficAllowedTest;
            i.checked = this.coachData.simcardTrafficAllowedTestSuccess;
            break;
          }
          case 'coach.indicators.testData': {
            i.subTitle = this.coachData.dataTrafficAllowedTest;
            i.checked = this.coachData.dataTrafficAllowedTestSuccess;
            break;
          }
          case 'coach.indicators.networkTest': {
            i.subTitle = this.coachData.simcardAlreadyConnectedTest;
            i.checked = this.coachData.simcardAlreadyConnectedTestSuccess;
            break;
          }
          case 'coach.indicators.ipAssign': {
            i.subTitle = this.coachData.alreadyAssignedIPAdressTest;
            i.checked = this.coachData.alreadyAssignedIPAdressTestSuccess;
            break;
          }
          case 'coach.indicators.isPowered': {
            i.subTitle = this.coachData.devicePoweredTest;
            i.checked = this.coachData.devicePoweredTestSuccess;
            break;
          }
          case 'coach.indicators.isTraced': {
            i.subTitle = this.coachData.localisation;
            i.checked = this.coachData.localisationSuccess;
            break;
          }
        }
        return i;
      });

      if (this.advancedIndicators) {
        this.advancedIndicators = this.advancedIndicators.map(i => {
          switch (i.title) {
            case 'coach.indicators.localityTest': {
              i.subTitle = this.coachData.linesLocalityTest;
              i.checked = this.coachData.linesLocalityTestSuccess;
              break;
            }
            case 'coach.indicators.cellAnalysis': {
              i.subTitle = this.coachData.linesCellTest;
              i.checked = this.coachData.linesCellTestSuccess;
              break;
            }
            case 'coach.indicators.networkDetectionTest': {
              i.subTitle = this.coachData.lastNetworkDetectionTest;
              i.checked = this.coachData.lastNetworkDetectionTestSuccess;
              break;
            }
            case 'coach.indicators.lastUsageAnalysis': {
              i.subTitle = this.coachData.lastUsageInformation;
              i.checked = this.coachData.lastUsageInformationSuccess;
              break;
            }
          }
          return i;
        });
      }
    } else {
      this.apiError = true;
      this.$emit('apiError');
    }
  },
  computed: {
    ...mapGetters(['havePermission']),
  },
  data() {
    return {
      coachData: undefined,
      apiError: false,
      standardsIndicators: [
        {
          id: 'i_2',
          title: 'coach.indicators.lineStatus',
          // subTitle: '250 Cartes SIM détéctées',
          // checked: true,
        },
        {
          id: 'i_4',
          title: 'coach.indicators.testData',
        },
        {
          id: 'i_6',
          title: 'coach.indicators.networkTest',
        },
        {
          id: 'i_8',
          title: 'coach.indicators.ipAssign',
        },
        {
          id: 'i_9',
          title: 'coach.indicators.isPowered',
        },
        {
          id: 'i_10',
          title: 'coach.indicators.isTraced',
        },
      ],
      advancedIndicators: undefined,
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
