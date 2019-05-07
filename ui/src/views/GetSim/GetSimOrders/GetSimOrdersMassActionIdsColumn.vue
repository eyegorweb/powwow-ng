<template>
  <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center truncate">
    <TruncateList :limit="2" :content="actionIds"> </TruncateList>
  </div>
</template>

<script>
import TruncateList from '@/components/ui/TruncateList';

export default {
  components: {
    TruncateList,
  },
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

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
