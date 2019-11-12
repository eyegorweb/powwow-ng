<template>
  <div v-if="!vertical" class="s-container">
    <div class="line">
      <UiToggle :label="$t('services.DATA')" :editable="editable" v-model="checked" />
    </div>
    <div v-if="apns && apns.length" class="line">
      <span class="mt-4 mb-4">Apn:</span>

      <MultiChoiceList :items="apns" @change="toggleApn" />
    </div>
  </div>
  <div v-else class="single-service" :style="{ 'flex-basis': '92%' }">
    <div class="row">
      <div class="col">
        <UiToggle :label="$t('services.DATA')" :editable="editable" v-model="checked" />
      </div>
      <div class="col">
        <div v-if="apns && apns.length" class="apn-container">
          <span>Apn:</span>
          <MultiChoiceList :items="apns" @change="toggleApn" />
        </div>
      </div>
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
    vertical: Boolean,
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
      checked: this.service.checked,
      editable: this.service.editable,
      apns: this.service.parameters.map(s => ({
        ...s,
        code: s.code,
        label: s.label,
        selectable: s.editable,
        selected: s.active,
      })),
    };
    this.apns = data.apns;
    this.checked = data.checked;
    this.editable = data.editable;
    this.$emit('apnChange', this.apns);
  },
  methods: {
    toggleApn(apn) {
      this.apns = this.apns.map(a => {
        if (a.selectable && a.label === apn.label) {
          a.selected = !a.selected;
        }
        return a;
      });
      this.$emit('apnChange', this.apns);
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
