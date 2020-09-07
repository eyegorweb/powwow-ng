<template>
  <WidgetBloc title-grow large :scrolling="!!coachData" :widget="widget">
    <div v-if="coachData" slot="header">
      <div class="d-flex return-btn">
        <button @click.prevent="returnToSearch()" class="btn btn-link back-btn p-0">
          <i class="ic-Arrow-Previous-Icon" />
          {{ $t('back') }}
        </button>
      </div>
    </div>
    <transition name="my-anim">
      <SearchLineWithResults v-if="!coachData" @choice="startDiagnosis" />
      <template v-if="apiError">
        <div class="mt-2 alert alert-danger">
          {{ $t('coach.apiError') }}
        </div>
      </template>
      <div v-if="coachData">
        <UiTabs :tabs="tabs" :selected-index="currentTab">
          <template slot-scope="{ tab, index, selectedIndex }">
            <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
              <a href="#" @click.prevent="() => (currentTab = index)">{{ tab.title }}</a>
            </UiTab>
          </template>
          <div class="pt-4 pl-4" slot="standardTest">
            <ul v-if="standardsIndicators" class="list-group list-group-flush">
              <CoachPanelndicatorItem
                v-for="i in standardsIndicators"
                :key="i.id"
                :indicator="i"
                :no-animation="nbStandardsEndedAnimations >= standardsIndicators.length"
                @animationEnd="nbStandardsEndedAnimations += 1"
              />
            </ul>
          </div>
          <div v-if="advancedIndicators" slot="advancedTest">
            <ul class="list-group list-group-flush">
              <CoachPanelndicatorItem
                v-for="i in advancedIndicators"
                :key="i.id"
                :indicator="i"
                :no-animation="nbAdvancedEndedAnimations >= nbAdvancedEndedAnimations.length"
                @animationEnd="nbAdvancedEndedAnimations += 1"
              />
            </ul>
          </div>
        </UiTabs>
      </div>
    </transition>
  </WidgetBloc>
</template>

<script>
import SearchLineWithResults from '@/views/GetParc/CoachM2M/SearchLineWithResults.vue';
import CoachPanelndicatorItem from '@/views/GetParc/CoachM2M/CoachPanelndicatorItem.vue';
import WidgetBloc from '../WidgetBloc';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import { startAnalysis } from '@/api/coach';
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  components: {
    SearchLineWithResults,
    CoachPanelndicatorItem,
    WidgetBloc,
    UiTabs,
    UiTab,
  },

  props: {
    widget: Object,
    contextFilters: Array,
  },

  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          label: 'standardTest',
          title: this.$t('getparc.lineDetail.standardTest'),
        },
        {
          label: 'advancedTest',
          title: this.$t('getparc.lineDetail.advancedTest'),
        },
      ],
      coachData: undefined,
      apiError: false,
      standardsIndicators: [
        {
          id: 'i_2',
          title: 'coach.indicators.lineStatus',
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

      nbStandardsEndedAnimations: 0,
      nbAdvancedEndedAnimations: 0,
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
  },

  methods: {
    returnToSearch() {
      this.coachData = undefined;
    },
    async startDiagnosis(line) {
      console.log('Start diagnosis >>>>> ', line);
      const apId = get(line, 'accessPoint.id');
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
      this.coachData = await startAnalysis(apId);
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
a {
  text-transform: uppercase;
}

.search-section {
  position: relative;
  overflow: hidden;
}

.my-anim-enter-active,
.my-anim-leave-active {
  transition: all 0.5s;
}
.my-anim-enter,
.my-anim-leave-active {
  opacity: 0;
}
.my-anim-enter {
  transform: translateX(31px);
}
.my-anim-leave-active {
  transform: translateX(-31px);
  display: none;
}

.return-btn {
  align-items: flex-end;
}
</style>
