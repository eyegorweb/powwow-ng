<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :check-errors-fn="isFormValid"
    have-form
    @save="onSave"
    @scope="scopeChoice = $event"
  >
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
import { fetchDeliveryCountries } from '@/api/filters';
import { alarmOnChangeCountry } from '@/api/alarmCreation';
import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
    GroupMultiSelect,
    SectionTitle,
  },
  props: {
    alarm: Object,
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),
    isFormValid() {
      return this.selectedOptions && this.selectedOptions.length;
    },
    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.selectedOptions,
      };

      const response = await alarmOnChangeCountry(params);
      if (response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
  computed: {
    selectedOptions() {
      return this.options.filter(o => o.selected);
    },
  },
  async mounted() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    this.options = countries.map(c => ({
      id: c.codeIso3,
      label: c.name,
      data: c,
    }));
  },
  data() {
    return {
      options: [],
      scopeChoice: undefined,
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
