<template>
  <div>
    <TwoValuesToggle v-model="isSingleDateValue" />
    <template v-if="!isSingleDateValue">
      <UiDateRange
        :key="'datefilter_' + version"
        @change="setRange"
        :start="startDate"
        :end="endDate"
        :one-year-limit="oneYearLimit"
      />
    </template>
    <template v-else>
      <UiDate
        @change="setStartFrom"
        :value="startFrom"
        class="d-block"
        :min-date="minDate"
        time-picker
      >
        <i slot="icon" class="select-icon ic-Flag-Icon" />
      </UiDate>
    </template>
  </div>
</template>

<script>
import TwoValuesToggle from '@/components/ui/TwoValuesToggle.vue';
import UiDateRange from '@/components/ui/UiDateRange';
import UiDate from '@/components/ui/UiDate';
import moment from 'moment';

export default {
  components: {
    TwoValuesToggle,
    UiDateRange,
    UiDate,
  },
  props: {
    start: String,
    end: String,
    oneYearLimit: Boolean,
  },

  mounted() {
    if (this.start && this.end) {
      this.startDate = this.start.split(' ')[0];
      this.endDate = this.end;
      this.isSingleDateValue = false;
    }

    if (this.start && !this.end) {
      this.startFrom = moment().format('DD/MM/YYYY HH:mm:ss');
      this.isSingleDateValue = true;
    }

    if (!this.start && !this.end) {
      this.startDate = moment().format('DD/MM/YYYY HH:mm:ss');
    }

    setTimeout(() => {
      this.settingUp = false;
    }, 200);
  },

  data() {
    return {
      isSingleDateValue: false,
      startDate: undefined,
      endDate: undefined,
      startFrom: undefined,
      version: 0,
      settingUp: true,
    };
  },
  computed: {
    minDate() {
      if (this.oneYearLimit) {
        return moment()
          .subtract(1, 'year')
          .format('DD/MM/YYYY HH:mm:ss');
      } else {
        return undefined;
      }
    },
    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },

  watch: {
    isSingleDateValue(isSingleDateValue) {
      if (!this.settingUp) {
        this.$emit('change', { startDate: this.startDate, endDate: undefined });
        if (isSingleDateValue && this.startDate) {
          this.startFrom = this.startDate;
        } else {
          this.endDate = '';
        }
      }
    },
    start() {
      if (!this.settingUp) {
        this.startDate = this.start;
        this.startFrom = this.start;
      }
    },
    end() {
      if (!this.settingUp) {
        this.endDate = this.end;
      }
    },
    isDateEmpty() {
      this.version++;
    },
  },

  methods: {
    setStartFrom(startFrom) {
      this.startFrom = startFrom;
      this.$emit('change', { startDate: this.startFrom, endDate: undefined });
    },
    setRange(values) {
      this.startDate = values.startDate;
      this.endDate = values.endDate;
      this.$emit('change', { startDate: this.startDate, endDate: this.endDate });
    },
  },
};
</script>

<style lang="scss" scoped></style>
