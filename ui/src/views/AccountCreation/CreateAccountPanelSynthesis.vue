<template>
  <div class="new-digital-offer-synthesis">
    <h6>{{ $t('digitalOffer.synthesis.title') }}</h6>
    <div class="synthesis-content">
      <CreateAccountPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import CreateAccountPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';

export default {
  components: {
    CreateAccountPanelSynthesisItem,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  computed: {
    formattedItems() {
      const formatted = [];

      if (this.$loGet(this.synthesis, 'creationAccountStep')) {
        if (this.$loGet(this.synthesis, 'creationAccountStep.companyName')) {
          formatted.push({
            label: 'digitalOffer.synthesis.company',
            value: {
              content: this.$loGet(this.synthesis, 'creationAccountStep.companyName'),
            },
          });

          if (this.$loGet(this.synthesis, 'creationAccountStep.address')) {
            formatted.push({
              label: 'digitalOffer.synthesis.billingAddress',
              value: {
                content: this.$loGet(this.synthesis, 'creationAccountStep.address'),
              },
            });
          }
        }
      }

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.name')) {
          formatted.push({
            label: 'digitalOffer.offer',
            value: {
              content: this.$loGet(this.synthesis, 'offerStep.name'),
            },
          });
        }
        // if (this.$loGet(this.synthesis, 'offerStep.price')) {
        //   formatted.push({
        //     label: 'digitalOffer.synthesis.price',
        //     value: {
        //       content: this.$loGet(this.synthesis, 'offerStep.price'),
        //     },
        //   });
        // }
      }

      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue')) {
          formatted.push({
            label: 'digitalOffer.simType',
            value: {
              content: this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.name'),
            },
          });
        }
      }

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.price')) {
          formatted.push({
            label: 'digitalOffer.synthesis.price',
            value: {
              content: this.$loGet(this.synthesis, 'offerStep.price') + ' €',
            },
          });
        }
      }

      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims')) {
          formatted.push({
            label: 'common.quantity',
            value: {
              content: this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims'),
            },
          });
        }
      }

      return formatted;
    },
  },
};
</script>

<style scoped lang="scss">
.new-digital-offer-synthesis {
  padding: 1em !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  .synthesis-content {
    overflow-y: auto;
    flex-grow: 1;
  }
  h6 {
    margin-bottom: 2em;
  }
  .footer {
    border-top: 1px solid $gray-400;
    button {
      font-size: 1rem;
    }
  }
}

@media screen and (max-height: 768px) {
  .new-digital-offer-synthesis {
    .footer ::v-deep label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}

@media (max-height: 588px) {
  .new-digital-offer-synthesis {
    .footer ::v-deep label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}
</style>
