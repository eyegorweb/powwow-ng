<template>
  <div class="box adress" :class="{ 'active': isActive }">
    <div class="adress__item d-flex">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        :name="name"
        :value="item"
      />
      <div v-if="item" class="simTypeIfos flex-container-v">
        <p v-if="item.name" class="adress__name m-0 flex-fixed">{{ item.name.firstName }} {{ item.name.lastName }}</p>
        <p class="adress__format m-0 flex-fill">
          {{ item.address.address1 }}
          <span v-if="item.address.address2 && item.address.address2 !=='null'"> <br> {{ item.address.address2 }}</span>
          <span v-if="item.address.address3 && item.address.address3 !=='null'"> <br> {{ item.address.address3 }}</span>
          <br v-if="item.address.city"> {{ item.address.zipCode }} - {{ item.address.city }}
        </p>
        <footer class="flex-fixed">
          <a href="#">Modifier</a>
        </footer>
      </div>

    </div>

  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'CreateOrderStepDeliveryOption',
  props: {
    item: Object,
    name: String,
    defaultSelectedItem: Object,
    isActive: Boolean,
  },
  computed: {
    selectedItem: {
      get() {
        return this.defaultSelectedItem;
      },
      set(newSelected) {
        this.$emit('update:defaultSelectedItem', newSelected);
      },
    },
  },
  components: {
    UiCheckbox,
  },
};
</script>

<style lang="scss" scoped>
.adress {
  border: 1px solid $medium-gray;
  border-radius: 0.2rem;
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 10px 20px 10px 15px;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
  overflow: hidden;

  &.active {
    border: 1px solid $blue;

    .adress__name {
      color: $blue;
    }
  }

  p {
    color: $dark-gray;
    font-size: 0.8rem;
    text-align: left;

    &.adress__name {
      font-size: 0.9rem;
    }

    &.adress__order-status {
      color: $gray-680;
    }
    &.adress__format {
      font-size: 0.7rem;
    }
  }
}

.flex-container-v {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: -ms-flex;
  display: flex;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}

.flex-fill {
  -webkit-flex: 0 1 auto;
  -moz-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}
.flex-fixed {
  -webkit-flex: 0 0 auto;
  -moz-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
</style>
