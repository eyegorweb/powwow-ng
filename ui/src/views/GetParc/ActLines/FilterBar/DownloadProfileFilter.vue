<template>
  <div>
    <UiToggleDynamic v-if="toggleValues" v-model="selectedValue" :options="toggleValues" />
  </div>
</template>

<script>
import UiToggleDynamic from '@/components/ui/UiToggleDynamic.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    UiToggleDynamic,
  },
  data() {
    return {
      toggleValues: undefined,
    };
  },
  mounted() {
    this.toggleValues = [
      {
        id: 1,
        label: 'common.YES',
        value: this.$t('common.YES'),
      },
      {
        id: 2,
        label: 'common.NO',
        value: this.$t('common.NO'),
      },
      {
        id: 3,
        label: 'notDefined',
        value: this.$t('notDefined'),
      },
    ];
  },
  methods: {
    ...mapMutations('actLines', ['setDownloadProfile']),
  },
  computed: {
    ...mapGetters('actLines', ['selectedDownloadProfile']),
    selectedValue: {
      get() {
        const value = this.selectedDownloadProfile;
        if (!value) return;
        return this.$loGet(this.selectedDownloadProfile, 'meta');
      },
      set(value) {
        this.setDownloadProfile(value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
