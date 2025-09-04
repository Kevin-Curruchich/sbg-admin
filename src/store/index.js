import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import auth from "./modules/Auth";
import students from "./modules/Students";
import collections from "./modules/Collections";
import payments from "./modules/Payments";
import quarters from "./modules/Quarters";
import reports from "./modules/Reports";
import dashboard from "./modules/Dashboard";
import grades from "./modules/Grades";
import courses from "./modules/Courses";

const store = createStore({
  state: {
    hideConfigButton: true,
    isPinned: true,
    showConfig: false,
    isRTL: false,
    color: "",
    sidebarType: "bg-white",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: false,
    showFooter: true,
    showMain: true,
    layout: "default",
    bootstrap,
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = false;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector("#app");

      if (
        sidenav_show.classList.contains("g-sidenav-show") &&
        sidenav_show.classList.contains("g-sidenav-hidden")
      ) {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      } else if (
        sidenav_show.classList.contains("g-sidenav-show") &&
        sidenav_show.classList.contains("g-sidenav-pinned")
      ) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else if (
        sidenav_show.classList.contains("g-sidenav-show") &&
        window.innerWidth < 1200
      ) {
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    setSidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    toggleDefaultLayout(state) {
      state.showNavbar = !state.showNavbar;
      state.showSidenav = !state.showSidenav;
      state.showFooter = !state.showFooter;
    },
    toggleDefaultLayoutFalse(state) {
      state.showNavbar = false;
      state.showSidenav = false;
      state.showFooter = false;
    },
    toggleDefaultLayoutTrue(state) {
      state.showNavbar = true;
      state.showSidenav = true;
      state.showFooter = true;
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("setSidebarType", payload);
    },
  },
  modules: {
    auth,
    students,
    collections,
    payments,
    quarters,
    reports,
    dashboard,
    grades,
    courses,
  },
  plugins: [createPersistedState()],
});

// window.addEventListener("beforeunload", () => {
//   localStorage.setItem("store", JSON.stringify(store.state));
// });

// // Restore store state from local storage on page load
// const savedState = localStorage.getItem("store");
// if (savedState) {
//   store.replaceState(JSON.parse(savedState));
// }

export default store;
