const PartnerDetail = () => import('@/views/GetAdmin/PartnerDetail');
const UsersTab = () => import('@/views/GetAdmin/PartnerDetail/UsersTab');
const CustomizeTab = () => import('@/views/GetAdmin/PartnerDetail/CustomizeTab');
const AccountDetail = () => import('@/views/GetAdmin/PartnerDetail/AccountDetail');
const OffersTab = () => import('@/views/GetAdmin/PartnerDetail/OffersTab');
const BillAccounts = () => import('@/views/GetAdmin/PartnerDetail/BillAccounts');
const PartnerCustomers = () => import('@/views/GetAdmin/PartnerDetail/PartnerCustomers');
// Users and Admins
const AdminCards = () => import('@/views/GetAdmin/PartnerDetail/UsersTab/AdminCards.vue');
const UsersCards = () => import('@/views/GetAdmin/PartnerDetail/UsersTab/UsersCards.vue');
// Customize
const CustomFields = () => import('@/views/GetAdmin/PartnerDetail/CustomizeTab/CustomFields.vue');
const DeliveryAddress = () =>
  import('@/views/GetAdmin/PartnerDetail/CustomizeTab/DeliveryAddress.vue');
const BroadcastLists = () =>
  import('@/views/GetAdmin/PartnerDetail/CustomizeTab/BroadcastLists.vue');
const SpecificFields = () =>
  import('@/views/GetAdmin/PartnerDetail/CustomizeTab/SpecificFields.vue');
// Offers and Sim
const OffersCards = () => import('@/views/GetAdmin/PartnerDetail/OffersTab/OffersCards.vue');
const SimCards = () => import('@/views/GetAdmin/PartnerDetail/OffersTab/SimCards.vue');
// Account Detail
const Options = () => import('@/views/GetAdmin/PartnerDetail/AccountDetail/PartnerOptions.vue');
const Description = () =>
  import('@/views/GetAdmin/PartnerDetail/AccountDetail/AccountPartnerDetail.vue');

export default {
  path: '/getamin/partner/:id',
  name: 'getAdminPartnerDetails',
  component: PartnerDetail,
  children: [
    {
      path: '',
      redirect: 'users',
    },
    {
      name: 'getAdminPartnerDetails.users',
      path: 'users',
      component: UsersTab,
      children: [
        {
          path: '',
          redirect: 'admins',
        },
        {
          name: 'partnerDetail.users.admins',
          path: 'admins',
          component: AdminCards,
        },
        {
          name: 'partnerDetail.users.users',
          path: 'users',
          component: UsersCards,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.customize',
      path: 'customize',
      component: CustomizeTab,
      children: [
        {
          path: '',
          redirect: 'BroadcastLists',
        },
        {
          name: 'partnerDetail.customize.broadcastLists',
          path: 'broadcastlists',
          component: BroadcastLists,
        },
        {
          name: 'partnerDetail.customize.customFields',
          path: 'customfields',
          component: CustomFields,
        },
        {
          name: 'partnerDetail.customize.deliveryAddress',
          path: 'deliveryaddress',
          component: DeliveryAddress,
        },
        {
          name: 'partnerDetail.customize.specificFields',
          path: 'specificfields',
          component: SpecificFields,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.billingAccounts',
      path: 'billAccounts',
      component: BillAccounts,
    },
    {
      name: 'getAdminPartnerDetails.customerList',
      path: 'customerlist',
      component: PartnerCustomers,
    },
    {
      name: 'getAdminPartnerDetails.offersAndSim',
      path: 'offersandsim',
      component: OffersTab,
      children: [
        {
          path: '',
          redirect: 'offerscards',
        },
        {
          name: 'partnerDetail.offersAndSim.offers',
          path: 'offersCards',
          component: OffersCards,
        },
        {
          name: 'partnerDetail.offersAndSim.simCards',
          path: 'simcards',
          component: SimCards,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.accountDetail',
      path: 'accountDetail',
      component: AccountDetail,
      children: [
        {
          path: '',
          redirect: 'description',
        },
        {
          name: 'partnerDetail.accountDetail.description',
          path: 'description',
          component: Description,
        },
        {
          name: 'partnerDetail.accountDetail.options',
          path: 'options',
          component: Options,
        },
      ],
    },
  ],
};
