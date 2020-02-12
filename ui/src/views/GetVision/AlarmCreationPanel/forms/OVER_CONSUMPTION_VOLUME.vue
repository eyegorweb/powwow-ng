<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form>
    <ConsumptionForm @change="values = $event" />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import ConsumptionForm from './ConsumptionForm';

export default {
  components: {
    AlarmCreationBaseForm,
    ConsumptionForm,
  },
  props: {
    alarm: Object,
  },
  data() {
    return {
      values: undefined,
    };
  },
};
</script>
