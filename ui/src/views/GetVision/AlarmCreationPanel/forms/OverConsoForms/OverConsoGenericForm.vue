<template>
  <div class="m-3 bg-white p-3 bordered">
    <template v-if="active_">
      <OverConsoVolumeFlotteGraph :init-limits="limits" @setLimits="setLimitsFromGraph" />

      <div class="line-container">
        <div class="value">
          <span>{{ $t('getvsion.alarm-creation.thresholdIsOver') }}</span>
          <UiInput
            class="value-input"
            input-type="number"
            :min-value="0"
            :max-value="100"
            v-model="basePercent"
            @update:value="onValueUpdate()"
            :input-style="inputStyle"
          />
        </div>
        <div class="limitDate">
          <span>
            <template v-if="!!getPercentValFn(basePercent)"
              >{{ getPercentValFn(basePercent) }}
            </template>
            {{ $t('getvsion.alarm-creation.beforeEndOfMonth') }}
          </span>
        </div>
      </div>

      <div class="line-container" v-for="line in lines" :key="line.id">
        <div class="value">
          <span>{{ $t('getvsion.alarm-creation.thresholdIsOver') }}</span>
          <UiInput
            class="value-input"
            input-type="number"
            :min-value="0"
            :max-value="100"
            v-model="line.value"
            @update:value="onValueUpdate()"
            :input-style="inputStyle"
          />
        </div>
        <div class="limitDate">
          <span class="before-date-selection-text">
            <template v-if="!!getPercentValFn(line.value)"
              >{{ getPercentValFn(line.value) }}
            </template>
            {{ $t('getsim.date-over', { endDate: '' }) }}
          </span>
          <UiSelect :options="options" v-model="line.limit" @input="onValueUpdate()" />
          <div class="deleteButton">
            <UiButton variant="outline-danger" @click="deleteLine(line)">
              <i class="icon ic-Trash-Icon"></i>
            </UiButton>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <div>
          <div v-if="lines.length < 2" class="deleteButton">
            <UiButton variant="outline-info" @click="addNewLine()">
              <span class="btn-label">
                <i class="ic-Plus-Icon"></i>
                {{ $t('getvsion.alarm-creation.addLimit') }}
              </span>
            </UiButton>
          </div>
        </div>
        <div>
          <UiButton variant="link" @click="active_ = false" :class="{ 'mx-auto': true }">
            <span class="btn-label">{{ $t('cancel') }}</span>
          </UiButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="alert alert-primary" role="alert">
        {{ $t('getvsion.alarm-creation.noLimitsConfigured') }}
      </div>
      <div class="row">
        <div class="col">
          <UiButton variant="link" @click="active_ = true" :class="{ 'mx-auto': true }">
            <span class="btn-label">
              {{ $t('getvsion.alarm-creation.configureForUsage') }}
            </span>
          </UiButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import UiButton from '@/components/ui/Button';
import uuid from 'uuid/v1';

import OverConsoVolumeFlotteGraph from './OverConsoVolumeFlotteGraph';

import { propWithSync } from '@/mixins';

export default {
  components: {
    UiInput,
    UiSelect,
    UiButton,
    OverConsoVolumeFlotteGraph,
  },

  mixins: [propWithSync('active')],

  props: {
    getPercentValFn: Function,
  },
  data() {
    return {
      basePercent: 100,
      lines: [],
      options: [],
      inputStyle: {
        paddingRight: '1.8rem',
      },
    };
  },

  watch: {
    active(active) {
      if (active) {
        this.onValueUpdate();
      } else {
        this.$emit('change', undefined);
      }
    },
  },

  computed: {
    limits() {
      const limits = this.lines
        .filter(line => line.limit && line.value)
        .map(line => [line.limit, parseInt(line.value)]);

      // 99 correspond à la fin du mois
      limits.push([99, parseInt(this.basePercent)]);

      const ordered = limits.sort((a, b) => (a[0] < b[0] ? -1 : 1));

      return ordered;
    },
  },
  mounted() {
    const options = [];

    for (let i = 1; i < 31; i++) {
      options.push({ value: i, label: i + ' du mois' });
    }

    this.options = options;
  },

  methods: {
    /**
     *  limits format : [[dayOfMonth, percent]]
     */
    setLimitsFromGraph(limits) {
      const ordered = limits.sort((a, b) => (a[0] < b[0] ? -1 : 1));
      if (ordered && ordered.length > 1) {
        // dernière ligne à ignorer (correspond)
        const newLines = [];
        for (let i = 0; i < ordered.length - 1; i++) {
          newLines.push({
            id: uuid(),
            value: ordered[i][1],
            limit: ordered[i][0],
          });
        }

        this.lines = newLines;
      }
    },
    onValueUpdate() {
      this.$emit('change', {
        levels: this.lines,
        basePercent: this.basePercent,
      });
    },
    deleteLine(line) {
      this.lines = this.lines.filter(l => l.id !== line.id);

      this.onValueUpdate();
    },
    addNewLine() {
      if (this.lines.length < 2) {
        this.lines.push({
          id: uuid(),
          value: undefined,
          limit: undefined,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.line-container {
  display: flex;
  .value {
    display: flex;
    flex-basis: 40%;
    padding-right: 1rem;

    &::after {
      content: '%';
      position: relative;
      right: 1.5rem;
      top: 0.5rem;
    }

    span {
      flex-basis: 50%;
      font-size: 0.8rem;
      position: relative;
      top: 0.6rem;
    }
  }

  .limitDate {
    display: flex;
    flex-basis: 54%;
    padding-right: 1rem;
    align-content: flex-end;

    span {
      flex-grow: 1;
      padding-right: 0.5rem;
      position: relative;
      top: 0.6rem;
      font-size: 0.8rem;
    }

    .select-container {
      flex-basis: 45%;
    }

    & /deep/ select {
      padding: 0.2rem 0.2rem;
      padding-right: 0 !important;
      position: relative;
      top: 0.4rem;
    }
  }
}

.deleteButton {
  & /deep/ button {
    padding: 0.2rem 0.5rem;
    margin-top: 0.3rem;
    margin-left: 0.4rem;

    &:hover i {
      color: white;
    }
  }
}

.before-date-selection-text {
  flex-grow: unset !important;
  flex-basis: 40%;
}
</style>
