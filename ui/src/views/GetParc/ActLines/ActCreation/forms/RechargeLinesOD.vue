<template>
  <VerticalEmptyContainer
    :validate-fn="validate"
    :confirm-msg="confirmationMessage"
    no-confirm-translation
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
      <div class="pricing">
        <div v-if="packages && onPackageCLick" class="pricing-container">
          <div class="card" v-for="offer in packages">
            <OfferCard
              :offer="offer"
              @select:offer="onPackageCLick(offer, containerValidationFn)"
            />
          </div>

          <!-- <PackageCardComponent
            v-for="p in packages"
            :key="p.label"
            :pack="p"
            :on-click="() => onPackageCLick(p, containerValidationFn)"
          /> -->
        </div>
      </div>
    </div>
    <div slot="bottom">
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
      </div>
    </div>
    <div slot="messages" class="text-info">
      <div v-if="requestErrors && requestErrors.length">
        <ul class="text-danger list-unstyled">
          <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
        </ul>
      </div>
    </div>
  </VerticalEmptyContainer>
</template>

<script>
import VerticalEmptyContainer from './parts/VerticalEmptyContainer';
import OfferCard from '@/views/AccountCreation/OfferCard.vue';
import UiDate from '@/components/ui/UiDate';
import moment from 'moment';

import { fetchLVOffers } from '@/api/offers.js';
import { mapState, mapGetters } from 'vuex';
import { createRechargeLVOffer } from '@/api/actCreation.js';
import { formattedCurrentDateExtended } from '@/utils/date.js';

const PackageCardComponent = {
  functional: true,
  props: {
    pack: Object,
    onClick: Function,
  },
  render(h, context) {
    return (
      <div class="entry p-2">
        <div class="card text-xs-center">
          <div class="card-block text-center">
            <h5 class="card-title pt-2">{context.props.pack.label}</h5>
            <ul class="list-group">
              {context.parent.$loGet(context.props, 'pack.usage', []).map((u) => {
                return (
                  <li class="list-group-item">
                    {u.type}: {u.value} {u.unit}
                  </li>
                );
              })}
            </ul>
            <button class="btn btn-gradient mt-2" onClick={context.props.onClick}>
              <em class="ic-Check-Icon" />
              {context.parent.$t('confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export default {
  components: {
    VerticalEmptyContainer,
    PackageCardComponent,
    UiDate,
    OfferCard,
  },
  data() {
    return {
      packages: undefined,
      chosenPackage: undefined,
      requestErrors: [],
      actDate: null,
      dateError: null,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
    confirmationMessage() {
      if (this.chosenPackage) {
        return `${this.$t('getparc.actCreation.rechargeLV.confirm')} "${
          this.chosenPackage.label
        }" ?`;
      }

      return '';
    },
  },
  async mounted() {
    const response = await fetchLVOffers(this.actCreationPrerequisites.partner.id);
    if (response.packages && response.packages.length) {
      this.packages = response.packages.reduce((all, item) => {
        all.push({
          label: item.label,
          usage: item.usage.map((i) => ({
            type: i.usageType,
            value: i.envelopeValue,
            unit: i.usageType !== 'SMS' ? i.unit : '',
          })),
        });
        return all;
      }, []);
    }

    this.actDate = formattedCurrentDateExtended();
  },
  methods: {
    onActDateChange(value) {
      this.actDate = value;
    },
    onPackageCLick(pack, validationCallback) {
      this.chosenPackage = pack;
      validationCallback();
    },
    async validate(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: this.actDate,
        packageLabel: this.chosenPackage.label,
        tempDataUuid: contextValues.tempDataUuid,
      };
      const response = await createRechargeLVOffer(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach((r) => {
          this.requestErrors = [
            {
              message: r.message,
            },
          ];
        });
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
  .entry > .card {
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    border-bottom: none;
  }

  .card {
    border: 0;
    border-radius: 0px;
    -webkit-box-shadow: 0 3px 0px 0 rgba(0, 0, 0, 0.08);
    box-shadow: 0 3px 0px 0 rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease-in-out;
    padding: 0 0 2.25rem 0;
    position: relative;
    will-change: transform;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 5px;
      background-color: $primary;
      transition: 0.5s;
    }

    &:hover {
      transform: scale(1.05);
      -webkit-box-shadow: 0 20px 35px 0 rgba(0, 0, 0, 0.08);
      box-shadow: 0 20px 35px 0 rgba(0, 0, 0, 0.08);

      &:after {
        width: 100%;
      }
    }
    & .card-header {
      background-color: white;
      padding-left: 1rem;
      border-bottom: 0px;
    }
    & .card-title {
      margin-bottom: 1rem;
    }
    & .card-block {
      padding-top: 0;
    }
    & .list-group-item {
      border: 0px;
      padding: 0.25rem;
      color: $main-font-color;
      font-weight: $main-font-weight;
    }
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
</style>