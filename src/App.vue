<!--
=========================================================
* Vue Argon Dashboard 2 PRO - v3.0.1
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->

<template>
  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>
  <sidenav v-if="showSidenav" :show-aside="accesSideNav" />

  <main class="main-content position-relative max-height-vh-100 h-100">
    <navbar v-if="showNavbar" />
    <router-view />
    <app-footer v-show="showFooter" />
    <!-- <configurator
      :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
    /> -->
  </main>
</template>
<script>
import Sidenav from "./examples/Sidenav";
// import Configurator from "@/examples/Configurator.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import AppFooter from "@/examples/Footer.vue";
import { mapState } from "vuex";
import useAuth from "@/composables/useAuth";
import userRole from "@/constants/userRole";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    Sidenav,
    // Configurator,
    Navbar,
    AppFooter,
  },
  setup() {
    const { userData } = useAuth();

    return {
      userData,
      accesSideNav: computed(
        () =>
          userData.value?.roleId === userRole.ADMIN ||
          userData.value?.roleId === userRole.ACADEMIC
      ),
    };
  },
  computed: {
    ...mapState([
      "layout",
      "showSidenav",
      "showNavbar",
      "showFooter",
      "showConfig",
      "hideConfigButton",
    ]),
  },
};
</script>
