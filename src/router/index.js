import { createRouter, createWebHistory } from "vue-router";
// import isAdminUser from "../modules/auth/guards/auth-gard-admin.js";
// import isAcademicUser from "../modules/auth/guards/auth-gard-academic.js";
// import isAuthenticatedGuard from "../modules/auth/guards/auth-gard.js";
import Default from "../views/dashboards/Default.vue";
import StudentsRouter from "./modules/Students";
import StudentTypesRouter from "./modules/StudentTypes";
import Payments from "./modules/Payments";
import Collections from "./modules/Collections";
import ReportsRouter from "./modules/Reports";
import SettingsRouter from "./modules/Settings";
import Illustration from "../modules/auth/views/Illustration.vue";
import Signup from "../modules/auth/views/Signup.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: Illustration,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // beforeEnter: [isAuthenticatedGuard, isAdminUser],
    component: Default,
  },
  {
    path: "/students",
    // beforeEnter: [isAuthenticatedGuard],
    ...StudentsRouter,
  },
  {
    path: "/student-types",
    // beforeEnter: [isAuthenticatedGuard, isAdminUser],
    ...StudentTypesRouter,
  },
  {
    path: "/payments",
    // beforeEnter: [isAuthenticatedGuard],
    ...Payments,
  },
  {
    path: "/collections",
    // beforeEnter: [isAuthenticatedGuard, isAdminUser],
    ...Collections,
  },
  {
    path: "/reports",
    // beforeEnter: [isAuthenticatedGuard, isAdminUser],
    ...ReportsRouter,
  },
  {
    path: "/settings",
    // beforeEnter: [isAuthenticatedGuard, isAdminUser],
    ...SettingsRouter,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: { name: "Dashboard" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;
