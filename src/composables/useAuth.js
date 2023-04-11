import { computed } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";

const useAuth = () => {
  const router = useRouter();

  const loginUser = async (user) => {
    const resp = await store.dispatch("auth/signInUser", user);
    return resp;
  };

  const checkAuthStatus = async () => {
    const resp = await store.dispatch("auth/checkAuthentication");
    return resp;
  };

  const logout = () => {
    store.commit("auth/logout");
    router.push({ name: "login" });
  };

  return {
    checkAuthStatus,
    loginUser,
    logout,

    authStatus: computed(() => store.getters["auth/currentState"]),
    username: computed(() => store.getters["auth/username"]),
  };
};

export default useAuth;
