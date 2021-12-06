import SimStep from './SimStep.vue';
import OfferStep from './OfferStep.vue';
import DeliveryStep from './DeliveryStep.vue';
import PartnerStep from './PartnerStep.vue';
// import SuccessPage from './SuccessPage.vue';
// import ErrorPage from './ErrorPage.vue';

export default {
  path: '/create-account',
  component: () => import('@/views/AccountCreation/index.vue'),
  children: [
    {
      path: 'partner',
      name: 'createAccount.partner',
      component: PartnerStep,
    },
    {
      path: 'offer',
      name: 'createAccount.offer',
      component: OfferStep,
    },
    {
      path: 'sim',
      name: 'createAccount.simChoice',
      component: SimStep,
    },
    {
      path: 'delivery',
      name: 'createAccount.delivery',
      component: DeliveryStep,
    },
    // {
    //   path: 'ok/:paymentId',
    //   name: 'createAccount.ok',
    //   component: SuccessPage,
    // },
    // {
    //   path: 'ko',
    //   name: 'createAccount.ko',
    //   component: ErrorPage,
    // },
  ],
};
