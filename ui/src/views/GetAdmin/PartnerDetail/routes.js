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
const SupervisionOptions = () =>
  import('@/views/GetAdmin/PartnerDetail/OffersTab/SupervisionOptions.vue');
// Account Detail
const Options = () => import('@/views/GetAdmin/PartnerDetail/AccountDetail/PartnerOptions.vue');
const Description = () =>
  import('@/views/GetAdmin/PartnerDetail/AccountDetail/AccountPartnerDetail.vue');

export default {
  path: '/getamin/partner/:id',
  name: 'getAdminPartnerDetails',
  meta:{label: 'Détail du partenaire'},
  component: PartnerDetail,
  children: [
    {
      name: 'getAdminPartnerDetails.users',
      path: 'users',
      meta:{label: 'Détail du partenaire - Utilisateurs'},
      component: UsersTab,
      children: [
        {
          name: 'partnerDetail.users.admins',
          path: 'admins',
          meta:{label: 'Détail du partenaire - Administrateurs'},
          component: AdminCards,
        },
        {
          name: 'partnerDetail.users.users',
          path: 'users',
          meta:{label: 'Détail du partenaire - Utilisateurs'},
          component: UsersCards,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.customize',
      path: 'customize',
      meta:{label: 'Détail du partenaire - Personnalisation'},
      component: CustomizeTab,
      children: [
        {
          name: 'partnerDetail.customize.broadcastLists',
          path: 'broadcastlists',
          meta:{label: 'Détail du partenaire - Listes de diffusion'},
          component: BroadcastLists,
        },
        {
          name: 'partnerDetail.customize.customFields',
          path: 'customfields',
          meta:{label: ' Détail du partenaire - Champs libres'},
          component: CustomFields,
        },
        {
          name: 'partnerDetail.customize.deliveryAddress',
          path: 'deliveryaddress',
          meta:{label: 'Détail du partenaire - Adresses de livraison'},
          component: DeliveryAddress,
        },
        {
          name: 'partnerDetail.customize.specificFields',
          path: 'specificfields',
          meta:{label: 'Détail du partenaire - Champs spécifiques'},
          component: SpecificFields,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.billingAccounts',
      path: 'billAccounts',
      meta:{label: 'Détail du partenaire - Comptes de facturation'},
      component: BillAccounts,
      children: [
        {
          name: 'getAdminPartnerDetails.billingAccounts.list',
          meta:{label: 'Détail du partenaire - Comptes de facturation'},
          path: 'list',
          component: () =>
            import('@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountsTable.vue'),
        },
        {
          name: 'getAdminPartnerDetails.billingAccounts.form',
          meta:{label: 'Détail du partenaire - Détail du compte de facturation'},
          path: 'form/:customerAccountCode',
          component: () =>
            import('@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountsForm.vue'),
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.customerList',
      meta:{label: 'Détail du partenaire - Liste des entités (MB)'},
      path: 'customers',
      component: PartnerCustomers,
      children: [
        {
          name: 'getAdminPartnerDetails.customerList.list',
          meta:{label: 'Détail du partenaire - Liste des entités (MB)'},
          path: 'list',
          component: PartnerCustomersTable,
        },
        {
          name: 'getAdminPartnerDetails.customerList.detail',
          meta:{label: 'Détail du partenaire - CF - Liste des offres commerciales (MB)'},
          path: 'detail/:billingAccountId',
          component: BillingAccountDetail,
          children: [
            {
              name: 'getAdminPartnerDetails.customerList.detail.commercialOffers',
              meta:{label: 'Détail du partenaire - CF - Liste des offres commerciales (MB)'},
              path: 'commercialOffers',
              component: () =>
                import(
                  '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/CommercialOffers/index.vue'
                ),
              children: [
                {
                  name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.list',
                  meta:{label: 'Détail du partenaire - CF - Liste des offres commerciales (MB)'},
                  path: 'list',
                  component: () =>
                    import(
                      '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/CommercialOffers/CommerialOffersTable.vue'
                    ),
                },
                {
                  name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.form',
                  meta:{label: 'Détail du partenaire - CF - Détail d\'une offre commerciale (MB)'},
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
              meta:{label: 'Détail du partenaire - CF - Adresse de livraison (MB)'},
              path: 'deliveryAdresses',
              component: () =>
                import(
                  '@/views/GetAdmin/PartnerDetail/PartnerCustomers/BillingAccountDetail/DeliveryAdresses.vue'
                ),
            },
            {
              name: 'getAdminPartnerDetails.customerList.detail.simcards',
              meta:{label: 'Détail du partenaire - CF - Cartes SIM (MB)'},
              path: 'simcards',
              component: () => import('@/views/GetAdmin/PartnerDetail/OffersTab/SimCards.vue'),
            },
          ],
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.offersAndSim',
      meta:{label: 'Détail du partenaire - Offres'},
      path: 'offersandsim',
      component: OffersTab,
      children: [
        {
          name: 'partnerDetail.offersAndSim.offers',
          meta:{label: 'Détail du partenaire - Offres'},
          path: 'offersCards',
          component: OffersCards,
        },
        {
          name: 'partnerDetail.offersAndSim.simCards',
          meta:{label: ' Détail du partenaire - Cartes SIM'},
          path: 'simcards',
          component: SimCards,
        },
        {
          name: 'partnerDetail.offersAndSim.supervisionOptions',
          meta:{label: 'Détail du partenaire - Options de supervision'},
          path: 'supervision',
          component: SupervisionOptions,
        },
      ],
    },
    {
      name: 'getAdminPartnerDetails.accountDetail',
      meta:{label: 'Détail du partenaire - Description du compte partenaire'},
      path: 'accountDetail',
      component: AccountDetail,
      children: [
        {
          name: 'partnerDetail.accountDetail.description',
          meta:{label: 'Détail du partenaire - Description du compte partenaire'},
          path: 'description',
          component: Description,
        },
        {
          name: 'partnerDetail.accountDetail.options',
          meta:{label: 'Détail du partenaire - Options du partenaire'},
          path: 'options',
          component: Options,
        },
        {
          name: 'partnerDetail.accountDetail.m2mRange',
          meta:{label: 'Détail du partenaire - Tranche MSISDN'},
          path: 'm2mranges',
          component: () => import('@/views/GetAdmin/PartnerDetail/AccountDetail/M2MRange.vue'),
        },
      ],
    },
  ],
};
