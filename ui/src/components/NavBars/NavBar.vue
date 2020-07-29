<template>
  <div class="flex-container">
    <div class="flex-part">
      <a href="/">
        <img
          v-if="!isBackofficeProfile"
          class="logo logo--corporate"
          src="@/assets/logo_bouygues.png"
          alt
        />
      </a>
      <UiTabs
        v-if="navbarLinks"
        :tabs="filterByPermission(navbarLinks)"
        :selected-index="currentIndex"
      >
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentIndex">
            <router-link v-if="!tab.submenu" :to="tab.to" :class="'menu_' + tab.to.name">{{
              tab.label
            }}</router-link>

            <div class="dropdown">
              <a v-if="tab.submenu" :to="tab.to" @click.prevent>{{ tab.label }}</a>
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
                <router-link
                  :key="item.label"
                  v-for="item in filterByPermission(tab.submenu)"
                  class="dropdown-item"
                  :class="'menu_' + item.to.name"
                  :to="item.to"
                  >{{ $t(item.label) }}</router-link
                >
              </div>
            </div>
          </UiTab>
        </template>
      </UiTabs>
    </div>
    <div class="flex-part">
      <div class="lang-flags">
        <ff-wip>
          <a
            href="#"
            @click.prevent="$i18n.locale = 'fr'"
            :class="{ active: $i18n.locale === 'fr' }"
            class="flag"
          >
            <img src="@/assets/fr.png" />
          </a>
          <a
            href="#"
            @click.prevent="$i18n.locale = 'en'"
            :class="{ active: $i18n.locale === 'en' }"
            class="flag"
          >
            <img src="@/assets/en.png" />
          </a>
        </ff-wip>

        <ActHistoryButton />
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
import { mapGetters } from 'vuex';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import ActHistoryButton from './ActHistoryButton';

import { excludeMocked } from '@/featureFlipping/plugin.js';

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
  mounted() {
    this.currentUrlName = this.$route.name;

    let getAdminExtra = [];

    if (this.userIsPartner) {
      getAdminExtra = [
        {
          label: 'menu.users',
          to: { name: 'getAdminUsers' },
          permission: { domain: 'user', action: 'read' },
        },
        {
          label: 'menu.account',
          to: {
            name: 'getAdminPartnerDetails',
            params: { id: this.userInfos.partners[0].id },
          },
          permission: { domain: 'party', action: 'read' },
        },
      ];
    } else {
      getAdminExtra = [
        {
          label: 'menu.users',
          to: { name: 'getAdminUsers' },
          permission: { domain: 'user', action: 'read' },
        },
        {
          label: 'menu.partners',
          to: { name: 'getAdminPartners' },
          permission: { domain: 'party', action: 'read' },
        },
      ];
    }

    this.navbarLinks = excludeMocked([
      {
        label: 'GetSIM',
        to: { name: 'orders' },
        permission: { domain: 'getSim', action: 'read' },
      },
      {
        label: 'GetParc/GetDiag',
        to: 'getParc',
        permission: { domain: 'getParc', action: 'read' },
        submenu: [
          {
            label: 'menu.actLines',
            to: { name: 'actLines' },
            permission: { domain: 'getParc', action: 'read' },
          },
          {
            label: 'menu.massActions',
            to: { name: 'actHistory' },
            permission: { domain: 'act', action: 'manage_main' },
          },
        ],
      },
      {
        label: 'GetVision',
        to: { name: 'alarms' },
        permission: { domain: 'alarm', action: 'read' },
        submenu: [
          {
            label: 'menu.alarms',
            to: { name: 'alarms' },
            permission: { domain: 'alarm', action: 'read' },
          },
          {
            label: 'menu.monitoring',
            to: { name: 'getVisionMonitoring' },
            permission: { domain: 'getVision', action: 'read' },
          },
        ],
      },
      {
        label: 'GetReport',
        to: { name: 'reports' },
        permission: { domain: 'getReport', action: 'read' },
        submenu: [
          {
            label: 'menu.modelReports',
            to: { name: 'getReportsModels' },
            permission: { domain: 'getReport', action: 'read' },
          },
          {
            label: 'menu.documents',
            to: { name: 'documents' },
            permission: { domain: 'getReport', action: 'manage_document' },
          },
          {
            label: 'menu.reportsDashboard',
            to: { name: 'reportsDashboard' },
            permission: { domain: 'getReport', action: 'read_dashboard' },
          },
          {
            label: 'menu.reportsBill',
            to: { name: 'reportsBill' },
            permission: { domain: 'getReport', action: 'read_bill' },
          },
        ],
      },
      {
        label: 'GetAdmin',
        to: { name: 'exemples' },
        submenu: [...getAdminExtra],
        permission: { domain: 'user', action: 'read' },
      },
      {
        label: 'GetSupport',
        to: { name: 'exemples' },
        permission: { domain: 'getSim', action: 'read' },
        mock: true,
      },
      {
        label: 'GetDevice',
        to: { name: 'getDevice' },
        permission: { domain: 'getDevice', action: 'read' },
      },
    ]);
    this.chooseCurrentMenu();
  },
  data() {
    return {
      currentIndex: 0,
      currentUrlName: '',
      currentIndexIsForced: false,
      navbarLinks: undefined,

      userMenuVisible: false,
    };
  },
  methods: {
    filterByPermission(arrayInput) {
      return arrayInput.filter(a => {
        if (!a.permission) return false;
        return this.havePermission(a.permission.domain, a.permission.action);
      });
    },
    chooseCurrentMenu() {
      let currentIndex = this.navbarLinks.findIndex(link => link.to.name === this.currentUrlName);

      if (currentIndex === -1) {
        const mainMenu = this.navbarLinks.find(l => {
          if (!l.submenu) {
            return false;
          }
          return l.submenu.find(sml => sml.to.name === this.currentUrlName);
        });
        if (mainMenu) {
          currentIndex = this.navbarLinks.findIndex(link => link.label === mainMenu.label);
        }
      }

      this.currentIndex = currentIndex;
    },
  },
  computed: {
    ...mapGetters(['userName', 'userInfos', 'userIsPartner', 'havePermission']),

    logoutUrl() {
      return process.env.VUE_APP_AUTH_SERVER_URL + '/oauth/logout';
    },
  },
  watch: {
    $route(newRoute) {
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

.dropdown-menu {
  &:hover {
    display: block;
  }
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
