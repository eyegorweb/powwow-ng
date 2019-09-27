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
import uuid from 'uuid/v1';

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
      const res = this.errors.reduce((all, err) => {
        const extensions = Object.keys(err.extensions).filter(k => k !== 'classification');
        const errorKeys = extensions.map(exName => `${exName}.${err.extensions[exName]}`);
        all.push({
          id: uuid(),
          errorKeys,
        });
        return all;
      }, []);
      return res;
    },
  },
};
</script>

<style lang="scss" scoped></style>
