<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :check-errors-fn="isFormValid"
    have-form
    @save="onSave"
    @scope="scopeChoice = $event"
  >
    <SectionTitle :num="3">Définir une liste d'opérateurs</SectionTitle>

    <GroupMultiSelect
      from-title="getvsion.alarm-creation.change_plmn.isp_list"
      to-title="getvsion.alarm-creation.change_plmn.chosen_isp"
      :options.sync="options"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import SectionTitle from '@/components/SectionTitle';
import GroupMultiSelect from '@/components/GroupMultiSelect';
import { fetchIsps } from '@/api/isp';
import { alarmOnChangeISP } from '@/api/alarmCreation';
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
  async mounted() {
    const isps = await fetchIsps();

    if (!isps || !isps.total) return;

    const options = isps.items.map(i => {
      i.label = i.operator;
      return i;
    });

    this.options = options.reduce((all, current) => {
      const alreadyInOptions = all.find(o => o.label === current.label);
      if (!alreadyInOptions) {
        all.push(current);
      }
      return all;
    }, []);
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

      const response = await alarmOnChangeISP(params);
      if (response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
  data() {
    return {
      options: [],
      scopeChoice: undefined,
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter(o => o.selected);
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
