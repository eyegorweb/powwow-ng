<template>
  <BaseDetailPanelContent>
    <div class="row indicators-line">
      <div class="col left-side">
        <h5 v-if="compareMode">{{ $t('coach.currentLine', { lineId: content.msisdn }) }}</h5>
        <CoachPanelIndicatorsRunner
          :key="testNumber"
          :ap-id="line1ApId"
          :line-infos="content"
          @apiError="canCompare = false"
          @coachData="line1CoachData = $event"
        />
      </div>
      <div v-if="compareMode" class="col">
        <h5 v-if="compareMode">
          <template v-if="line2">{{ $t('coach.compareLine', { lineId: line2.id }) }} </template>
          <template v-else>
            {{ $t('coach.chooseLine') }}
          </template>
        </h5>

        <SearchLineWithResults
          v-if="!line2"
          @singleResult="startComparison($event)"
          v-slot="{ selectedLine, foundSingleResult }"
        >
          <UiButton
            v-if="!foundSingleResult"
            variant="primary"
            @click.stop="() => startComparison(selectedLine)"
            block
          >
            {{ $t('coach.testLine') }}
          </UiButton>
        </SearchLineWithResults>
        <CoachPanelIndicatorsRunner
          v-else
          :ap-id="line2ApId"
          @coachData="line2CoachData = $event"
        />
      </div>
    </div>
    <div slot="footer" class="action-buttons" v-if="canCompare">
      <template v-if="!compareMode">
        <div class="p-0" v-if="exportOptions">
          <UiDropDownChoicesButton
            :options="exportOptions"
            @click="doExport($event, [line1CoachData.id])"
            :menu-style="dropMenuStyle"
          >
            <span>{{ $t('export') }}</span>
          </UiDropDownChoicesButton>
        </div>
        <div>
          <UiButton variant="import" block @click="testNumber++">{{ $t('coach.reTest') }}</UiButton>
        </div>
        <div>
          <UiButton variant="primary" @click="startCompare" block>{{
            $t('coach.compare')
          }}</UiButton>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-6">
            <div class="row p-0">
              <div class="col-5 p-0">
                <div class="p-0 pl-1" v-if="exportOptions && line2CoachData">
                  <UiDropDownChoicesButton
                    :options="exportOptions"
                    @click="doExport($event, [line1CoachData.id, line2CoachData.id])"
                    :menu-style="dropMenuStyle"
                  >
                    <span>{{ $t('export') }}</span>
                  </UiDropDownChoicesButton>
                </div>
              </div>
              <div class="col-7">
                <UiButton variant="import" block @click.stop="cancelComparison">{{
                  $t('coach.cancelTest')
                }}</UiButton>
              </div>
            </div>
          </div>
          <div class="col-6" v-if="line2">
            <UiButton variant="primary" block @click.stop="line2 = undefined">{{
              $t('coach.compareOther')
            }}</UiButton>
          </div>
        </div>
      </template>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import CoachPanelIndicatorsRunner from './CoachPanelIndicatorsRunner';
import UiButton from '@/components/ui/Button';
import SearchLineWithResults from './SearchLineWithResults';
import get from 'lodash.get';
import { simpleExport, advancedExport } from '@/api/coach';
import { mapMutations, mapGetters } from 'vuex';
import { getBaseURL } from '@/utils.js';
import UiDropDownChoicesButton from '@/components/ui/UiDropDownChoicesButton';

export default {
  components: {
    BaseDetailPanelContent,
    CoachPanelIndicatorsRunner,
    UiButton,
    UiDropDownChoicesButton,
    SearchLineWithResults,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      line1: undefined,
      line2: undefined,
      compareMode: false,
      canCompare: true,
      testNumber: 0,
      line1CoachData: undefined,
      line2CoachData: undefined,
      exportOptions: undefined,
      dropMenuStyle: {
        position: 'absolute',
        'will-change': 'transform',
        top: '0px',
        left: '0px',
        transform: 'translate3d(0px, -5.4rem, 0px)',
      },
    };
  },
  mounted() {
    if (this.havePermission('getParc', 'manage_supervision')) {
      this.exportOptions = ['coach.simpleExport', 'coach.advancedExport'];
    } else {
      this.exportOptions = ['coach.simpleExport'];
    }
  },
  methods: {
    ...mapMutations(['flashMessage', 'startDownload']),
    startCompare() {
      this.$emit('setWidth', '68%');
      this.line2 = undefined;
      this.compareMode = true;
    },
    startComparison(selectedLine) {
      this.line2 = selectedLine;
    },
    cancelComparison() {
      this.$emit('setWidth', '30%');
      this.compareMode = false;
      this.line2 = undefined;
    },

    async doExport(exportType, ids) {
      try {
        let downloadResponse;
        if (exportType === 'coach.simpleExport') {
          downloadResponse = await simpleExport(ids);
        } else {
          downloadResponse = await advancedExport(ids);
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

  computed: {
    ...mapGetters(['havePermission']),

    line1ApId() {
      return get(this.content, 'accessPoint.id');
    },
    line2ApId() {
      return get(this.line2, 'accessPoint.id');
    },
  },
};
</script>

<style lang="scss" scoped>
.half-size {
  width: 50%;
}

.indicators-line {
  padding-left: 15px;
  padding-right: 15px;

  h5 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .col {
    padding: 0;
  }

  .left-side {
    margin-right: 15px;
  }
}
</style>
