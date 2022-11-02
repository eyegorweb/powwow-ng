<template>
  <span v-if="format.isEditable || canEdit">
    <a href="#" @click.prevent="format.onClick(item, row)">
      <template v-if="!format.getLabel">{{ item }}</template>
      <template v-else>{{ format.getLabel(item) }}</template>
    </a>
  </span>
  <span v-else>
    <template v-if="!format.getLabel">{{ item }}</template>
    <template v-else>{{ format.getLabel(item) }}</template>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    format: {
      type: Object,
      required: true,
    },
    item: {
      type: [String, Number],
    },
    row: Object,
  },
  computed: {
    ...mapGetters(['userInfos', 'userIsByCustomerAccount']),
    canEdit() {
      return !this.userIsByCustomerAccount || this.userInfos.id === this.item.id;
    },
  },
};
</script>

<style scoped></style>
