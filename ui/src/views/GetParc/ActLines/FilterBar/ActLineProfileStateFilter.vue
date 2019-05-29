<template>
  <div>
    <UiCheckbox
      v-for="state in states"
      :value="{ id: state, label: $t(`filters.lines.profileStateFilter. ${state}`) }"
      :key="state"
      v-model="selectedValues"
      >{{ $t(`filters.lines.profileStateFilter. ${state}`) }}</UiCheckbox
    >
  </div>
</template>

<script>
import { getProfileState } from '@/api/profileState';
import { mapGetters, mapMutations } from 'vuex';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiCheckbox,
  },
  data() {
    return {
      states: [],
    };
  },
  async mounted() {
    const data = await getProfileState();
    this.states = data;
  },
  methods: {
    ...mapMutations('actLines', ['setProfileStatesFilter']),
  },
  computed: {
    ...mapGetters('actLines', ['selectedProfileStatesValues']),
    selectedValues: {
      get() {
        return this.selectedProfileStatesValues;
      },
      set(newValue) {
        this.setProfileStatesFilter(newValue);
      },
    },
  },
};
</script>

<style scoped></style>
