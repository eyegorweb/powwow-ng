<template>
  <div>
    <div class="mb-3">
      <h6>IMEI</h6>
      <UiInput v-model="imei" placeholder="IMEI" block />
    </div>
    <div class="mb-3">
      <h6>MSISDN</h6>
      <UiInput v-model="msisdn" placeholder="MSISDN" block />
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import get from 'lodash.get';

export default {
  components: {
    UiInput,
  },

  props: {
    selectedData: Object,
  },

  computed: {
    msisdn: {
      get() {
        return get(this.selectedData, 'data.msisdn');
      },
      set(value) {
        this.$emit('change', {
          msisdn: value,
          imei: this.imei,
        });
      },
    },
    imei: {
      get() {
        return get(this.selectedData, 'data.imei');
      },
      set(value) {
        this.$emit('change', {
          imei: value,
          msisdn: this.msisdn,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
