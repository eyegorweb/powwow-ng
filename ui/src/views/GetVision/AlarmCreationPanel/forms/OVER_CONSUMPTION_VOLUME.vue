<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form>
    <SectionTitle :num="3">
      Définir un seuil de déclenchement par usage
    </SectionTitle>

    <div class="d-flex mb-2">
      <span :class="{ bold: !isAdvanced }">Mode Standard</span>
      <UiToggle v-model="isAdvanced" on-text="" off-text="" />
      <span :class="{ bold: isAdvanced }">Mode Avancé</span>
    </div>

    <div class="values-container" :class="{ 'standard-mode': !isAdvanced }">
      <div class="item">
        <span>DATA E/S</span>
        <UiInput class="value-input" v-model="dataES" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>Data Sortante</span>
        <UiInput class="value-input" v-model="dataOut" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>Data Entrante</span>
        <UiInput class="value-input" v-model="dataIn" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>SMS E/S</span>
        <UiInput class="value-input" v-model="smsES" />
      </div>
      <div class="item">
        <span>SMS Sortant</span>
        <UiInput class="value-input" v-model="smsOut" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>SMS Entrant</span>
        <UiInput class="value-input" v-model="smsIn" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>Voix E/S</span>
        <UiInput class="value-input" v-model="voiceES" />
      </div>
      <div class="item">
        <span>Voix Sortante</span>
        <UiInput class="value-input" v-model="VoiceOut" />
      </div>
      <div v-if="isAdvanced" class="item fade-in-reveal">
        <span>Voix Entrante</span>
        <UiInput class="value-input" v-model="voiceIn" />
      </div>
    </div>
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import SectionTitle from './SectionTitle';
import UiInput from '@/components/ui/UiInput';
import UiToggle from '@/components/ui/UiToggle';

export default {
  components: {
    AlarmCreationBaseForm,
    UiInput,
    UiToggle,
    SectionTitle,
  },
  props: {
    alarm: Object,
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
      VoiceOut: undefined,

      smsES: undefined,
      smsIn: undefined,
      smsOut: undefined,
    };
  },

  watch: {
    isAdvanced(newValue) {
      if (!newValue) {
        this.dataOut = undefined;
        this.dataIn = undefined;
        this.smsES = undefined;
        this.smsIn = undefined;
        this.voiceES = undefined;
        this.voiceIn = undefined;
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
      font-size: 1.2rem;
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
</style>
