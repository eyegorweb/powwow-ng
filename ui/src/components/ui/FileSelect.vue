<template>
  <label class="file-select d-block">
    <div class="select-button" :class="{ disabled: disabled }">
      <span v-if="value">{{ value.name }}</span>
      <span v-else>{{ $t('filters.lines.fromFile.import-file') }}</span>
    </div>
    <input :key="version" type="file" @change="handleFileChange" :disabled="disabled" />
  </label>
</template>

<script>
export default {
  props: {
    value: File,
    disabled: Boolean,
  },
  data() {
    return {
      version: 0,
    };
  },

  watch: {
    /**
     * Il faut recréer l'input car le navigateur ne permet pas de reséléctionner un fichier précédement séléctionné
     */
    value(newValue) {
      if (!newValue) {
        this.version += 1;
      }
    },
  },

  methods: {
    handleFileChange(e) {
      this.$emit('input', e.target.files[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.file-select > .select-button {
  padding: 1rem;

  background-color: $primary;
  color: $white;

  border-radius: 0.3rem;

  text-align: center;
  font-weight: bold;
  &.disabled {
    background: #dddddd;
    cursor: default;
    opacity: 0.65;
  }
}

.file-select > input[type='file'] {
  display: none;
}
</style>
