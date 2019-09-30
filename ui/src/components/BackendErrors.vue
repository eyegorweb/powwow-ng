<template>
  <ul class="list-unstyled">
    <li v-for="errorGroup in formattedErrors" :key="errorGroup.id">
      <ul class="list-unstyled">
        <li v-for="errorKey in errorGroup.errorKeys" :key="errorKey">
          <span class="text-danger">{{ $t(`${tradPrefix}.${errorKey}`) }}</span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { formatBackErrors } from '@/utils/errors';

export default {
  props: {
    errors: Array,
    tradPrefix: {
      type: String,
      default: '',
    },
  },
  computed: {
    formattedErrors() {
      return formatBackErrors(this.errors);
    },
  },
};
</script>

<style lang="scss" scoped></style>
