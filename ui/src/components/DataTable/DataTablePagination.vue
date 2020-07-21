<template>
  <ul class="pagination list-unstyled">
    <li :class="{ disabled: page <= 1 }" @click="gotoFirst()">&laquo;</li>
    <li :class="{ disabled: page <= 1 }" @click="previousPage()">&lt;</li>
    <li
      :class="{ active: isPageActive(index) }"
      :key="'page_' + index"
      v-for="index in pagesToShow"
      @click="gotoPage(index)"
    >
      {{ index }}
    </li>
    <li @click="nextPage()">&gt;</li>
    <li @click="gotoLast()">&raquo;</li>
  </ul>
</template>

<script>
function getPagingRange(current, { min = 1, total = 20, length = 5 } = {}) {
  if (length > total) length = total;

  let start = current - Math.floor(length / 2);
  start = Math.max(start, min);
  start = Math.min(start, min + total - length);

  return Array.from({ length }, (el, i) => start + i);
}

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
      pageWindow: 5,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageLimit);
    },
    pagesToShow() {
      return getPagingRange(this.page, { total: this.pageCount, length: this.pageWindow });
    },
  },
  methods: {
    gotoFirst() {
      this.gotoPage(1);
    },
    gotoLast() {
      this.gotoPage(this.pageCount);
    },
    isPageActive(index) {
      return index === this.page;
    },
    gotoPage(newPageNb) {
      this.$emit('update:page', newPageNb);
    },
    previousPage(nb = 1) {
      if (this.page - nb > 0) {
        this.gotoPage(this.page - nb);
      }
    },
    nextPage(nb = 1) {
      if (this.page + nb <= this.pageCount) {
        this.gotoPage(this.page + nb);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  li {
    padding: 0;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;

    &.disabled {
      color: $gray-400;
    }

    &.active {
      background: $primary;
      color: white;
    }

    &:hover {
      cursor: pointer;
      background: $medium-gray;

      &.active {
        cursor: pointer;
        background: $primary;
      }
    }
  }
}
</style>
