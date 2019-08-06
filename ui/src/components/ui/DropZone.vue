<template>
  <div
    class="zone-container bg-white"
    :class="{ hovering, haveFile: !!value }"
    @dragenter="hovering = true"
    @dragleave="hovering = false"
    @dragend="hovering = false"
    @drop="hovering = false"
  >
    <input type="file" @change="onFileSelected" :key="version" />
    <div class="text-container">
      <p v-if="!value">Déposez votre fichier ici, ou cliquez pour ajouter</p>
      <p v-if="value">{{ value.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: File,
  },
  data() {
    return {
      hovering: false,
      fileName: undefined,
      version: 0,
    };
  },
  methods: {
    onFileSelected(event) {
      this.$emit('input', event.target.files[0]);
    },
  },

  watch: {
    /**
     * Il faut recréer l'input car le navigateur ne permet pas de reséléctionner un fichier précédement séléctionné
     */
    value() {
      this.version += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 10rem;
.zone-container {
  height: $height;
  border: 4px dashed $secondary;

  &.hovering {
    border: 4px dashed $success;
  }

  .text-container {
    display: flex;
    height: 100%;

    p {
      font-size: 2rem;
      width: 100%;
      align-self: center;
      text-align: center;
      color: $secondary;
    }
  }
  &.haveFile {
    border: 4px solid $success;

    & /deep/ p {
      color: $success;
    }
  }
  input {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: $height;
    outline: none;
    opacity: 0;
  }
}
</style>
