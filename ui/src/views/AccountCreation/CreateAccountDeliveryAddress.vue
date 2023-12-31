<template>
  <div class="box adress" :class="{ active: isActive }">
    <div class="adress__item d-flex">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        :name="name"
        :value="item"
      />
      <div v-if="item" class="simTypeIfos flex-container-v">
        <p v-if="item.company" class="adress__name m-0 flex-fixed">
          {{ item.company }}
        </p>
        <p class="adress__name m-0 flex-fixed">{{ firstName }} {{ lastName }}</p>
        <p class="adress__format m-0 flex-fill">
          {{ address }}
          <span v-if="item.address2 && item.address2 !== 'null'">
            <br />
            {{ item.address2 }}</span
          >
          <span v-if="item.address3 && item.address3 !== 'null'">
            <br />
            {{ item.address3 }}</span
          >
          <br v-if="item.city" />
          {{ item.zipCode }} - {{ item.city }}

          <br v-if="item.country.label" />
          {{ item.country.label }}
        </p>
        <footer v-if="canEdit" class="flex-fixed">
          <a href="#" @click.prevent="$emit('modify', item)">{{ $t('modify') }}</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'CreateAccountDeliveryAddress',
  props: {
    item: Object,
    name: String,
    defaultSelectedItem: Object,
    isActive: Boolean,
    canEdit: Boolean,
  },
  computed: {
    address() {
      if (typeof this.item.address === 'object') {
        return this.item.address.address1;
      } else {
        return this.item.address.replace(this.item.city, '').replace(this.item.zipCode, '');
      }
    },
    selectedItem: {
      get() {
        return this.defaultSelectedItem;
      },
      set(newSelected) {
        this.$emit('update:defaultSelectedItem', newSelected);
      },
    },
    firstName() {
      return this.item.name && this.item.name.firstName
        ? this.item.name.firstName
        : this.item && this.item.firstName
        ? this.item.firstName
        : '';
    },
    lastName() {
      return this.item.name && this.item.name.lastName
        ? this.item.name.lastName
        : this.item && this.item.lastName
        ? this.item.lastName
        : '';
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
