<template>
  <div>
    {{ displayName }}
  </div>
</template>

<script>
export default {
  name: 'Creator',

  props: {
    row: Object,
  },

  computed: {
    displayName() {
      const lastName = this.row.creatorDetails.name.lastName
        ? this.row.creatorDetails.name.lastName
        : '';
      const firstName = this.row.creatorDetails.name.firstName
        ? this.row.creatorDetails.name.firstName
        : '';
      return `${lastName} ${firstName}`;
    },
  },
};
</script>
