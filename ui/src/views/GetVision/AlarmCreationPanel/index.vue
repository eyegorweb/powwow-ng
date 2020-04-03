<template>
  <div class="creationContainer">
    <div class="buttonBar">
      <AlarmChoiceButtons
        @hover="hoveredAlarm = $event"
        @choose="currentAlarm = $event"
        :current="currentAlarm"
        :duplicate-from="content"
      />
    </div>
    <div class="currentForm">
      <FormSwitcher v-if="currentAlarm" :alarm="currentAlarm" :duplicate-from="content" />
      <AlarmDescription v-else-if="hoveredAlarm" :alarm="hoveredAlarm" />
    </div>
  </div>
</template>

<script>
import AlarmChoiceButtons from './AlarmChoiceButtons';
import AlarmDescription from './AlarmDescription';
import FormSwitcher from './forms/FormSwitcher';

export default {
  components: {
    AlarmChoiceButtons,
    FormSwitcher,
    AlarmDescription,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      currentAlarm: undefined,
      hoveredAlarm: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
.creationContainer {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;

  .buttonBar {
    width: 30%;
    background: #f1f1f1;
    overflow: auto;
  }

  .currentForm {
    width: 70%;
    background: white;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
