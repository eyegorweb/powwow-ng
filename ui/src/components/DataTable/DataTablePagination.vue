<template>
  <ul class="pagination mb-0">
    <li class="page-item" :class="{ disabled: page <= 1 }">
      <button class="page-link" @click="previousPage()">
        <span class="ic-Arrow-Previous-Icon" />
      </button>
    </li>
    <li
      class="page-item page-nb"
      :class="{ active: isPageActive(index) }"
      :key="'page_' + index"
      v-for="index in pagesToShow"
    >
      <button class="page-link" @click="gotoPage(index)">{{ index }}</button>
    </li>

    <li class="page-item" :class="{ disabled: page >= pageCount }">
      <button class="page-link" @click="nextPage()">
        <span class="ic-Arrow-Next-Icon" />
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    pageLimit: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pageWindow: 3,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageLimit);
    },
    pagesToShow() {
      if (this.pageCount > this.pageWindow) {
        // first x pages
        if (this.page <= this.pageWindow - 1) {
          return this.pageWindow;
        }

        // last x pages
        if (this.page === this.pageCount) {
          // TODO: générer dynamiquement ce tableau ?
          return [this.pageCount - 2, this.pageCount - 1, this.pageCount];
        }
        return [this.page - 1, this.page, this.page + 1];
      }

      if (this.pageCount <= this.pageWindow) {
        return this.pageCount;
      }

      return [];
    },
  },
  methods: {
    isPageActive(index) {
      return index === this.page;
    },
    gotoPage(newPageNb) {
      this.$emit('update:page', newPageNb);
    },
    previousPage() {
      this.gotoPage(this.page - 1);
    },
    nextPage() {
      this.gotoPage(this.page + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-item {
  border: none;

  .page-link {
    border-color: $white;
  }

  &.disabled {
    button {
      color: #e1e1e1;
      background-color: $light-gray;
      border-color: currentColor;
    }
  }

  &.active {
    .page-link {
      color: inherit;
      background-color: inherit;
    }
  }
}

.page-nb {
  button {
    background-color: transparent;
    border: none;
    font-weight: 500;
    color: $gray;
  }
  &.active button {
    color: $primary;
    background-color: transparent;
    z-index: inherit;
  }
}
</style>
