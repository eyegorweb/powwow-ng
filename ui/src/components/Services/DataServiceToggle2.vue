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
import MultiChoiceList from '@/components/ui/MultiChoiceList';

export default {
  components: {
    UiToggle,
    MultiChoiceList,
  },

  props: {
    service: Object,
  },

  data() {
    return {
      editable: true,
      checked: false,
      apns: [],
    };
  },
  mounted() {
    const data = {
      checked: this.service.activated,
      editable: this.service.editable,
      apns: this.service.parameters.map(s => ({
        code: s.code,
        label: s.value,
        selectable: s.editable,
        selected: s.active,
      })),
    };
    this.apns = data.apns;
    this.checked = data.checked;
    this.editable = data.editable;
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
