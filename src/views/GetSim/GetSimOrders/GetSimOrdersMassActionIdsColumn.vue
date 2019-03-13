<template>
  <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center">
      <p class="ids">
        <button v-for="(id, index) in actionIds" :key="id" class="btn btn-link p-0 id" @click.prevent="openDetails">{{ index ? ', ' : '' }}{{ id }}</button>
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
  methods: {
    openDetails() {
      console.log('ouverture détail de l acte');
    },
  },
};
</script>
