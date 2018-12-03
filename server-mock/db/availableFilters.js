module.exports = {
  availableFilters: [
    {
      name: 'partners',
      title: 'Partenaires',
      type: 'choices',
      values: [
        {
          code: 'toValidate',
          label: 'En attente de validation',
        },
        {
          code: 'validated',
          label: 'Validée',
        },
      ],
    },
    {
      name: 'orderDate',
      title: 'Date de la commande',
      type: 'dateRange',
      values: [],
    },
  ],
};
