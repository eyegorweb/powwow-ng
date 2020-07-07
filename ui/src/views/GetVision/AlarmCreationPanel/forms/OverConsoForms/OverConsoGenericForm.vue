<template>
  <div class="m-3 bg-white p-3 bordered">
    <div class="line-container" v-for="line in lines" :key="line.id">
      <div class="value">
        <span>{{ valueLabel }}</span>
        <UiInput
          class="value-input"
          input-type="number"
          :min-value="0"
          :max-value="100"
          v-model="line.value"
          @update:value="onValueUpdate()"
        />
      </div>
      <div class="limitDate">
        <span>
          <template v-if="!!getPercentValFn(line.value)"
            >{{ getPercentValFn(line.value) }} Avant le</template
          >
        </span>
        <UiSelect :options="options" v-model="line.limit" @input="onValueUpdate()" />
      </div>
      <div class="deleteButton">
        <UiButton variant="outline-danger" @click="deleteLine(line)">
          <span class="btn-label">Supprimer</span>
        </UiButton>
      </div>
    </div>

    <div class="line-container">
      <div class="value">
        <span>{{ valueLabel }}</span>
        <UiInput
          class="value-input"
          input-type="number"
          :min-value="0"
          :max-value="100"
          v-model="basePercent"
          @update:value="onValueUpdate()"
        />
      </div>
      <div class="limitDate">
        <span>
          <template v-if="!!getPercentValFn(basePercent)"
            >{{ getPercentValFn(basePercent) }} Avant la fin du mois</template
          >
        </span>
      </div>
      <div v-if="lines.length < 2" class="deleteButton">
        <UiButton variant="outline-info" @click="addNewLine()">
          <span class="btn-label">
            <i class="ic-Plus-Icon"></i>
            Ajouter un seuil
          </span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import UiButton from '@/components/ui/Button';
import uuid from 'uuid/v1';

export default {
  components: {
    UiInput,
    UiSelect,
    UiButton,
  },

  props: {
    valueLabel: String,
    getPercentValFn: Function,
  },
  data() {
    return {
      basePercent: 100,
      lines: [],
      options: [],
    };
  },
  mounted() {
    const options = [];

    for (let i = 1; i < 31; i++) {
      options.push({ value: i, label: i + ' du mois' });
    }

    this.options = options;
  },

  methods: {
    onValueUpdate() {
      this.$emit('change', {
        levels: this.lines,
        basePercent: this.basePercent,
      });
    },
    deleteLine(line) {
      this.lines = this.lines.filter(l => l.id !== line.id);
    },
    addNewLine() {
      if (this.lines.length < 2) {
        this.lines.push({
          id: uuid(),
          value: undefined,
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
    flex-basis: 30%;
    padding-right: 1rem;

    &::after {
      content: '%';
      position: relative;
      right: 1.2rem;
      top: 0.5rem;
    }

    span {
      flex-basis: 13rem;
      font-size: 0.8rem;
      position: relative;
      top: 0.6rem;
    }
  }

  .limitDate {
    display: flex;
    flex-basis: 32%;
    padding-right: 1rem;
    align-content: flex-end;

    span {
      flex-grow: 1;
      text-align: end;
      padding-right: 0.5rem;
      position: relative;
      top: 0.6rem;
    }
    & /deep/ select {
      padding: 0.2rem 0.2rem;
      padding-right: 0 !important;
      position: relative;
      top: 0.4rem;
    }
  }

  .deleteButton {
    & /deep/ button {
      padding: 0.2rem 0.5rem;
      margin-top: 0.3rem;
    }
  }
}
</style>
