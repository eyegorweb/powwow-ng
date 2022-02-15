<template>
  <VerticalEmptyContainer
    :validate-fn="validate"
    :confirm-msg="confirmationMessage"
    no-confirm-translation
  >
    <div slot="main">
      <div class="pricing">
        <div v-if="packages" class="pricing-container">
          <div class="card" v-for="(offer, index) in packages" :key="index">
            <OfferCard
              :offer="offer"
              :recharge="true"
              :is-active="offer === currentOffer"
              @select:offer="getCurrentOffer"
            />
          </div>
        </div>
      </div>
    </div>
    <div slot="bottom" slot-scope="{ containerValidationFn }">
      <div class="row">
        <div class="col-md-4">
          <UiDate
            @change="onActDateChange"
            :value="actDate"
            :error="dateError"
            class="d-block"
            :min-date="minDate"
            time-picker
            fixed
          >
            <em slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col-md-4">
          <Button
            @click="containerValidationFn"
            variant="primary"
            :disabled="!currentOffer || isLoading"
            >{{ $t('getparc.actCreation.carouselItem.RECHARGE_LINES_BTN') }}
          </Button>
          <CircleLoader class="load" v-if="isLoading" />
        </div>
      </div>
    </div>
    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </VerticalEmptyContainer>
</template>

<script>
import VerticalEmptyContainer from './parts/VerticalEmptyContainer';
import OfferCard from '@/views/AccountCreation/OfferCard.vue';
import UiDate from '@/components/ui/UiDate';
import Button from '@/components/ui/Button';
import CircleLoader from '@/components/ui/CircleLoader';
import moment from 'moment';
import { fetchODOffers, rechargeLineOD } from '@/api/offers.js';
import { mapState, mapGetters } from 'vuex';
import { formattedCurrentDateExtended } from '@/utils/date.js';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    VerticalEmptyContainer,
    UiDate,
    OfferCard,
    Button,
    CircleLoader,
  },
  data() {
    return {
      packages: undefined,
      exceptionError: undefined,
      actDate: null,
      dateError: null,
      currentOffer: undefined,
      workflowId: undefined,
      isLoading: false,
    };
  },
  computed: {
    ...mapState('actLines', [
      'linesActionsResponse',
      'selectedLinesForActCreation',
      'actCreationPrerequisites',
    ]),
    ...mapGetters('actLines', ['appliedFilters']),
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
    confirmationMessage() {
      if (this.currentOffer) {
        return `${this.$t('getparc.actCreation.rechargeOD.confirm')} "${
          this.currentOffer.label
        }" ?`;
      }

      return '';
    },
  },
  async mounted() {
    let response = undefined;
    const workflowDescription =
      this.linesActionsResponse && this.linesActionsResponse.items
        ? this.$loGet(this.linesActionsResponse.items[0], 'workflow.workflowDescription', '')
        : '';
    if (this.actCreationPrerequisites && this.actCreationPrerequisites.partner) {
      response = await fetchODOffers(
        this.actCreationPrerequisites.partner.id,
        this.actCreationPrerequisites.offer.label
      );
    } else if (workflowDescription) {
      response = await fetchODOffers('', workflowDescription);
    }
    if (response.items && response.items.length) {
      this.packages = response.items[0].offerPackages;
      this.packages = this.$loGet(response.items[0], 'offerPackages', []);
      this.workflowId = this.$loGet(response.items[0], 'id', []);
    }

    this.actDate = formattedCurrentDateExtended();
  },
  methods: {
    getCurrentOffer(offer) {
      this.currentOffer = offer.selectedOffer;
    },
    onActDateChange(value) {
      this.actDate = value;
    },
    async validate() {
      this.isLoading = true;
      const envelopeLabel = this.currentOffer.label;
      const simCardIds = this.selectedLinesForActCreation.map((i) => i.id);
      const response = await rechargeLineOD(
        this.actCreationPrerequisites.partner.id,
        this.actDate,
        this.workflowId,
        envelopeLabel,
        simCardIds,
        'DIGITAL_OFFER'
      );
      this.isLoading = false;

      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }
        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      } else {
        window.location.href = response.url;
      }
      return response;
    },
  },
};
</script>

<style lang="scss" scoped>
$main-font-color: #808080;
$main-font-weight: 300;
$primary-color: #57e2b2;

.pricing {
  .pricing-container {
    display: flex;
    flex-wrap: wrap;
  }
  .entry {
    flex-basis: 24.3333333%;

    ul {
      min-height: 6rem;
    }
  }
  .card {
    border: none;
    margin-right: 10px;
  }
  // Price
  .display-2 {
    font-size: 2rem;
    & .currency {
      font-size: 0.95rem;
      position: relative;
      font-weight: $main-font-weight + 100;
      letter-spacing: 0px;
    }
    & .period {
      font-size: 1rem;
      color: lighten($main-font-color, 20%);
      letter-spacing: 0px;
    }
  }

  // Buttons
  .btn {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: $main-font-weight + 200;
    color: lighten($main-font-color, 15%);
    border-radius: 0;
    padding: 0.75rem 1.25rem;
    letter-spacing: 1px;
  }

  .btn-gradient {
    background-color: #f2f2f2;
    transition: background 0.3s ease-in-out;

    &:hover {
      color: white;
      background-color: $primary;
    }
  }
}
.load {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
