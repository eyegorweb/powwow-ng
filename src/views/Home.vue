<template>
  <div class="home">
    <div class="container">
      <DataTable
        :columns="columns"
        :rows="rows"
      />
      <Checkbox>Example</Checkbox>
      <Button
        variant="primary"
        @click="show = !show"
      >Afficher le volet</Button>
      <TransitionCollapse>
        <div
          v-if="show"
        >Hello there</div>
      </TransitionCollapse>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import DataTable from '@/components/DataTable';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import TransitionCollapse from '@/components/TransitionCollapse';

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
      {
        label: 'Age',
        name: 'age',
      },
      {
        label: 'birthday',
        name: 'birthday',
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
    Button,
    TransitionCollapse,
    DataTable,
  },
};
</script>
