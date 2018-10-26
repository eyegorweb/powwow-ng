<template>
  <div class="home">
    <DataTable
      :columns="columns"
      :rows="rows"
    />
    <Checkbox>Example</Checkbox>
    <button @click="show = !show">Toggle</button>
    <TransitionCollapse>
      <div
        v-if="show"
      >Hello there</div>
    </TransitionCollapse>
  </div>
</template>

<script>
// @ is an alias to /src
import DataTable from '@/components/DataTable.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import TransitionCollapse from '@/components/TransitionCollapse.vue';

export default {
  name: 'Home',
  data() {
    const columns = [
      {
        label: 'First name',
        name: 'firstName',
      },
      {
        label: 'Last name',
        name: 'lastName',
      },
    ];
    const rows = [
      {
        id: 1,
        firstName: 'Leroy',
        lastName: 'Jenkins',
      },
    ];
    return {
      columns,
      rows,
      show: false,
    };
  },
  components: {
    Checkbox,
    TransitionCollapse,
    DataTable,
  },
};
</script>
