const PartnerDetail = () => import('@/views/GetAdmin/PartnerDetail');
const UsersTab = () => import('@/views/GetAdmin/PartnerDetail/UsersTab');
const CustomizeTab = () => import('@/views/GetAdmin/PartnerDetail/CustomizeTab');
const AccountDetail = () => import('@/views/GetAdmin/PartnerDetail/AccountDetail');
const OffersTab = () => import('@/views/GetAdmin/PartnerDetail/OffersTab');
const BillAccounts = () => import('@/views/GetAdmin/PartnerDetail/BillAccounts');
const PartnerCustomers = () => import('@/views/GetAdmin/PartnerDetail/PartnerCustomers');
const PartnerCustomersTable = () =>
  import('@/views/GetAdmin/PartnerDetail/PartnerCustomers/PartnerCustomersTable.vue');
const BillingAccountDetail = () =>
  import('@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail');
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
      children: [
        {
          name: 'getAdminPartnerDetails.billingAccounts.list',
          path: 'list',
          component: () =>
            import('@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountsTable.vue'),
        },
        {
          name: 'getAdminPartnerDetails.billingAccounts.form',
          path: 'form/:customerAccountCode',
          component: () =>
            import('@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountsForm.vue'),
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.customerList',
      path: 'customers',
      component: PartnerCustomers,
      children: [
        {
          path: '',
          redirect: 'list',
        },
        {
          name: 'getAdminPartnerDetails.customerList.list',
          path: 'list',
          component: PartnerCustomersTable,
        },
        {
          name: 'getAdminPartnerDetails.customerList.detail',
          path: 'detail/:billingAccountId',
          component: BillingAccountDetail,
          children: [
            {
              name: 'getAdminPartnerDetails.customerList.detail.commercialOffers',
              path: 'commercialOffers',
              component: () =>
                import(
                  '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/CommercialOffers/index.vue'
                ),
              children: [
                {
                  name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.list',
                  path: 'list',
                  component: () =>
                    import(
                      '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/CommercialOffers/CommerialOffersTable.vue'
                    ),
                },
                {
                  name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.form',
                  path: 'form/:comOfferId?',
                  component: () =>
                    import(
                      '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/CommercialOffers/CommercialOfferForm.vue'
                    ),
                },
              ],
            },
            {
              name: 'getAdminPartnerDetails.customerList.detail.deliveryAdresses',
              path: 'deliveryAdresses',
              component: () =>
                import(
                  '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/DeliveryAdresses.vue'
                ),
            },
            {
              name: 'getAdminPartnerDetails.customerList.detail.simcards',
              path: 'simcards',
              component: () => import('@/views/GetAdmin/PartnerDetail/OffersTab/SimCards.vue'),
            },
          ],
        },
      ],
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
        {
          name: 'partnerDetail.accountDetail.m2mRange',
          path: 'm2mranges',
          component: () => import('@/views/GetAdmin/PartnerDetail/AccountDetail/M2MRange.vue'),
        },
      ],
    },
  ],
};
