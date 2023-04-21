<template>
  <div class="single-service">
    <div>
      <div>
        <UiToggle
          :label="service.labelService"
          :editable="isEditable"
          v-model="checked"
          :no-click="noClick"
          :bold-label="boldLabel"
          :can-change-fn="canChangeFn"
        />
      </div>
      <div>
        <div v-if="profiles && profiles.length" class="mt-2">
          <UiSelect
            v-model="chosenProfile"
            :placeholder="$t('orders.select-profil-placeholder')"
            :options="profiles"
            :arrow-blue="true"
            block
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiToggle,
    UiSelect,
  },

  props: {
    service: Object,
    profileData: Object,
    vertical: Boolean,
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
      profiles: [],
      defaultProfilCode: undefined,
    };
  },
  computed: {
    chosenProfile: {
      get() {
        return this.profile ? this.profile.code : undefined;
      },
      set(value) {
        const profile = this.profiles.find((o) => o.code === value);
        this.changeValue(profile);
      },
    },
    profile() {
      let profile = this.profileData;
      if (!profile && this.defaultProfilCode) {
        profile = this.profiles.find((p) => p.code === this.defaultProfilCode);
      }
      return profile;
    },

    isEditable() {
      return this.editable;
    },
  },
  mounted() {
    this.defaultProfilCode = this.getDefaultProfilCode();
    const data = {
      checked: this.service.checked,
      editable: this.service.editable,
      profiles: this.service.parameters.map((s) => ({
        ...s,
        code: s.code,
        label: s.label,
        active: false,
        value: s.code,
        disabled: false,
      })),
    };
    this.profiles = data.profiles;
    this.checked = data.checked;
    this.editable = data.editable;
    this.$emit('initprofiles', this.profiles);
  },
  methods: {
    changeValue(profileData) {
      this.$emit('change', {
        checked: this.checked,
        profile: profileData,
        code: 'UPF',
        defaultProfilCode: this.defaultProfilCode,
      });
    },
    getDefaultProfilCode() {
      let result = undefined;
      if (this.service && this.service.parameters) {
        const profiles = this.service.parameters.filter((p) => p.active);
        if (profiles && profiles.length === 1) {
          result = profiles[0].code;
        }
      }
      return result;
    },
  },
  watch: {
    checked() {
      this.changeValue(this.profileData);
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
  width: 100%;
  min-width: 250px;
}

.scontainer {
  display: flex;
  flex-direction: column;

  .line {
    margin-bottom: 1.5rem;
  }
}
</style>
