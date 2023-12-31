<template>
  <div class="card">
    <div class="card-body">
      <h5 v-if="title" class="card-title">{{ $t(title) }}</h5>

      <div class="actions-carousel">
        <div class="slider-container" v-if="slickOptions">
          <slick ref="slick" :options="slickOptions">
            <ActionCarouselItem
              v-for="item in actions"
              :key="item.title"
              :icon="item.icon"
              :title="item.title"
              :subtitle="item.subtitle"
              :item="item"
              :default-disabled="checkDisable(item)"
              @click="() => $emit('itemClick', item)"
            />
          </slick>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slick from 'vue-slick';
import ActionCarouselItem from './ActionCarouselItem';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default {
  components: { Slick, ActionCarouselItem },
  name: 'ActionCarousel',
  props: {
    title: {
      type: String,
      required: false,
    },
    actions: {
      type: Array,
      required: true,
    },
    defaultDisabled: Boolean,
  },
  data() {
    return {
      slickOptions: undefined,
    };
  },

  mounted() {
    if (window.innerWidth <= 400) {
      this.slickOptions = {
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow:
          '<div class="slider-next slider-button d-block"><span class="ic-Arrow-Next-Icon"></span></div>',
        prevArrow:
          '<div class="slider-prev slider-button d-block"><span class="ic-Arrow-Previous-Icon"></span></div>',
      };
    }
    if (window.innerWidth < 780 && window.innerWidth > 400) {
      this.slickOptions = {
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        nextArrow:
          '<div class="slider-next slider-button d-block"><span class="ic-Arrow-Next-Icon"></span></div>',
        prevArrow:
          '<div class="slider-prev slider-button d-block"><span class="ic-Arrow-Previous-Icon"></span></div>',
      };
    }
    if (window.innerWidth > 780) {
      this.slickOptions = {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow:
          '<div class="slider-next slider-button d-block"><span class="ic-Arrow-Next-Icon"></span></div>',
        prevArrow:
          '<div class="slider-prev slider-button d-block"><span class="ic-Arrow-Previous-Icon"></span></div>',
      };
    }
  },
  methods: {
    checkDisable(item) {
      if (this.defaultDisabled) return true;
      if (item.isDisable) {
        return item.isDisable();
      }
      return false;
    },

    next() {
      this.$refs.slick.next();
    },

    prev() {
      this.$refs.slick.prev();
    },

    reInit() {
      this.$nextTick(() => {
        this.$refs.slick.reSlick();
      });
    },
  },
};
</script>

<style lang="scss">
.slider-container {
  padding: 0 3.75rem;
  // Override slick styles
  .slider-button {
    position: absolute;
    top: 50%;
    padding: 0.6rem 0.8rem;
    transform: translate(0, -50%);
    cursor: pointer;
    border: 1px solid $primary;
    border-radius: 3px;
  }
  .slider-button.slick-disabled {
    opacity: 0.25;
    cursor: default;
  }
  .slider-button span {
    font-size: 1.4rem;
    color: $primary;
    position: relative;
    top: 2px;
  }
  .slider-next {
    right: -3.7rem;
  }
  .slider-prev {
    left: -3.7rem;
  }
}
</style>
