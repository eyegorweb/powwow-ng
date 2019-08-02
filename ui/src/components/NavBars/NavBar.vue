<template>
  <div class="flex-container">
    <div class="flex-part">
      <img
        v-if="!isBackofficeProfile"
        class="logo logo--corporate"
        src="@/assets/logo_bouygues.png"
        alt
      />
      <UiTabs :tabs="navbarLinks" :selected-index="currentIndex">
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentIndex">
            <router-link v-if="!tab.submenu" :to="tab.to">{{ tab.label }}</router-link>

            <div class="dropdown">
              <a v-if="tab.submenu" :to="tab.to" @click.prevent>{{ tab.label }}</a>
              <div
                v-if="tab.submenu"
                class="dropdown-menu"
                aria-labelledby="dropdownMenuLink"
                x-placement="bottom-start"
                style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 2.5rem, 0px);"
                @click="foceCurrentIndex('GetParc/GetDiag')"
              >
                <router-link
                  :key="item.label"
                  v-for="item in tab.submenu"
                  class="dropdown-item"
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
        <a href="#" @click.prevent="$i18n.locale = 'fr'" :class="{ active: $i18n.locale === 'fr' }">
          <img src="@/assets/fr.png" />
        </a>
        <a href="#" @click.prevent="$i18n.locale = 'en'" :class="{ active: $i18n.locale === 'en' }">
          <img src="@/assets/en.png" />
        </a>
      </div>
      <div class="nav">
        <div class="icon ic-Clock-Icon" />
        <div class="icon ic-User-Icon" @click="userMenuVisible = !userMenuVisible">
          <i v-if="!userMenuVisible" class="arrow ic-Arrow-Down-Icon" />
          <i v-if="userMenuVisible" class="arrow ic-Arrow-Up-Icon" />
          <div v-if="userMenuVisible" class="sub-menu">
            <ul class="list-group">
              <li class="list-group-item">
                {{ userInfos.name.firstName }}
                {{ userInfos.name.lastName }}
                <br />
                {{ userInfos.email }}
              </li>
              <li class="list-group-item">
                <a :href="logoutUrl">{{ $t('logout') }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <img
        v-if="!isBackofficeProfile"
        class="logo logo--client"
        src="@/assets/logo_notfound.png"
        alt
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

export default {
  name: 'NavBar',
  components: {
    UiTabs,
    UiTab,
  },
  props: {
    isBackofficeProfile: Boolean,
  },
  mounted() {
    this.currentUrlName = this.$route.name;
  },
  data() {
    return {
      currentIndex: 0,
      currentUrlName: '',
      currentIndexIsForced: false,
      navbarLinks: [
        {
          label: 'GetSIM',
          to: { name: 'orders' },
        },
        {
          label: 'GetParc/GetDiag',
          to: 'getParc',
          submenu: [
            {
              label: 'menu.actLines',
              to: { name: 'actLines' },
            },
            {
              label: 'menu.massActions',
              to: { name: 'actHistory' },
            },
          ],
        },
        { label: 'GetVision', to: { name: 'exemples' } },
        { label: 'GetReport', to: { name: 'exemples' } },
        { label: 'GetAdmin', to: { name: 'exemples' } },
        { label: 'GetSupport', to: { name: 'exemples' } },
        { label: 'GetDevice', to: { name: 'exemples' } },
      ],

      userMenuVisible: false,
    };
  },
  methods: {
    foceCurrentIndex(label) {
      this.currentIndex = this.getIndexOfItemByLabel(label);
      this.currentIndexIsForced = true;
    },
    getIndexOfItemByLabel(label) {
      if (!this.navbarLinks) {
        return 0;
      }
      return this.navbarLinks.findIndex(link => link.label === label);
    },
  },
  computed: {
    ...mapGetters(['userName', 'userInfos']),
    currentLinkIndex() {
      return this.navbarLinks.findIndex(link => link.to.name === this.$route.name);
    },
    logoutUrl() {
      return process.env.VUE_APP_AUTH_SERVER_URL + '/oauth/logout';
    },
  },
  watch: {
    $route(newRoute) {
      if (this.currentIndexIsForced) {
        this.currentIndexIsForced = false;
        return;
      }
      this.currentUrlName = newRoute.name;
      this.currentIndex = this.navbarLinks.findIndex(link => link.to.name === this.currentUrlName);
    },
  },
};
</script>

<style scoped lang="scss">
.navbars {
  margin: 0 auto;
  padding: 0 10px;
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
  font-size: 24px;

  &:last-child {
    margin-left: 30px;
  }

  .arrow {
    display: inline-block;
  }

  &.ic-Clock-Icon:after {
    content: '8';
    display: block;
    font-size: 0.7rem;
    color: $white;
    background-color: $orange;
    position: absolute;
    top: -0.4rem;
    right: -0.5rem;
    font-family: 'Open Sans', sans-serif;
    border-radius: 50%;
    padding: 0.1rem 0.2rem;
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
</style>
