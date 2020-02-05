<template>
  <div v-if="!rows || !rows.length" class="alert alert-light m-0" role="alert">
    {{ $t('noResult') }}
  </div>
  <div v-else>
    <DataTableConfiguration
      v-if="showExtraColumns"
      :columns="usableColumns"
      @update:columns="setColumns"
      @close="close"
      :max-columns-number="size"
    />
    <div class="row">
      <div class="col-md-7">
        <slot name="topLeftCorner" />
      </div>
      <div v-if="page" class="col-md-5">
        <div class="float-left">
          <label class="form-group">
            {{ $t('numberPerPage') }}:
            <UiSelect class="text-gray" :placeholder="$t('partnerType')" v-model="currentPageLimit">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </UiSelect>
          </label>
        </div>
        <nav class="float-right">
          <DataTablePagination :total="total" :page.sync="currentPage" :page-limit="pageLimit" />
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-blue table-hover mt-1" :class="{ 'small-text': smallText }">
          <draggable tag="thead" v-model="sortableColumns" handle=".handle">
            <transition-group tag="tr" name="table">
              <th :key="column.name + column.label" v-for="column in sortableColumns">
                <div :class="{ 'thead-actions': !align, 'thead-actions-align': align }">
                  <span v-if="!column.noHandle" class="handle ic-Drag-Column-Icon" />
                  <span>{{ column.label }}</span>
                  <DataTableOrderArrow
                    v-if="column.orderable"
                    :column-name="column.name"
                    :sorting-name="column.sortingName"
                    :order-by.sync="currentDirection"
                  />
                </div>
              </th>
              <th v-if="size" :key="'btnAdd'">
                <button
                  type="button"
                  class="btn btn-light btn-sm float-right"
                  @click="$emit('update:showExtraColumns', !showExtraColumns)"
                >
                  <span v-if="showExtraColumns" class="ic-Minus-Icon" />
                  <span v-else class="ic-Plus-Icon" />
                </button>
              </th>
            </transition-group>
          </draggable>
          <tbody>
            <tr :key="row.id" v-for="row in rows">
              <td
                :key="column.name + column.label + row.id"
                v-for="column in sortableColumns"
                v-tooltip="getTooltipConfig(column, row)"
              >
                <DatatableColumnTypeSwitcher
                  :format="column.format"
                  :item="row[column.name]"
                  :row="row"
                  :visible-columns="sortableColumns"
                  @colEvent="$emit('colEvent', $event)"
                />
              </td>
              <td v-if="size">
                <slot name="actions" :row="row" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import UiSelect from '@/components/ui/UiSelect';
import DataTablePagination from './DataTablePagination';
import DataTableOrderArrow from './DataTableOrderArrow';
import DataTableConfiguration from './DataTableConfiguration';
import DatatableColumnTypeSwitcher from '@/components/DataTable/DataTableColumnTypeSwitcher';

