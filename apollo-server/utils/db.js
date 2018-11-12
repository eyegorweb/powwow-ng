import Lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import mkdirp from 'mkdirp';
import { resolve } from 'path';

mkdirp(resolve(__dirname, '../../live'));

export const db = new Lowdb(new FileSync(resolve(__dirname, '../../live/db.json')));

// Seed an empty DB
db.defaults({
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
}).write();
