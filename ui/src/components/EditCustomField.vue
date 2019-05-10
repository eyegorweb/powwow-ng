<template>
  <div>
    <form @submit.prevent="addOption">
      <div class="form-container">
        <UiInput
          class="d-block"
          :placeholder="$t('orders.add-custom-field-to-list')"
          v-model="newOptionValue"
        />
        <button class="add-btn"><i class="arrow ic-Plus-Icon"></i></button>
        <div class="add-option">
          <button class="btn btn-danger mt-1 mb-2 btn-sm float-right" @click.stop="$emit('close')">
            {{ $t('close') }}
          </button>
        </div>
      </div>
    </form>
    <ul class="list-group list-unstyled limited-size-list">
      <li class="list-group-item" v-for="option in options" :key="option">
        <span>{{ option }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    UiInput,
  },
  props: {
    partyId: String,
    options: Array,
  },
  data() {
    return {
      newOptionValue: '',
    };
  },
  methods: {
    addOption() {
      const alreadyInList = this.options.filter(o => o === this.newOptionValue).length;
      if (!alreadyInList && this.newOptionValue) {
        this.$emit('addValueToList', this.newOptionValue);
      }
      this.newOptionValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.limited-size-list {
  max-height: 24rem;
  overflow-y: auto;
}
.form-container {
  display: flex;
  flex-flow: row nowrap;
  label {
    flex-grow: 2;
  }
}
.list-container {
  li {
    margin-top: 10px;
    &.option {
      border: 1px solid $medium-gray;
      border-radius: 3px;
      padding: 0.75rem 1.25rem;

      a {
        float: right;
        transform: translateX(150%);
        color: $gray;
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

button.add-btn {
  padding: 0;
  margin: 0;
  position: relative;
  right: 1.5rem;
  top: 1.4rem;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  color: $secondary;
}
</style>
