<template>
  <div class="navbars bg-white">
    <NavBarBackoffice v-if="isBackoffice" />
    <div class="flex-container">
      <div class="flex-part flex-part-left">
        <img
          v-if="!isBackoffice"
          class="logo logo--corporate"
          src="../assets/logo_bouygues.png"
          alt=""
        >
        <UiTabs
          :tabs="navbarLinks"
          :selected-index="currentLinkIndex"
        >
          <template
            slot-scope="{ tab, index }"
          >
            <UiTab
              :is-selected="index === currentLinkIndex"
            ><router-link :to="tab.to">{{ tab.label }}</router-link>
            </UiTab>
          </template>
        </UiTabs>
      </div>
      <div class="flex-part flex-part-right">
        <NavIcons :nav-icons="navIcons" />
        <img
          v-if="!isBackoffice"
          class="logo logo--client"
          src="../assets/logo_client_exemple.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import NavBarBackoffice from './NavBarBackoffice';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import NavIcons from '@/components/ui/NavIcons';

export default {
  name: 'NavBars',
  props: {
    isBackoffice: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      navbarLinks: [
        { label: 'GetSIM', to: { name: 'home' } },
        { label: 'GetParc/GetDiag', to: { name: 'home' } },
        { label: 'GetVision', to: { name: 'home' } },
        { label: 'GetReport', to: { name: 'home' } },
        { label: 'GetAdmin', to: { name: 'home' } },
        { label: 'GetSupport', to: { name: 'home' } },
        { label: 'GetDevice', to: { name: 'about' } },
      ],
      navIcons: [
        { key: 'icon_1', class: 'ic-Clock-Icon', isMultilevels: false },
        { key: 'icon_2', class: 'ic-User-Icon', isMultilevels: true },
      ],
    };
  },
  components: {
    NavBarBackoffice,
    UiTabs,
    UiTab,
    NavIcons,
  },
  computed: {
    currentLinkIndex() {
      return this.navbarLinks.findIndex(link => link.to.name === this.$route.name);
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
</style>
