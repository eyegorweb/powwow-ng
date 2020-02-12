<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form>
    <SectionTitle :num="3">Définir une liste de pays autorisés</SectionTitle>

    <GroupMultiSelect
      from-title="getvsion.alarm-creation.change_country.countries_list"
      to-title="getvsion.alarm-creation.change_country.chosen_countries"
      :options.sync="options"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import SectionTitle from '@/components/SectionTitle';
import GroupMultiSelect from '@/components/GroupMultiSelect';

export default {
  components: {
    AlarmCreationBaseForm,
    GroupMultiSelect,
    SectionTitle,
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
