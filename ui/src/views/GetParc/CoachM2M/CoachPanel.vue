<template>
  <BaseDetailPanelContent>
    <div class="row indicators-line">
      <div class="col left-side">
        <h5 v-if="compareMode">{{ $t('coach.currentLine', { lineId: content.id }) }}</h5>
        <CoachPanelIndicatorsRunner
          :key="testNumber"
          :ap-id="line1ApId"
          @apiError="canCompare = false"
        />
      </div>
      <div v-if="compareMode" class="col">
        <h5 v-if="compareMode">
          <template v-if="line2"
            >{{ $t('coach.compareLine', { lineId: line2.id }) }}
          </template>
          <template v-else>
            {{ $t('coach.chooseLine') }}
          </template>
        </h5>

        <SearchLineWithResults v-if="!line2" v-slot:default="{ selectedLine }">
          <UiButton variant="primary" @click.stop="() => startComparison(selectedLine)" block>{{
            $t('coach.testLine')
          }}</UiButton>
        </SearchLineWithResults>
        <CoachPanelIndicatorsRunner v-else :ap-id="line2ApId" />
      </div>
    </div>
    <div slot="footer" class="action-buttons" v-if="canCompare">
      <template v-if="!compareMode">
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
            <UiButton variant="import" block @click.stop="cancelComparison">{{
              $t('coach.cancelTest')
            }}</UiButton>
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

export default {
  components: {
    BaseDetailPanelContent,
    CoachPanelIndicatorsRunner,
    UiButton,
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
    };
  },
  methods: {
    startCompare() {
      this.$emit('setWidth', '60%');
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
  },

  computed: {
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
