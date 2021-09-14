<template>
  <div>
    <template v-if="apiError">
      <div class="mt-2 alert alert-danger">
        {{ $t('coach.apiError') }}
      </div>
    </template>
    <template v-else>
      <div v-if="coachData" :key="'coach_index' + version" class="card mb-2">
        <div class="card-body">
          <h5 class="card-title">Indice de réussite</h5>

          <StarsNotation :checked="successRating" />
          <span>
            {{ $t('coach.coachNotation', { updateDate: coachData.updateDate }) }}
          </span>
        </div>
      </div>
      <div :key="'coach_item_std' + version" class="card">
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
      <div :key="'coach_item_adv' + version" v-if="advancedIndicators" class="card mt-2">
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
import StarsNotation from '@/components/StarsNotation.vue';

export default {
  name: 'CoachpanelIndicators',
  components: {
    CoachPanelndicatorItem,
    StarsNotation,
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
          action: {
            title: 'getparc.lineDetail.tab2.lineAnalysis',
            tooltip: 'getparc.lineDetail.tab3.analyzeLocation',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.analysis',
                  params: { lineId: this.$route.params.lineId, analyzeLocation: true },
                })
                .catch(() => { });
            },
          },
        },
        {
          id: 'ai_3',
          title: 'coach.indicators.cellAnalysis',
          action: {
            title: 'getparc.lineDetail.tab2.lineAnalysis',
            tooltip: 'getparc.lineDetail.tab3.analyzeCell',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.analysis',
                  params: { lineId: this.$route.params.lineId, cellAnalysis: true },
                })
                .catch(() => { });
            },
          },
        },
        {
          id: 'ai_5',
          title: 'coach.indicators.networkDetectionTest',
          action: {
            title: 'coach.indicators.history',
            tooltip: 'coach.indicators.showSupervision',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.supervision',
                  params: { lineId: this.$route.params.lineId },
                })
                .catch(() => { });
            },
          },
        },
        {
          id: 'i_7',
          title: 'coach.indicators.lastUsageAnalysis',
          //
          action: {
            title: 'getparc.lineDetail.tab2.lineAnalysis',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.analysis',
                  params: { lineId: this.$route.params.lineId },
                })
                .catch(() => { });
            },
          },
        },
      ];
    }
    this.coachData = await startAnalysis(this.apId);
    this.$emit('coachData', this.coachData);
    let successRating = 0;
    if (this.coachData) {
      this.standardsIndicators = this.standardsIndicators.map((i) => {
        switch (i.title) {
          case 'coach.indicators.lineStatus': {
            i.subTitle = this.coachData.simcardTrafficAllowedTest;
            i.checked = this.coachData.simcardTrafficAllowedTestSuccess;
            successRating += i.checked ? 1 : 0;
            break;
          }
          case 'coach.indicators.testData': {
            i.subTitle = this.coachData.dataTrafficAllowedTest;
            i.checked = this.coachData.dataTrafficAllowedTestSuccess;
            successRating += i.checked ? 1 : 0;
            break;
          }
          case 'coach.indicators.networkTest': {
            i.subTitle = this.coachData.simcardAlreadyConnectedTest;
            i.checked = this.coachData.simcardAlreadyConnectedTestSuccess;
            successRating += i.checked ? 1 : 0;
            break;
          }
          case 'coach.indicators.ipAssign': {
            i.subTitle = this.coachData.alreadyAssignedIPAdressTest;
            i.checked = this.coachData.alreadyAssignedIPAdressTestSuccess;
            successRating += i.checked ? 1 : 0;
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

      this.successRating = successRating;

      if (this.advancedIndicators) {
        this.advancedIndicators = this.advancedIndicators.map((i) => {
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

      this.version += 1;
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
      successRating: 0,
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
          showActionFn: () => {
            return this.havePermission('getVision', 'read');
          },
          action: {
            title: 'coach.indicators.traceConso',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.networkTestControl',
                  params: { lineId: this.$route.params.lineId, createTestRequest: true },
                })
                .catch(() => { });
            },
          },
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
          showActionFn: () => {
            return this.havePermission('getVision', 'read');
          },
          action: {
            title: 'coach.indicators.linePing',
            onClick: () => {
              this.$router
                .push({
                  name: 'lineDetail.diagnosis.networkStatus',
                  params: { lineId: this.$route.params.lineId, createPingRequest: true },
                })
                .catch(() => { });
            },
          },
        },
      ],
      advancedIndicators: undefined,
      version: 0,
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