export default {
  /**
   * Composant Datatable générique utilisé dans toutes les pages
   * Il assure les fonctionnalités suivantes :
   *  - Configuration du type et contenu des colonnes à afficher
   *  - Assurer le drag & drop des colonnes
   *  - Configuration des colonnes à afficher
   */
  name: 'DataTable',
  components: {
    draggable,
    UiSelect,
    DataTableConfiguration,
    DataTablePagination,
    DataTableOrderArrow,
    DatatableColumnTypeSwitcher,
  },
  props: {
    /**
     *  Liste des colonnes à afficher, configure comment le contenu des cellules est extrait d'une ligne de résultat
     *  Format :
     *  {
          id: Number| String,  // Identifiant technique de la colonne
          label: String, // Label de la colonne
          name: String, // Attribut de l'objet ligne à afficher, par exemple: si row={a: 'coucou', b: 'salut'} et name='a' alors le contenu seras row.a => 'coucou'
          orderable: Boolean, // Possibilité de faire un order by avec cette colonne
          sortingName: String, // Nom de l'attribut utilisé en paramètre pour le sorting de la colonne
          visible: Boolean, // Affichage par défaut de la colonne dans la table
          visibleWhen: Function, // fonction qui controle la visibilité en plus du boolean (visible)
          fixed: Boolean, // si fixed = true, alors impossible d'enlever la colonne de la table
          noHandle: Boolean, // désactiver le drag&drop

          // Optionel, objet pour customiser le format de la céllule
          format: {
            component: SomeComponent, // utiliser SomeComponent comme composant d'affichage de la cellule
            type: String, // Pris en compte si component n'est pas définit, formatte la céllule selon un formattage prédéfinit voir (src/components/DataTable/ColumnTypes)

            path: String, // Utilisé quand type: 'ObjectAttribute', affiche dans une cellule un contenu imbriqué dans l'objet de la ligne exemple :
          },
        },
     */
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    orderBy: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: false,
    },
    pageLimit: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    showExtraColumns: Boolean,
    size: {
      type: Number,
      required: false,
    },
    storageId: {
      type: String,
      required: false,
    },
    storageVersion: {
      type: String,
      required: false,
    },
    align: {
      type: Boolean,
      required: false,
    },
    smallText: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      perPage: 20,
      usableColumns: [],
    };
  },

  computed: {
    sortableColumns: {
      get() {
        if (this.visibleColumns) {
          return this.visibleColumns.filter(c => {
            if (c.visibleWhen) {
              return c.visibleWhen();
            }
            return true;
          });
        }
        return this.visibleColumns;
      },
      set(orderedCells) {
        const notVisibleCells = this.usableColumns.filter(c => !c.visible);
        this.usableColumns = orderedCells.concat(notVisibleCells);
        const columnsWithCondition = this.columns.filter(c => c.visibleWhen);
        this.saveColumnsToLocalStorage([...columnsWithCondition, ...this.usableColumns]);
      },
    },

    visibleColumns: {
      get() {
        return this.usableColumns.filter(c => {
          if (c.visibleWhen) {
            return c.visible && c.visibleWhen();
          }
          return c.visible;
        });
      },
    },
    currentPage: {
      get() {
        return this.page;
      },
      set(newPage) {
        this.$emit('update:page', newPage);
      },
    },
    currentDirection: {
      get() {
        return this.orderBy;
      },
      set(newOrderBy) {
        this.$emit('update:orderBy', newOrderBy);
      },
    },
    currentPageLimit: {
      get() {
        return this.pageLimit;
      },
      set(newPageLimit) {
        this.$emit('update:pageLimit', newPageLimit);
      },
    },
  },

  mounted() {
    this.checkStorageVersion();
    this.prepareColumns();
  },

  methods: {
    getTooltipConfig(column, row) {
      if (!column.tootltipText) {
        return;
      }
      return column.tootltipText(row[column.name], row);
    },
    checkStorageVersion() {
      if (!this.storageId) return;

      const savedVersion = localStorage.getItem(this.storageId + '.version');
      if (savedVersion !== this.storageVersion) {
        localStorage.removeItem(this.storageId);
        localStorage.setItem(this.storageId + '.version', this.storageVersion);
      }
    },
    prepareColumns() {
      const columnsInLocalStorage = this.loadColumnsFromLocalStorage();
      if (columnsInLocalStorage && columnsInLocalStorage.length) {
        this.usableColumns = columnsInLocalStorage;
      } else {
        this.usableColumns = this.columns;
        this.saveColumnsToLocalStorage(this.columns);
      }
    },
    setColumns(newColumns) {
      this.usableColumns = newColumns;
      const columnsWithCondition = this.columns.filter(c => c.visibleWhen);
      this.saveColumnsToLocalStorage([...columnsWithCondition, ...newColumns]);
      this.close();
    },
    close() {
      this.$emit('update:showExtraColumns', false);
    },

    loadColumnsFromLocalStorage() {
      if (!this.storageId) return;
      const strColumns = localStorage.getItem(this.storageId);
      if (!strColumns) return;
      const parsedColumns = JSON.parse(strColumns);

      return parsedColumns.map(c => {
        if (c.format && c.format.component) {
          const correspondingColumn = this.columns.find(cf => {
            return (
              cf.format && cf.format.component && c.format.component === cf.format.component.name
            );
          });

          if (correspondingColumn) {
            c.format.component = correspondingColumn.format.component;
            c.visibleWhen = correspondingColumn.visibleWhen;
            c.tootltipText = correspondingColumn.tootltipText;
          }

          return c;
        }

        if (c.format && c.format.type === 'Getter') {
          const correspondingColumn = this.columns.find(cf => {
            return c.id === cf.id;
          });
          if (correspondingColumn) {
            c.format.getter = correspondingColumn.format.getter;
            c.visibleWhen = correspondingColumn.visibleWhen;
          }
        }

        return c;
      });
    },

    saveColumnsToLocalStorage(columns) {
      if (!this.storageId) return;
      const stripedFromComponents = columns.map(c => {
        if (c.format && c.format.component) {
          return {
            ...c,
            format: {
              component: c.format.component.name,
            },
          };
        }
        return c;
      });
      const savableColumns = JSON.parse(JSON.stringify(stripedFromComponents));
      localStorage.setItem(this.storageId, JSON.stringify(savableColumns));
    },
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 0; //reset bootstrap
}

.handle {
  font-size: 20px;
  position: relative;
  top: 3px;
  &:hover {
    cursor: move;
  }
}

.searchInput {
  .input-group-text {
    background-color: #fff;
  }
  input {
    padding-left: 0;
    border-left: none;
  }
  input:focus {
    box-shadow: none;
    border-top-color: #ced4da;
    border-right-color: #ced4da;
    border-bottom-color: #ced4da;
  }

  button {
    padding: 0.46rem 0.5rem 0.46rem 0.5rem;
    margin-top: 0 !important;
  }
}

select {
  width: inherit;
  display: inline;
}

.form-control {
  -webkit-appearance: none;

  &:hover {
    cursor: pointer;
  }

  &--blue {
    color: $primary;
  }

  &--arrow-down {
    padding-right: 40px;
  }
}

.select-arrow {
  display: inline-block;
  transform: translateX(calc(-50% - 15px));
}

.thead-actions {
  display: flex;
  flex-direction: row;
}
.thead-actions-align {
  // display: block;
  // text-align: center;
  display: flex;
  flex-direction: row-reverse;
}

label {
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  div {
    margin-left: 5px;
  }
}
</style>
<style lang="scss">
.table-blue {
  thead th {
    //evite les retours à la ligne dans l'entête de la table de l'historique des actes de gestion
    vertical-align: middle;
    white-space: nowrap;
  }
}

.small-text {
  font-size: 0.8rem !important;
}

@media only screen and (max-width: 1024px) {
  .table-blue th {
    font-size: 1rem;
  }
}
</style>
