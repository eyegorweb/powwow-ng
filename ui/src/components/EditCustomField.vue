<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <ul class="list-group list-unstyled">
          <li class="list-group-item" v-for="option in options" :key="option">
            <span>{{ option }}</span>
          </li>
          <li v-if="isAddingOption">
            <form @submit.prevent="addOption">
              <UiInput
                class="d-block"
                :placeholder="$t('orders.add-custom-field-to-list')"
                v-model="newOptionValue"
              />
              <button class="add-btn"><i class="arrow ic-Plus-Icon"></i></button>
            </form>
          </li>
          <li v-if="!isAddingOption" class="add-option">
            <div class="row">
              <div class="col">
                <a href="#" @click.prevent="startEditMode">
                  <i class="arrow ic-Plus-Icon" />
                  {{ $t('orders.add-custom-field-value') }}
                </a>
              </div>
              <div class="col">
                <button
                  class="btn btn-success mt-1 mb-2 btn-sm float-right"
                  @click.stop="$emit('close')"
                >
                  {{ $t('close') }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
      isAddingOption: false,
      newOptionValue: '',
    };
  },
  methods: {
    startEditMode() {
      this.isAddingOption = true;
    },
    addOption() {
      const alreadyInList = this.options.filter(o => o === this.newOptionValue).length;
      if (!alreadyInList && this.newOptionValue) {
        this.$emit('addValueToList', this.newOptionValue);
      }
      this.isAddingOption = false;
      this.newOptionValue = '';
    },
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
  position: absolute;
  right: 1rem;
  bottom: 3%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  color: $secondary;
}
</style>
