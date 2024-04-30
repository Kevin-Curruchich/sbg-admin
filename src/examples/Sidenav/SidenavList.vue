<template>
  <div
    id="sidenav-collapse-main"
    class="collapse navbar-collapse w-auto h-auto h-100"
  >
    <ul class="navbar-nav">
      <sidenav-item :to="{ name: 'Dashboard' }" mini-icon="D" text="Dashboard">
        <template #icon>
          <i class="ni ni-world text-primary text-sm opacity-10"></i>
        </template>
      </sidenav-item>
      <sidenav-item
        :to="{ name: 'List of Students' }"
        mini-icon="E"
        text="Estudiantes"
      >
        <template #icon>
          <i class="fas fa-users text-secondary text-sm opacity-10"></i>
        </template>
      </sidenav-item>
      <sidenav-item
        v-if="userIsAdmin || userIsAcademic"
        :to="{ name: 'Collections List' }"
        mini-icon="CA"
        text="Cobros Asignados"
      >
        <template #icon>
          <i class="fas fa-dollar-sign"></i>
        </template>
      </sidenav-item>
      <sidenav-item
        v-if="userIsAdmin"
        :to="{ name: 'Payments List' }"
        mini-icon="A"
        text="Aportes"
      >
        <template #icon>
          <i class="fas fa-receipt"></i>
        </template>
      </sidenav-item>

      <li v-if="userIsAdmin" class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6">
          Reportes
        </h6>
      </li>

      <sidenav-item
        v-if="userIsAdmin"
        :to="{ name: 'Payments Report' }"
        mini-icon="A"
        text="Reporte Aportes"
      />

      <li v-if="userIsAdmin" class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6">
          Utilidades
        </h6>
      </li>
      <sidenav-collapse
        v-if="userIsAdmin"
        collapse-ref="settingsPages"
        nav-text="Configuracion"
        :class="getRoute() === 'settings' ? 'active' : ''"
      >
        <template #icon>
          <i class="fas fa-cog text-warning text-sm opacity-10"></i>
        </template>
        <template #list>
          <ul class="nav ms-4">
            <sidenav-item
              :to="{ name: 'Settings Student Types' }"
              mini-icon="S"
              text="Tipo de Estudiante"
            />
            <sidenav-item
              :to="{ name: 'Settings Collections' }"
              mini-icon="S"
              text="Cobros"
            />
            <sidenav-item
              :to="{ name: 'Settings Quarters' }"
              mini-icon="T"
              text="Trimestres"
            />
          </ul>
        </template>
      </sidenav-collapse>
    </ul>
  </div>
  <!-- <div class="mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    />
  </div> -->
</template>
<script>
import SidenavItem from "./SidenavItem.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import { useAuth } from "../../composables";
// import SidenavCollapseItem from "./SidenavCollapseItem.vue";

export default {
  name: "SidenavList",
  components: {
    SidenavItem,
    SidenavCollapse,
    // SidenavCollapseItem,
  },
  setup() {
    const { userIsAdmin, userIsAcademic } = useAuth();

    return {
      userIsAdmin,
      userIsAcademic,
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
  },
};
</script>
<style>
.navbar-vertical.navbar-expand-xs .navbar-collapse {
  overflow: hidden !important;
}
</style>
