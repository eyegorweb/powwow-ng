<template>
  <div class="flex-container">
    <div class="flex-part">
      <a href="/">
        <img
          v-if="!isBackofficeProfile && !userIsMVNO"
          class="logo logo--corporate logoSvg"
          src="@/assets/logo_objenious.svg"
          alt="Logo"
        />
        <img
          v-if="!isBackofficeProfile && userIsMVNO"
          class="logo logo--corporate"
          src="@/assets/logo_bouygues.png"
          alt="Logo"
        />
      </a>
      <div class="burger" @click="showNavMenu = !showNavMenu" :class="{ open: showNavMenu }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <UiTabs
        v-if="navbarLinks"
        :tabs="filterByPermission(navbarLinks)"
        :selected-index="currentIndex"
        :class="{ open: showNavMenu }"
      >
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentIndex">
            <template v-if="tab.external">
              <a target="_blank" :href="tab.external.url" v-if="!userIsMVNO">
                {{ $t(tab.label) }}
              </a>
            </template>
            <template v-else-if="tab.mailto"
              ><a :href="'mailto:' + tab.mailto.email" class="w100">
                {{ $t(tab.label) }}
              </a>
            </template>
            <router-link v-else-if="!tab.submenu" :to="tab.to" :class="'menu_' + tab.to.name">{{
              $t(tab.label)
            }}</router-link>

            <div class="dropdown">
              <a v-if="tab.submenu" :to="tab.to" @click.prevent>{{ $t(tab.label) }}</a>
              <div
                v-if="tab.submenu"
                class="dropdown-menu"
                aria-labelledby="dropdownMenuLink"
                x-placement="bottom-start"
                style="
                  position: absolute;
                  will-change: transform;
                  top: 0px;
                  left: 0px;
                  transform: translate3d(0px, 2.5rem, 0px);
                "
              >
                <template v-for="item in filterByPermission(tab.submenu)">
                  <template v-if="tab.onClick">
                    <a
                      :key="item.label"
                      :to="tab.to"
                      @click.prevent="() => tab.onClick(item.to.name)"
                      class="dropdown-item"
                      :class="'menu_' + item.to.name"
                    >
                      {{ $t(item.label) }}
                    </a>
                  </template>
                  <router-link
                    v-else
                    :key="item.label"
                    class="dropdown-item"
                    :class="'menu_' + item.to.name.replace('.', '_')"
                    :to="item.to"
                    >{{ $t(item.label) }}</router-link
                  >
                </template>
              </div>
            </div>
          </UiTab>
        </template>
      </UiTabs>
    </div>
    <div class="flex-part">
      <div class="lang-flags">
        <a
          href="#"
          @click.prevent="() => changeAppLanguage('fr')"
          :class="{ active: $i18n.locale === 'fr' }"
          class="flag"
        >
          <img src="@/assets/fr.png" />
        </a>
        <a
          href="#"
          @click.prevent="() => changeAppLanguage('en')"
          :class="{ active: $i18n.locale === 'en' }"
          class="flag"
        >
          <img src="@/assets/en.png" />
        </a>
        <permission domain="act" action="read">
          <ActHistoryButton />
        </permission>
      </div>
      <div class="nav">
        <ul class="nav navbar-nav">
          <li class="dropdown" :class="{ show: userMenuVisible }">
            <a href="#" class="nav-link">
              <i class="icon ic-User-Icon"></i>
              <i v-if="!userMenuVisible" class="arrow ic-Arrow-Down-Icon" />
              <i v-if="userMenuVisible" class="arrow ic-Arrow-Up-Icon" />
            </a>
            <div
              class="dropdown-menu dropdown-menu-right position-absolute auth-menu"
              :class="{ show: userMenuVisible }"
            >
              <span class="dropdown-item hover-pointer">
                {{ userInfos.name.firstName }}
                {{ userInfos.name.lastName }}
                <br />
                {{ userInfos.email }}
              </span>

              <template v-if="userIsSuperAdmin">
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{ name: 'messagesList' }">
                  Section admin
                </router-link>
              </template>

              <div class="dropdown-divider"></div>
              <a class="dropdown-item" :href="logoutUrl">{{ $t('logout') }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import ActHistoryButton from './ActHistoryButton';

import { excludeMocked } from '@/featureFlipping/plugin.js';
import { getBaseURL } from '@/utils.js';
import { getAccessToGetSupport } from '@/api/getSupport';
import { isFeatureAvailable } from '@/api/partners';

export default {
  name: 'NavBar',
  components: {
    UiTabs,
    UiTab,
    ActHistoryButton,
  },
  props: {
    isBackofficeProfile: Boolean,
  },
  async mounted() {
    this.changeAppLanguage(this.userLanguage || 'fr');

    this.currentUrlName = this.$route.name;
    this.flagStatistics = await isFeatureAvailable('FLAG_STATISTICS_ENABLED');

    let getAdminExtra = [];
    if (this.userIsByCustomerAccount) {
      getAdminExtra = [
        {
          label: 'menu.users',
          to: {
            name: 'getAdminUsers',
            meta: {
              label: 'Recherche des utilisateurs',
              permission: { domain: 'user', action: 'read' },
            },
          },
          permission: { domain: 'user', action: 'read' },
        },
      ];
    } else if (this.userIsPartner) {
      getAdminExtra = [
        {
          label: 'menu.account',
          to: {
            name: 'partnerDetail.users.admins',
            meta: {
              label: 'Détail du partenaire - Administrateurs',
              permission: { domain: 'party', action: 'read' },
            },
            params: { id: `${this.userInfos.partners[0].id}` },
          },
          permission: { domain: 'party', action: 'read' },
        },
      ];
    } else {
      getAdminExtra = excludeMocked([
        {
          label: 'menu.users',
          to: {
            name: 'getAdminUsers',
            meta: {
              label: 'Recherche des utilisateurs',
              permission: { domain: 'user', action: 'read' },
            },
          },
          permission: { domain: 'user', action: 'read' },
        },
        {
          label: 'menu.partners',
          to: {
            name: 'getAdminPartners',
            meta: {
              label: 'Recherche de partenaires',
              permission: { domain: 'party', action: 'read' },
            },
          },
          permission: { domain: 'party', action: 'read' },
        },
        {
          label: 'menu.cf',
          to: {
            name: 'getAdminCF',
            meta: {
              label: 'Recherche de comptes de facturation',
              permission: { domain: 'party', action: 'read_customer_account' },
            },
          },
          permission: { domain: 'party', action: 'read_customer_account' },
        },
        {
          label: 'menu.rolesManagement',
          to: {
            name: 'getAdminRoles',
            meta: {
              label: 'Gestion des rôles',
              permission: { domain: 'admin', action: 'permission' },
            },
          },
          permission: { domain: 'admin', action: 'permission' },
        },
        {
          label: 'menu.catalogOffers',
          to: {
            name: 'getAdminCatalogOffers',
            meta: {
              label: 'Gestion des offres',
              permission: { domain: 'catalog', action: 'read_catalog_offer' },
            },
          },
          permission: { domain: 'catalog', action: 'read_catalog_offer' },
        },
      ]);
    }

    let getSupportWindow = undefined;
    let waitingForGetSupportLink = false;

    let navbarLinks = excludeMocked([
      {
        label: 'mainMenu.getSim',
        to: { name: 'orders.search', meta: { label: 'Recherche de commandes' } },
        permission: { domain: 'getSim', action: 'read' },
        submenu: [
          {
            label: 'menu.getSim.manage-orders',
            to: {
              name: 'orders.search',
              meta: {
                label: 'Recherche de commandes',
                permission: { domain: 'getSim', action: 'read' },
              },
            },
            permission: { domain: 'getSim', action: 'read' },
          },
          {
            label: 'menu.getSim.manage-stocks',
            to: {
              name: 'stocks',
              meta: {
                label: 'Stock',
                permission: [
                  { domain: 'getSim', action: 'order_esim' },
                  { domain: 'getSim', action: 'manage_esim' },
                ],
              },
            },
            permission: () => {
              return (
                this.havePermission('getSim', 'read') &&
                this.havePermission('getSim', 'manage_stock_esim')
              );
            },
          },
        ],
      },
      {
        label: 'mainMenu.getParc',
        to: 'getParc',
        permission: { domain: 'getParc', action: 'read' },
        submenu: [
          {
            label: 'menu.actLines',
            to: {
              name: 'actLines',
              meta: {
                label: 'Recherche de lignes',
                permission: { domain: 'getParc', action: 'read' },
              },
            },
            permission: { domain: 'getParc', action: 'read' },
          },
          {
            label: 'menu.massActions',
            to: {
              name: 'actHistory.classic',
              meta: {
                label: 'Historique des actes',
                permission: { domain: 'act', action: 'read' },
              },
            },
            permission: { domain: 'act', action: 'read' },
          },
        ],
      },
    ]);
    if (this.userInfos && this.userInfos.isFleetEnabled) {
      navbarLinks.push({
        label: 'mainMenu.getVision',
        to: { name: 'getVisionMonitoring', meta: { label: 'Supervision' } },
        permission: () => {
          return (
            this.havePermission('getVision', 'read') ||
            this.havePermission('getVision', 'service_state') ||
            this.havePermission('getVision', 'service_state_roaming') ||
            this.havePermission('getVision', 'alarm')
          );
        },
      });
    }

    navbarLinks = navbarLinks
      .concat([
        {
          label: 'mainMenu.getAlarm',
          to: { name: 'alarms', meta: { label: 'Recherche des alarmes' } },
          permission: () => {
            return this.havePermission('alarm', 'read') && !this.userIsByCustomerAccount;
          },
        },
        {
          label: 'mainMenu.getReport',
          to: { name: 'reports', meta: { label: 'Modèles de rapports' } },
          permission: () => {
            return this.havePermissionDomain('getReport');
          },
          submenu: [
            {
              label: 'menu.modelReports',
              to: { name: 'getReportsModels', meta: { label: 'Modèles de rapports' } },
              permission: () => {
                return this.havePermission('getReport', 'read') && !this.userIsByCustomerAccount;
              },
            },
            {
              label: 'menu.documents',
              to: {
                name: 'documents',
                meta: {
                  label: 'Gestion des documents',
                  permission: { domain: 'getReport', action: 'manage_document' },
                },
              },
              permission: { domain: 'getReport', action: 'manage_document' },
            },
            {
              label: 'menu.reportsDashboard',
              to: { name: 'reportsDashboard', meta: { label: 'Tableau de bord' } },
              permission: () => {
                let canSeeMenu =
                  this.havePermission('getReport', 'read_dashboard') && this.flagStatistics;

                return canSeeMenu;
              },
            },
          ],
        },
        {
          label: 'mainMenu.getBill',
          to: {
            name: 'reportsBill',
            meta: { label: 'Factures', permission: { domain: 'getReport', action: 'read_bill' } },
          },
          permission: { domain: 'getReport', action: 'read_bill' },
        },
        {
          label: 'mainMenu.getAdmin',
          to: { name: 'exemples', meta: { label: 'Exemples' } },
          submenu: [...getAdminExtra],
        },
        {
          label: 'mainMenu.getSupport',
          to: { name: 'exemples', meta: { label: 'getSupport' } },
          permission: () => {
            return this.havePermission('getSupport', 'access') && !this.userIsByCustomerAccount;
          },
          onClick: async (targetName) => {
            if (waitingForGetSupportLink) return;

            waitingForGetSupportLink = true;
            try {
              const targetUrl = await getAccessToGetSupport(targetName);
              if (!getSupportWindow || getSupportWindow.closed) {
                getSupportWindow = window.open(targetUrl, '_blank');
              } else {
                getSupportWindow.location.replace(targetUrl);
              }
              waitingForGetSupportLink = false;
            } catch (e) {
              console.log(e);
              waitingForGetSupportLink = false;
            }
          },
          submenu: [
            {
              label: 'menu.getSupport.homepage',
              to: {
                name: 'HOMEPAGE',
                meta: {
                  label: 'getSupport',
                  permission: { domain: 'getSupport', action: 'access' },
                },
              },
              permission: { domain: 'getSupport', action: 'access' },
            },
            {
              label: 'menu.getSupport.all_incidents',
              to: {
                name: 'ALL_INCIDENTS',
                meta: {
                  label: 'getSupport - Tous les incidents',
                  permission: { domain: 'getSupport', action: 'access' },
                },
              },
              permission: { domain: 'getSupport', action: 'access' },
            },
            {
              label: 'menu.getSupport.search_incidents',
              to: {
                name: 'SEARCH_INCIDENTS',
                meta: {
                  label: "getSupport - Recherche d'incidents",
                  permission: { domain: 'getSupport', action: 'access' },
                },
              },
              permission: { domain: 'getSupport', action: 'access' },
            },
          ],
        },
        {
          label: 'mainMenu.getDevice',
          to: { name: 'getDevice', meta: { label: 'getDevice' } },
          permission: () => {
            return this.havePermission('getDevice', 'read') && !this.userIsByCustomerAccount;
          },
        },
        {
          label: 'mainMenu.help',
          to: {
            name: 'help',
            meta: { label: 'Aide', permission: { domain: 'admin', action: 'help' } },
          },
          permission: { domain: 'admin', action: 'help' },
          external: {
            url: 'https://www.objenious.com/aide-getway/',
          },
        },
        {
          label: 'mainMenu.contact',
          to: { name: 'contact', meta: { label: 'Contact' } },
          mailto: {
            email: this.emailContact,
          },
        },
      ])
      .filter((i) => {
        if (this.userIsM2MLight) {
          return i.label !== 'mainMenu.help';
        } else if (!this.userIsM2MLight) {
          return i.label !== 'mainMenu.contact';
        } else {
          return true;
        }
      });

    this.navbarLinks = navbarLinks;
    this.chooseCurrentMenu();
  },
  data() {
    return {
      currentIndex: 0,
      currentUrlName: '',
      currentIndexIsForced: false,
      navbarLinks: undefined,
      showNavMenu: false,
      flagStatistics: undefined,

      userMenuVisible: false,
    };
  },
  methods: {
    ...mapMutations(['changeAppLanguage']),
    filterByPermission(arrayInput) {
      if (arrayInput) {
        return arrayInput.filter((a) => {
          if (a.submenu) {
            const submenu = this.filterByPermission(a.submenu);
            if (submenu.length === 0) {
              return false;
            }
          }
          if (!a.permission) return true;
          if (typeof a.permission === 'function') {
            return a.permission();
          }
          return this.havePermission(a.permission.domain, a.permission.action);
        });
      }
    },
    chooseCurrentMenu() {
      let currentIndex;
      const visibleLinks = this.filterByPermission(this.navbarLinks);
      if (visibleLinks) {
        currentIndex = visibleLinks.findIndex((link) => link.to.name === this.currentUrlName);

        if (currentIndex === -1) {
          const mainMenu = visibleLinks.find((l) => {
            if (!l.submenu) {
              return false;
            }
            return l.submenu.find((sml) => sml.to.name === this.currentUrlName);
          });
          if (mainMenu) {
            currentIndex = visibleLinks.findIndex((link) => link.label === mainMenu.label);
          }
        }

        this.currentIndex = currentIndex;
      }
    },

    setPageTitle(route) {
      if (this.navbarLinks) {
        const firstLevelMenu = this.navbarLinks.find((m) => {
          if (m.submenu) return false;
          return m.to.name === route.name;
        });

        if (firstLevelMenu) {
          document.title = this.$t(firstLevelMenu.label);
        } else {
          const secondLevelMenu = this.navbarLinks
            .map((m) => {
              if (m.submenu) return m.submenu;

              return undefined;
            })
            .filter((sm) => !!sm)
            .flat()
            .find((m) => {
              return m.to.name === route.name;
            });

          if (secondLevelMenu) {
            document.title = this.$t(secondLevelMenu.label);
          }
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'userInfos',
      'singlePartner',
      'userIsGroupPartner',
      'userIsPartner',
      'userIsMVNO',
      'userIsM2MLight',
      'userIsSuperAdmin',
      'userName',
      'havePermission',
      'havePermissionDomain',
      'userLanguage',
      'userIsByCustomerAccount',
    ]),

    logoutUrl() {
      return getBaseURL() + '/oauth/logout';
    },

    emailContact() {
      return 'support-digital@objenious.com';
    },
  },
  watch: {
    $route(newRoute) {
      try {
        this.setPageTitle(newRoute);
      } catch (e) {
        console.log('error route ->', e);
      }
      this.currentUrlName = newRoute.name;
      this.chooseCurrentMenu();
    },
  },
};
</script>

<style lang="scss">
.navbars {
  margin: 0 auto;
  padding: 0 10px;
}

.nav-link {
  &:hover {
    & + .dropdown-menu {
      display: block;
    }
  }
}

.logoSvg {
  width: 100px;
  height: 60px;
}

.dropdown-menu {
  &:hover {
    display: block;
  }
}

.w100 {
  width: 100px;
}

.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .flex-part {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
}

.lang-flags {
  a {
    margin-right: 1em;
    padding: 0;
    img {
      height: 19px;
      padding: 2px;
    }

    &.active img {
      border: 2px solid $secondary;
      padding: 0;
    }
  }
}

.logo {
  &--corporate {
    margin-right: 15px;
  }

  &--client {
    max-width: 80px;
    margin-left: 30px;
  }
}

a {
  padding-top: 10px;

  &:hover {
    text-decoration: none;
  }
}

.burger {
  display: none;
  position: relative;

  &.open {
    span {
      &:nth-child(2) {
        display: none;
      }
      &:nth-child(1) {
        top: 0px;
        transform: rotate(45deg);
      }
      &:nth-child(3) {
        top: 0px;
        transform: rotate(-45deg);
      }
    }
  }

  @media screen and (max-width: 992px) {
    display: block;

    span {
      display: block;
      width: 20px;
      height: 2px;
      position: absolute;
      background: #383838;
      transition: 0.3s;

      &:first-child {
        top: -5px;
      }
      &:last-child {
        top: 5px;
      }
    }
  }
}

.tabs {
  @media screen and (max-width: 992px) {
    display: none;

    &.open {
      display: block;
      position: absolute;
      top: 110px;
      left: 50%;
      z-index: 9;
      background: white;
      transform: translateX(-50%);
      width: 100%;
      max-width: 690px;

      ol {
        display: flex;
        flex-direction: column;

        li {
          flex-basis: 0px;
        }
      }
    }
  }
}
.nav {
  justify-content: space-around;

  .sub-menu {
    position: absolute;
    z-index: 99;
    transform: translateX(-3.6rem);
  }

  @media only screen and (width: 1920px) {
    .sub-menu {
      transform: translateX(-4rem);
    }
  }

  @media only screen and (min-width: 1440px) {
    .sub-menu {
      transform: translateX(-4rem);
    }
  }

  .list-group-item {
    font-size: 0.875rem;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';

    &:hover {
      background-color: #f8f9fa;
    }

    a {
      color: #454545;
    }
  }
}

.icon {
  position: relative;
  color: $dark-gray;
  font-size: 1.5rem;

  .arrow {
    display: inline-block;
  }

  &:hover {
    cursor: pointer;
  }
}

.tab-label {
  &:hover {
    .dropdown-menu {
      display: block;
    }
    .dropdown-item:active {
      background-color: #f8f9fa;
    }
  }
}

.dropdown {
  display: inherit;
}

.flag {
  bottom: 0.5rem;
  position: relative;
}

.logo--client {
  width: 32px;
}

.auth-menu {
  margin-top: -5px !important;
}
</style>
