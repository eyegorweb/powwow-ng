<template>
  <div v-if="!vertical" class="s-container">
    <div class="line">
      <UiToggle
        :label="$t('services.DATA')"
        :editable="isEditable"
        v-model="checked"
        :no-click="noClick"
      />
    </div>
    <div v-if="apns && apns.length" class="line">
      <span class="mt-4 mb-4">Apn:</span>
      <MultiChoiceList
        :items="apns"
        @change="toggleApn"
        :empty-error-message="needToChekForApn"
        :disabled="isApnDisabled"
      />
    </div>
  </div>
  <div v-else class="single-service" :style="{ 'flex-basis': '92%' }">
    <div class="row">
      <div class="col">
        <UiToggle
          :label="$t('services.DATA')"
          :editable="isEditable"
          v-model="checked"
          :no-click="noClick"
        />
      </div>
      <div class="col">
        <div v-if="apns && apns.length" class="apn-container">
          <span>Apn:</span>
          <MultiChoiceList
            :empty-error-message="needToChekForApn"
            :items="apns"
            @change="toggleApn"
            :disabled="isApnDisabled"
          />
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
    dataParamsNeeded: Boolean,
    noClick: Boolean,
    readOnly: Boolean,
  },

  data() {
    return {
      editable: true,
      checked: false,
      apns: [],
    };
  },
  computed: {
    needToChekForApn() {
      return this.dataParamsNeeded && this.checked;
    },
    isEditable() {
      if (this.readOnly) return false;
      return !this.noClick && this.editable;
    },
    isApnDisabled() {
      if (this.readOnly) return true;

      return this.noClick || !this.checked;
    },
  },
  mounted() {
    const data = {
      checked: false,
      editable: this.service.editable,
      apns: this.service.parameters.map((s) => ({
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
      this.apns = this.apns.map((a) => {
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
        code: 'DATA',
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
