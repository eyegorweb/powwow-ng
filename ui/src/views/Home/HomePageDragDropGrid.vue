<template>
  <ul ref="homepageGrid" class="sortable-grid">
    <li
      v-for="widget in widgets"
      :id="widget.title"
      :key="widget.title"
      :class="{
        'large-widget': widget.large,
        'small-widget': !widget.large,
        'hidden-widget': !widget.checked,
        'responsive-widget': isResponsive,
      }"
      class="sortable-grid-item"
    >
      <component
        :is="widget.component"
        v-if="widget.component && widget.checked"
        :widget="widget"
        :context-filters="contextFilters"
      />
    </li>
  </ul>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';

export default {
  props: {
    widgets: Array,
    contextFilters: Array,
  },

  mounted() {
    this.initSortable();
  },

  computed: {
    ...mapGetters(['userIsM2MLight']),
    isResponsive() {
      return this.userIsM2MLight;
    },
  },

  methods: {
    notifyOrderChange() {
      const newWidgets = $(this.$refs.homepageGrid)
        .find('li')
        .map(function() {
          return $(this).attr('id');
        })
        .toArray()
        .map((id) => {
          return this.widgets.find((w) => w.title === id);
        });

      this.$emit('change', newWidgets);
    },
    initSortable() {
      $('.sortable-grid').sortable({
        handle: '.handle',
        start(e, ui) {
          ui.item.show();
        },
        stop: () => {
          this.notifyOrderChange();
        },
      });

      setTimeout(() => {
        $('.sortable-grid-item').draggable({
          connectToSortable: '.sortable-grid',
          revert: 'invalid',
          handle: '.handle',
        });
      });
    },
  },
};
</script>

<style lang="scss">
.sortable-grid {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.sortable-grid-item {
  padding: 1px;
  height: 19.8rem;
  display: inline-block;
  vertical-align: top;
}

.large-widget {
  width: 66%;
  @media screen and (max-width: 560px) {
    &.responsive-widget {
      width: 100%;
    }
  }
}

.small-widget {
  width: 33%;
  @media screen and (max-width: 560px) {
    &.responsive-widget {
      width: 100%;
    }
  }
}

.hidden-widget {
  display: none;
}
</style>
