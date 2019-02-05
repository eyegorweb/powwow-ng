<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-delivery') }}</h2>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h6>Dernière adresse de livraison utilisée:</h6>

        <CreateOrderStepDeliveryOption
          :item="lastSelectedAdress"
          :default-selected-item="selectedAdress"
          @update:defaultSelectedItem="selectAdress"
          :is-active="selectedAdress.id === lastSelectedAdress.id"
          name="lastAdresses"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h6>Rechercher une adress</h6>
        <UiInput
          placeholder="Saisir un nom ou une adresse"
          class="d-block mx-auto"
          v-model="filterValue"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="adresses">
          <CreateOrderStepDeliveryOption
            v-for="adress in filteredAdresses" :key="adress.id"
            :item="adress"
            :default-selected-item="selectedAdress"
            :is-active="selectedAdress.id === adress.id"
            @update:defaultSelectedItem="selectAdress"
            name="otherAdresses"
          />
        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-md-12 mt-5">
        <UiButton
          variant="round-button"
          @click="$emit('prev')"
          class="float-left ic-Arrow-Previous-Icon"
        />
        <UiButton
          variant="round-button"
          @click="done"
          class="float-right ic-Arrow-Next-Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import CreateOrderStepDeliveryOption from './CreateOrderStepDeliveryOption';

export default {
  name: 'CreateOrderStepDelivery',

  components: {
    UiButton,
    UiInput,
    CreateOrderStepDeliveryOption,
  },

  mounted() {
    this.filteredAdresses = [...this.adresses];
  },

  methods: {
    selectAdress(newAdress) {
      console.log('Selected Adress > ', newAdress);
      this.selectedAdress = newAdress;
    },

    done() {
      this.$emit('done', {
        delivery: {
          label: 'common.delivery',
          value: {
            id: this.selectedAdress.id,
            content: [this.selectedAdress.title, this.selectedAdress.description],
          },
        },
      });
    },
  },

  watch: {
    filterValue(q) {
      if (!q) {
        this.filteredAdresses = [...this.adresses];
      } else {
        const query = q.toLowerCase();
        this.filteredAdresses = this.adresses.filter(
          a => a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
        );
      }
    },
  },

  data() {
    return {
      filterValue: '',
      lastSelectedAdress: {
        id: 8,
        title: 'Mme Amélie Delacour2',
        description:
          'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
      },
      filteredAdresses: [],
      adresses: [
        {
          id: 1,
          title: 'John Doe',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France',
        },
        {
          id: 2,
          title: 'Will smith',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },

        {
          id: 3,
          title: 'Jack Black',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },
        {
          id: 4,
          title: 'Leroy Jenkins',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },
        {
          id: 5,
          title: 'Patrice oneil',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },
      ],
      selectedAdress: {},
    };
  },
};
</script>

<style lang="scss" scoped>
/* voir comment gérer le css en double */
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

.step-client-container {
  padding: 0 2rem !important;
}

.adresses {
  display: flex;
  flex-flow: column wrap;
  overflow: auto;
  .adress {
    width: calc((100% / 2) - 20px);
    margin: 0.5em;
  }
}
@media screen and (max-height: 768px) {
  .adresses {
    height: 11rem;
  }
}
@media screen and (min-height: 769px) {
  .adresses {
    height: 20rem;
  }
}
</style>
