<template>
  <div>
    <ContentBlock no-handle>
      <template slot="title">{{ $t('getadmin.partners.m2mRange.title') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col-4">
            <div class="mt-2">
              <UiToggle
                :label="$t('getadmin.partners.m2mRange.active')"
                v-model="activeMsisdnRange"
                small-label
                :on-text="$t('common.YES')"
                :off-text="$t('common.NO')"
                :editable="false"
              />
            </div>
            <div class="mt-4">
              <UiToggle
                :label="$t('getadmin.partners.m2mRange.locked')"
                v-model="lockedMsisdnRange"
                small-label
                :on-text="$t('common.YES')"
                :off-text="$t('common.NO')"
                :editable="false"
              />
            </div>
            <div class="mt-4">
              <div class="third-size pr-4">
                <div class="form-group">
                  <label class="small-label">{{ $t('getadmin.partners.m2mRange.code') }}</label>
                  <UiInput v-model="rangeCode" block />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>
    <ContentBlock no-handle>
      <template slot="title">{{ $t('getadmin.partners.m2mRange.counters') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col">
            <StaticValue :label="$t('getadmin.partners.m2mRange.available')">
              {{ partner.MSISDNRangeCounterAvailables }}
            </StaticValue>
            <StaticValue :label="$t('getadmin.partners.m2mRange.quarantine')">
              {{ partner.MSISDNRangeCounterQuarantined }}
            </StaticValue>
          </div>
          <div class="col">
            <StaticValue :label="$t('getadmin.partners.m2mRange.preactivated')">{{
              partner.MSISDNRangeCounterUsed
            }}</StaticValue>
            <StaticValue :label="$t('getadmin.partners.m2mRange.unavailable')">
              {{ partner.MSISDNRangeCounterUnavailables }}
            </StaticValue>
          </div>
        </div>
      </template>
    </ContentBlock>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import UiToggle from '@/components/ui/UiToggle';
import UiInput from '@/components/ui/UiInput';
import StaticValue from '@/views/GetParc/LineDetail/StaticValue.vue';

export default {
  components: {
    ContentBlock,
    UiToggle,
    UiInput,
    StaticValue,
  },
  props: {
    partner: Object,
  },
  data() {
    return {
      activeMsisdnRange: undefined,
      lockedMsisdnRange: undefined,
      rangeCode: undefined,
    };
  },
  mounted() {
    this.activeMsisdnRange = this.partner.flagMSISDNRangeEnabled;
    this.lockedMsisdnRange = this.partner.flagMSISDNRangeLocked;
    this.rangeCode = this.partner.MSISDNRangeCode;
  },
};
</script>

<style lang="scss" scoped>
.small-label {
  font-size: 0.9rem !important;
}
</style>
