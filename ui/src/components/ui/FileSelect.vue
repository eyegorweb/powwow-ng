<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <ModalSkeleton :is-loading="isLoading" />
    </div>
    <label class="file-select d-block">
      <div class="select-button" :class="{ disabled: disabled }">
        <span v-if="value">{{ value.name }}</span>
        <span v-else>{{ placeholder }}</span>
      </div>
      <input :key="version" type="file" @change="handleFileChange" :disabled="disabled" />
    </label>
  </LoaderContainer>
</template>

<script>
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';

export default {
  components: {
    LoaderContainer,
    ModalSkeleton,
  },

  props: {
    value: File,
    disabled: Boolean,
    placeholder: String,
    isLoading: Boolean,
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
