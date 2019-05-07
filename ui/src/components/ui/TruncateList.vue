<template>
  <div>
    <div v-if="content.length <= limit">
      <button
        v-for="(id, index) in list"
        :key="id"
        class="btn btn-link p-0 id"
        @click.prevent="openDetails"
      >
        {{ index ? ', ' : '' }}{{ id }}
      </button>
    </div>
    <div v-else>
      <button
        v-for="(id, index) in list"
        :key="id"
        class="btn btn-link p-0 id"
        @click.prevent="openDetails"
      >
        {{ index ? ', ' : '' }}{{ id }}
      </button>
      <button
        v-if="displaysTruncatedData"
        class="truncate see-less"
        @click="displaysTruncatedData = !displaysTruncatedData"
      >
        &nbsp;-
      </button>
      <button
        v-else
        class="truncate see-more"
        @click="displaysTruncatedData = !displaysTruncatedData"
      >
        &nbsp;+<span class="remaining-items">{{ remainingItems }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displaysTruncatedData: false,
    };
  },
  props: {
    limit: {
      type: Number,
      required: true,
    },
    content: {
      type: Array,
      required: true,
    },
  },
  computed: {
    list() {
      return this.displaysTruncatedData ? this.content : this.content.slice(0, this.limit);
    },
    remainingItems() {
      return this.content.length - this.limit;
    },
  },
  methods: {
    openDetails() {
      console.log('ouverture détail de l acte');
    },
  },
};
</script>

<style lang="scss" scoped>
.truncate {
  display: inline;
  outline: 0;
  border: 0;
  background-color: transparent;
  color: $secondary;
  font-weight: bold;
  font-size: 28px;

  &.see-more {
    font-size: 18px;

    .remaining-items {
      font-size: 14px;
      vertical-align: baseline;
    }
  }
}
</style>
