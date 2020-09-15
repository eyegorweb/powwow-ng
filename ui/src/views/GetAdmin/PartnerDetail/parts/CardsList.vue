<template>
  <div>
    <div v-if="items && items.length > 0" class="mb-3">
      <div class="col-md-6">
        <h6>{{ $t(searchInputTxt) }}</h6>
        <UiInput :placeholder="$t(placeholderTxt)" class="d-block mx-auto" v-model="filterValue" />
      </div>
    </div>
    <div class="cards">
      <div v-if="!noEdit" class="addNew" @click="$emit('create')">
        <div class="addNew-logo">
          <i :class="`icon ${addIcon}`"></i>
        </div>
        <div>{{ $t(addTxt) }}</div>
      </div>
      <div
        v-if="noEdit && (!filteredItems || (filteredItems && !filteredItems.length))"
        class="alert alert-light"
        role="alert"
      >
        {{ $t('noResult') }}
      </div>
      <Card
        v-for="list in filteredItems"
        :key="list.id"
        :can-delete="canDelete"
        :canModify="!noEdit"
        @modify="$emit('modify', list)"
      >
        <slot :item="list" />
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    Card,
    UiInput,
  },

  props: {
    searchInputTxt: String,
    placeholderTxt: String,
    addTxt: String,
    addIcon: String,
    fetchFn: Function,
    filterFn: Function,
    noEdit: Boolean,
    canDelete: Boolean
  },

  data() {
    return {
      items: undefined,
      filterValue: '',
      filteredItems: [],
    };
  },

  mounted() {
    this.refreshLists();
  },

  methods: {
    async refreshLists() {
      this.filteredItems = await this.fetchFn();
      this.items = [...this.filteredItems];
    },
  },

  watch: {
    filterValue(q) {
      this.filteredItems = this.filterFn(q, this.items);
    },
  },
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .addNew {
    width: 49%;
    height: 220px;
    border-radius: 5px;
    font-size: 14px;
    padding: 20px;
    border: #dddddd solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    flex-direction: column;
    cursor: pointer;

    &-logo {
      width: 50px;
      height: 50px;
      background-color: #009dcc;
      border-radius: 100px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        color: white;
      }
    }
  }
}

.alert {
  width: 100%;
}
</style>
