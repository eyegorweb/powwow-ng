<template>
  <div class="row">
    <div class="col">
      <FromMultiList :title="fromTitle" :items="items" @click="selectItem" />
    </div>
    <div class="col">
      <DestinationList
        :title="toTitle"
        v-if="selectedItems.length"
        :items="selectedItems"
        @click="removeItem"
      />
    </div>
  </div>
</template>

<script>
import FromMultiList from './FromMultiList';
import DestinationList from './DestinationList';

export default {
  components: {
    FromMultiList,
    DestinationList,
  },
  props: {
    /**
     * Format :
     *  {
          id: 1,
          label: 'Europe', <---- Group
          groupParent: true,
        },
        {
          id: 2,
          label: 'France', <---- Child
          parent: 1, <---- Obligatoire si il fait partie d'un groupe
        },
     */
    options: Array,
    fromTitle: String,
    toTitle: String,
  },
  methods: {
    selectItem(item) {
      this.items = this.items.map(i => {
        if (i.id === item.id) {
          i.selected = true;
          if (i.groupParent) {
            const childrens = this.items.filter(c => c.parent === item.id);
            for (let j = 0; j < childrens.length; j++) {
              this.selectItem(childrens[j]);
            }
          }
        }

        return i;
      });
    },
    removeItem(item) {
      this.items = this.items.map(i => {
        if (i.id === item.id) {
          i.selected = false;
          if (i.groupParent) {
            const childrens = this.items.filter(c => c.parent === item.id);
            for (let j = 0; j < childrens.length; j++) {
              this.removeItem(childrens[j]);
            }
          }
        }

        return i;
      });
    },
  },
  computed: {
    selectedItems() {
      return this.items.filter(i => i.selected);
    },
    items: {
      get() {
        return this.options;
      },
      set(values) {
        this.$emit('update:options', values);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
