<template>
  <div class="s-container">
    <div class="line">
      <UiToggle :label="$t('services.DATA')" :editable="editable" v-model="checked" />
    </div>
    <div v-if="apns && apns.length" class="line">
      <span class="mt-4 mb-4">Apn:</span>

      <MultiChoiceList :items="apns" @change="toggleApn" />
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import { initDataService } from '@/utils/simServices';
import MultiChoiceList from '@/components/ui/MultiChoiceList';

export default {
  components: {
    UiToggle,
    MultiChoiceList,
  },

  props: {
    catalogOffer: Object,
    instanceOffer: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      editable: true,
      checked: false,
      apns: [],
      data: undefined,
    };
  },
  mounted() {
    const data = initDataService(this.catalogOffer);
    if (data) {
      this.apns = data.apns;
      this.checked = data.checked;
      this.editable = data.editable;
    } else {
      this.apns = [
        {
          code: 'TEST',
          label: 'testrnis.fr',
          selectable: false,
          selected: true,
        },
      ];
    }
  },
  methods: {
    toggleApn(apn) {
      this.apns = this.apns.map(a => {
        if (a.selectable && a.label === apn.label) {
          a.selected = !a.selected;
        }
        return a;
      });
    },
    changeValue() {
      this.$emit('change', {
        checked: this.checked,
        apns: this.apns,
        code: '878',
      });
    },
  },
  watch: {
    checked() {
      this.changeValue();
    },
    apns() {
      this.changeValue();
    },
  },
};
</script>

<style lang="scss" scoped>
.s-container {
  display: flex;
  flex-direction: column;
  .line {
    margin-bottom: 1.5rem;
  }
}
</style>
