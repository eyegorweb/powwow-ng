<template>
  <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center">
      <p class="ids">
        <span v-for="(id, index) in actionIds" :key="id" class="id">{{ index ? ', ' : '' }}{{ id }}</span>
      </p>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  computed: {
    actionIds() {
      return this.row.massActionIds;
    },
  },
};
</script>
