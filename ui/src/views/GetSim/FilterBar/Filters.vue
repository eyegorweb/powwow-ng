<template>
    <div>
        <FoldableBlock
        v-if="!userIsPartner && keyName === 'el1'"
        :title="$t('filters.partners')"
        :key="'el1'"
        draggable
        >
            <GetSimPartnersFilter />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable v-if="keyName === 'el2'">
            <GetSimPartnersBillingAccountsFilter />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.orderStatus')" :key="'el3'" draggable v-if="keyName === 'el3'">
        <div>
            <UiCheckbox
            v-for="(status, index) in statusMapResults"
            :checked="status[1].checked"
            :value="{ id: status[1], label: status[0] }"
            :key="'orderStatus_' + index"
            v-model="orderStatus"
            >{{ status[0] }}</UiCheckbox
            >
        </div>
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.lines.typeSIMCard')" :key="'el4'" draggable v-if="keyName === 'el4'">
            <TypeSimCard />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.orderDate')" :key="'el5'" draggable v-if="keyName === 'el5'">
            <GetSimDateFilter />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.offers')" :key="'el6'" draggable v-if="keyName === 'el6'">
            <GetSimOffersFilter />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.quantity')" :key="'el7'" draggable v-if="keyName === 'el7'">
            <GetSimQuantityFilter />
        </FoldableBlock>
        <FoldableBlock
        v-if="!userIsMVNO && keyName === 'el8'"
        :title="$t('filters.customFields')"
        :key="'el8'"
        draggable
        >
            <GetSimCustomFields />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.orderCreator')" :key="'el9'" draggable v-if="keyName === 'el9'">
            <OrderCreatorFilter
                :selected-partners-values="selectedPartnersValues"
                :selected-order-creator-values="selectedOrderCreatorValues"
                @setOrderCreatorFilter="setOrderCreatorFilter"
            />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.deliveryCountry')" :key="'el11'" draggable v-if="keyName === 'el11'">
            <GetSimDeliveryCountries />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.postalCode')" :key="'el12'" draggable v-if="keyName === 'el12'">
            <GetSimPostalCode />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.city')" :key="'el20'" draggable v-if="keyName === 'el20'">
            <GetSimCity />
        </FoldableBlock>
        <FoldableBlock :title="$t('filters.action')" :key="'e21'" draggable v-if="keyName === 'el21'">
            <GetSimActionFilter />
        </FoldableBlock>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import FoldableBlock from '@/components/FoldableBlock';
import UiCheckbox from '@/components/ui/Checkbox';
import GetSimCustomFields from './GetSimCustomFields';
import GetSimPartnersFilter from './GetSimPartnersFilter';
import GetSimPartnersBillingAccountsFilter from './GetSimPartnersBillingAccountsFilter';
import GetSimOffersFilter from './GetSimOffersFilter';
import GetSimPostalCode from './GetSimPostalCode';
import GetSimCity from './GetSimCity';
import GetSimActionFilter from './GetSimActionFilter';
import GetSimQuantityFilter from './GetSimQuantityFilter';
import GetSimDateFilter from './GetSimDateFilter';
import GetSimDeliveryCountries from './GetSimDeliveryCountries';
import OrderCreatorFilter from '@/components/Filters/OrderCreatorFilter';
import TypeSimCard from './TypeSimCard';


export default {
    components: {
        FoldableBlock,
        GetSimPartnersFilter,
        GetSimCustomFields,
        GetSimPartnersBillingAccountsFilter,
        GetSimOffersFilter,
        UiCheckbox,
        GetSimPostalCode,
        GetSimCity,
        GetSimActionFilter,
        GetSimQuantityFilter,
        GetSimDateFilter,
        GetSimDeliveryCountries,
        OrderCreatorFilter,
        TypeSimCard,
    },

    computed: {
        ...mapGetters(['userIsPartner', 'userIsMVNO']),
        ...mapGetters('getsim', [
        'selectedPartnersValues',
        'selectedOrderCreatorValues',
        ]),
    },

    props: {
        statusMapResults: {
            type: Array,
        },
        keyName: {
            type: String,
            default: undefined,
        },
        orderStatus: undefined,
    },

    methods: {
        ...mapMutations('getsim', [
        'setOrderCreatorFilter',
        ]),
    },
};
</script>

<style lang="scss" scoped>

</style>