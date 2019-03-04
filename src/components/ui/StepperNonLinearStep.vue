<template>
  <div class="step" :class="{'validated': validated}">
    <div class="checkmark-line"><CheckMark :checked="validated" :is-error="isError" /></div>
    <p class="label" :class="{'is-error': isError }">{{ label }}</p>
    <p class="time">{{ date }}</p>
  </div>
</template>

<script>
import CheckMark from '@/components/ui/CheckMark';

export default {
  data() {
    return {
      validated: false,
    };
  },
  mounted() {
    this.validated = this.index <= this.currentIndex ? true : false;
  },
  props: {
    label: String,
    date: String,
    currentIndex: Number,
    index: Number,
    isError: Boolean,
  },
  components: {
    CheckMark,
  },
};
</script>

<style lang="scss" scoped>
//reset css
p {
  margin-bottom: 0;
}

.circle-loader {
  margin-top: 0;
}

.step {
  color: $gray-680;
  font-size: 12px;
  flex-grow: 1;

  .checkmark-line {
    position: relative;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      background-color: $medium-gray;
      width: calc(100% - (24px + 10px));
      height: 2px;
      transition: all 500ms ease-out;
    }
  }

  &.validated {
    .label {
      color: $success;
      &.is-error {
        color: $orange;
      }
    }

    .checkmark-line {
      position: relative;

      &:after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        background-color: $success;
        width: calc(100% - (24px + 10px));
        height: 2px;
        transition: all 500ms ease-out;
      }
    }
  }

  .label {
    margin-top: 10px;
  }

  .time {
    font-size: 10px;
  }
  &:last-child {
    .checkmark-line {
      position: relative;

      &:after {
        content: '';
        display: none;
      }
    }
  }
}

//resize de la checkbox
.circle-loader {
  margin-top: 3px; //pour compenser le scale
  transform: scale(1.2);
}
</style>
