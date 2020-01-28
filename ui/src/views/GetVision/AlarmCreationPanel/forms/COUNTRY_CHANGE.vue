<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form>
    <h5 class="text-primary text-uppercase">
      <span class="badge badge-pill badge-primary">3</span>
      <span class="title"> Définir une liste de pays autorisés</span>
    </h5>

    <GroupMultiSelect
      from-title="getvsion.alarm-creation.change_country.countries_list"
      to-title="getvsion.alarm-creation.change_country.chosen_countries"
      :options.sync="options"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import GroupMultiSelect from '@/components/GroupMultiSelect';

export default {
  components: {
    AlarmCreationBaseForm,
    GroupMultiSelect,
  },
  props: {
    alarm: Object,
  },
  data() {
    return {
      options: [
        {
          id: 1,
          label: 'Europe',
          groupParent: true,
        },
        {
          id: 2,
          label: 'France',
          parent: 1,
        },
        {
          id: 3,
          label: 'Allemagne',
          parent: 1,
        },
        {
          id: 4,
          label: 'Russie',
        },
      ],
    };
  },
  watch: {
    options() {
      console.log('Changed >>');
    },
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-weight: 700;

  .title {
    position: relative;
    top: 3px;
    padding-left: 5px;
  }
}
</style>
