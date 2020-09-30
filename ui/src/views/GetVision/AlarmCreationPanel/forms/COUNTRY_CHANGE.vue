<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :check-errors-fn="isFormValid"
    :duplicate-from="duplicateFrom"
    have-form
    @save="onSave"
    @scope="scopeChoice = $event"
  >
    <SectionTitle :num="numStep">
      {{ $t('getvsion.alarm-creation.setCountries') }}
    </SectionTitle>

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
import { updateCountryChangeAlarm } from '@/api/alarmsModifications';
import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
    GroupMultiSelect,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
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

      // const response = await alarmOnChangeCountry(params);

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        response = await updateCountryChangeAlarm({ ...params, id: this.duplicateFrom.id });
      } else {
        response = await alarmOnChangeCountry(params);
      }

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
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    numStep() {
      return this.editMode ? 1 : 3;
    },
  },
  async mounted() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    const formattedOptions = countries.map(c => ({
      id: c.codeIso3,
      label: c.name,
      data: c,
    }));

    if (this.editMode) {
      this.options = formattedOptions.map(o => {
        o.selected = !!this.duplicateFrom.countriesList.find(p => p === '' + o.id);
        return o;
      });
    } else {
      this.options = formattedOptions;
    }
  },
  data() {
    return {
      options: [],
      scopeChoice: undefined,
    };
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
