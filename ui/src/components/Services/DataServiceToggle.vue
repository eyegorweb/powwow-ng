<template>
  <div v-if="!vertical" class="scontainer w80">
    <div class="line">
      <UiToggle
        :label="$t('services.DATA')"
        :editable="isEditable"
        v-model="checked"
        :no-click="noClick"
        :bold-label="boldLabel"
        :can-change-fn="canChangeFn"
      />
    </div>
    <div v-if="apns && apns.length" class="line">
      <span class="mt-4 mb-4 ml-2">Apn:</span>
      <MultiChoiceList
        :items="apns"
        @change="toggleApn"
        :empty-error-message="needToChekForApn"
        :disabled="isApnDisabled"
        class="ml-2"
      />
    </div>
  </div>
  <div v-else class="single-service">
    <div>
      <div>
        <UiToggle
          :label="$t('services.DATA')"
          :editable="isEditable"
          v-model="checked"
          :no-click="noClick"
          :bold-label="boldLabel"
          :can-change-fn="canChangeFn"
        />
      </div>
      <div class="apn-container">
        <div v-if="apns && apns.length" class="apn-content">
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
    boldLabel: Boolean,
    canChangeFn: {
      type: Function,
      required: false,
    },
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
      checked: this.service.checked,
      editable: this.service.editable,
      apns: this.service.parameters.map((s) => ({
        ...s,
        code: s.code,
        label: s.label,
      })),
    };
    this.apns = data.apns;
    this.checked = data.checked;
    this.editable = data.editable;
    this.$emit('apnChange', this.apns);
  },
  methods: {
    toggleApn(apn) {
      let apnChanged = false;
      this.apns = this.apns.map((a) => {
        if (a.selectable && a.label === apn.label) {
          a.selected = !a.selected;
          apnChanged = true;
        }
        return a;
      });
      if (apnChanged) {
        this.changeValue();
      }
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
      // this.changeValue();
    },
    service(value) {
      this.checked = value.checked;
      this.apns = value.parameters.map((s) => ({
        ...s,
        code: s.code,
        label: s.label,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.w80 {
  width: 80%;
}

.apn {
  &-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  &-content {
    max-width: 90%;
    width: 100%;
  }
}
.single-service {
  max-width: 220px;
}
.scontainer {
  display: flex;
  flex-direction: column;
  .line {
    margin-bottom: 1.5rem;
  }
}
</style>
