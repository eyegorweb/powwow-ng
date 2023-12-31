<template>
  <div class="mb-4">
    <SectionTitle :num="numStep">{{ $t('getvsion.alarm-creation.defineThreshold') }}</SectionTitle>

    <div class="d-flex mb-2">
      <span :class="{ bold: !isAdvanced }">{{ $t('getvsion.alarm-creation.standardMode') }}</span>
      <UiToggle v-model="isAdvanced" on-text off-text />
      <span :class="{ bold: isAdvanced }">{{ $t('getvsion.alarm-creation.advancedMode') }}</span>
    </div>

    <div class="values-container" :class="{ 'standard-mode': !isAdvanced }">
      <div class="item">
        <span>{{ $t('getparc.lineDetail.alarms.data') }} (Mo)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="dataES"
          positive-number
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.data_out') }} (Mo)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="dataOut"
          positive-number
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.data_in') }} (Mo)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="dataIn"
          positive-number
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.sms') }}</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="smsES"
          :disabled="alarmWithStream"
        />
      </div>
      <div class="item">
        <span>{{ $t('getparc.lineDetail.alarms.sms_out') }}</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="smsOut"
          positive-number
          :disabled="alarmWithStream"
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.sms_in') }}</span>

        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="smsIn"
          :disabled="alarmWithStream"
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.voice') }}</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceES"
          positive-number
          :disabled="alarmWithStream"
        />
      </div>
      <div class="item">
        <span>{{ $t('getparc.lineDetail.alarms.voice_out') }} (Min)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceOut"
          positive-number
          :disabled="alarmWithStream"
        />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>{{ $t('getparc.lineDetail.alarms.voice_in') }} (Min)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="voiceIn"
          positive-number
          :disabled="alarmWithStream"
        />
      </div>
    </div>

    <div v-if="isAdvanced" class="mt-4 mb-2">
      <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}</h6>
      <Toggle
        v-if="toggleValues"
        @update="currentPeriod = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>

    <div v-if="isAdvanced && currentPeriod === 'CUSTOM'" class="custom-observation">
      <UiInput
        class="value-input"
        v-model="customPeriodValue"
        input-type="number"
        positive-number
      />
      <span>{{ $t('days') }}</span>
    </div>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle';
import UiInput from '@/components/ui/UiInput';
import UiToggle from '@/components/ui/UiToggle';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    UiInput,
    UiToggle,
    Toggle,
    SectionTitle,
  },
  props: {
    alarm: Object,
    partner: Object,
    alarmWithStream: Boolean,
    duplicateFrom: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    if (this.duplicateFrom) {
      this.dataES = this.duplicateFrom.level1 / 1024 / 1024;
      this.dataOut = this.duplicateFrom.level1Up / 1024 / 1024;
      this.dataIn = this.duplicateFrom.level1Down / 1024 / 1024;
      this.smsES = this.duplicateFrom.level2;
      this.smsOut = this.duplicateFrom.level2Up;
      this.smsIn = this.duplicateFrom.level2Down;
      this.voiceES = this.duplicateFrom.level3 / 60;
      this.voiceOut = this.duplicateFrom.level3Up / 60;
      this.voiceIn = this.duplicateFrom.level3Down / 60;
      this.currentPeriod = this.duplicateFrom.observationCycle;
      this.toggleValues = this.toggleValues.map((t) => {
        t.default = t.id === this.duplicateFrom.observationCycle;
        return t;
      });
      if (this.currentPeriod === 'CUSTOM') {
        this.customPeriodValue = this.duplicateFrom.observationDelay;
      }
      if (this.currentPeriod !== 'MONTH') {
        this.isAdvanced = true;
      }
    }
  },

  computed: {
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    numStep() {
      if (!this.editMode && this.partner) {
        return 2;
      }
      return this.editMode ? 1 : 3;
    },
  },

  data() {
    return {
      valtest: undefined,
      isAdvanced: false,

      dataES: undefined,
      dataIn: undefined,
      dataOut: undefined,

      voiceES: undefined,
      voiceIn: undefined,
      voiceOut: undefined,

      smsES: undefined,
      smsIn: undefined,
      smsOut: undefined,

      currentPeriod: 'MONTHLY',
      customPeriodValue: undefined,

      toggleValues: [
        {
          id: 'DAILY',
          label: 'frequencies.DAILY',
        },
        {
          id: 'WEEKLY',
          label: 'frequencies.WEEKLY',
        },
        {
          id: 'MONTHLY',
          label: 'frequencies.MONTHLY',
          default: true,
        },
        {
          id: 'CUSTOM',
          label: 'frequencies.CUSTOM',
        },
      ],
      inputStyle: {
        padding: '0.3rem',
        fontSize: '0.8rem',
        height: '2.2rem',
      },
    };
  },

  methods: {
    emitChange() {
      this.$emit('change', {
        dataES: this.dataES,
        dataOut: this.dataOut,
        dataIn: this.dataIn,
        smsES: this.smsES,
        smsIn: this.smsIn,
        smsOut: this.smsOut,
        voiceES: this.voiceES,
        voiceIn: this.voiceIn,
        voiceOut: this.voiceOut,
        period: this.currentPeriod,
        customPeriodValue: this.customPeriodValue,
      });
    },
  },

  watch: {
    isAdvanced(newValue) {
      if (!newValue) {
        this.dataOut = undefined;
        this.dataIn = undefined;
        this.smsES = undefined;
        this.smsIn = undefined;
        this.voiceOut = undefined;
        this.voiceIn = undefined;
      }
    },

    dataOut() {
      this.emitChange();
    },
    dataIn() {
      this.emitChange();
    },
    dataES() {
      this.emitChange();
    },
    voiceES() {
      this.emitChange();
    },
    voiceIn() {
      this.emitChange();
    },
    voiceOut() {
      this.emitChange();
    },
    smsES() {
      this.emitChange();
    },
    smsIn() {
      this.emitChange();
    },
    smsOut() {
      this.emitChange();
    },
    currentPeriod() {
      this.emitChange();
    },
    customPeriodValue() {
      this.emitChange();
    },
    alarmWithStream(newValue) {
      if (newValue) {
        this.smsES = undefined;
        this.smsIn = undefined;
        this.smsOut = undefined;
        this.voiceES = undefined;
        this.voiceIn = undefined;
        this.voiceOut = undefined;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.values-container {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid $medium-gray;
  padding: 0.5rem;
  border-radius: 0.2rem;

  width: 100%;

  &.standard-mode {
    width: 30%;
    flex-direction: column;
  }

  .item {
    flex-basis: 30%;
    display: flex;
    justify-content: flex-end;

    span {
      font-size: 0.9rem;
      top: 0.4rem;
      position: relative;
    }

    .value-input {
      padding-left: 1rem;
      padding-right: 1rem;
      flex-basis: 40%;
    }
  }
}

.custom-observation {
  display: flex;

  label {
    flex-basis: 7%;
  }
  span {
    font-size: 1rem;
    font-weight: bold;
    position: relative;
    top: 0.5rem;
    padding-left: 0.5rem;
  }
}
</style>
