<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <ul class="list-container list-unstyled">
          <li class="option" v-for="option in localOptions" :key="option">
            <span>{{ option }}</span>
            <a
              href="#"
              v-if="!disabled"
              @click.prevent="() => deleteOption(option)"
              :class="{ inner: isOpen, outter: !isOpen }"
              >{{ $t('delete') }}</a
            >
          </li>
          <li v-if="isAddingOption">
            <form @submit.prevent="addOption">
              <UiInput
                class="d-block"
                :placeholder="$t('orders.add-custom-field-to-list')"
                v-model="newOptionValue"
              />
              <button><i class="arrow ic-Plus-Icon"></i></button>
            </form>
          </li>
          <li v-if="!disabled && !isAddingOption" class="add-option">
            <a href="#" @click.prevent="startEditMode">
              <i class="arrow ic-Plus-Icon" />
              {{ $t('orders.add-custom-field-value') }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  props: {
    options: {
      type: Array,
    },
    isOpen: Boolean,
    disabled: Boolean,
  },
  computed: {
    localOptions: {
      get() {
        return this.options;
      },
      set(newOptions) {
        this.$emit('update:options', newOptions);
      },
    },
  },
  data() {
    return {
      isAddingOption: false,
      newOptionValue: '',
    };
  },
  methods: {
    deleteOption(optionToDelete) {
      this.localOptions = this.options.filter((o) => o !== optionToDelete);
    },
    startEditMode() {
      this.isAddingOption = true;
    },
    addOption() {
      if (this.newOptionValue) {
        this.localOptions = [...this.options, this.newOptionValue];
      }
      this.isAddingOption = false;
      this.newOptionValue = '';
    },
  },
  components: {
    UiInput,
  },
};
</script>

<style lang="scss" scoped>
.list-container {
  li {
    margin-top: 10px;
    &.option {
      border: 1px solid $medium-gray;
      border-radius: 3px;
      padding: 0.75rem 1.25rem;

      a {
        float: right;
        color: $gray;
        .outter {
          transform: translate(150%);
        }
        &.inner {
          transform: translateY(-20%);
        }
      }
    }
    &.add-option {
      a {
        color: $secondary;
        font-weight: 600;
        font-size: 0.9rem;
        appearance: none;
        padding: 0;
        margin: 0;
        border: none;
        background-color: transparent;

        &:hover {
          text-decoration: none;
        }

        i {
          font-size: 1rem;
        }
      }
    }

    form {
      position: relative;
    }
  }
}

button {
  padding: 0;
  margin: 0;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  color: $secondary;
}
</style>
