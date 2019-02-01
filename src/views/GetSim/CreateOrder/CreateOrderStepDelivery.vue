<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-delivery') }}</h2>
    </div>

    <div class="row">
      <div class="col-md-12">
        <CreateOrderStepDeliveryOption
          :item="lastSelectedAdress"
          :default-selected-item.sync="selectedAdress"
          :is-active="selectedAdress.id === lastSelectedAdress.id"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <UiInput
          placeholder="Saisir un nom ou une adresse"
          class="d-block mx-auto"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h6>Dernière adresse de livraison utilisée:</h6>
        <div class="adresses">
          <CreateOrderStepDeliveryOption
            v-for="adress in adresses" :key="adress.id"
            :item="adress"
            :default-selected-item.sync="selectedAdress"
            :is-active="selectedAdress.id === adress.id"
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
          @click="$emit('done')"
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

  data() {
    return {
      lastSelectedAdress: {
        id: 2,
        title: 'Mme Amélie Delacour2',
        description:
          'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
      },
      adresses: [
        {
          id: 1,
          title: 'Mme Amélie Delacour',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France',
        },
        {
          id: 2,
          title: 'Mme Amélie Delacour2',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },

        {
          id: 3,
          title: 'Mme Amélie Delacour2',
          description:
            'Lebara France - Bât E 8 rue du Lorem Ipsum Amet Sit 75698 Paris Cedex 15 - France2',
        },
        {
          id: 4,
          title: 'Mme Amélie Delacour2',
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
  flex-flow: row wrap;
  .adress {
    width: calc((100% / 2) - 20px);
    margin: 0.5em;
  }
}
</style>
