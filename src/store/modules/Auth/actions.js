import sbgApi from "@/apis/sbgApi";

export const signInUser = async ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post("/auth/login", user)
      .then((response) => {
        commit("loginUser", response.data);

        console.log({ response });

        resolve({ ok: true });
      })
      .catch((error) => {
        reject({ ok: false, error: error.response.data });
      });
  });
};

export const signUpUser = async ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post("/sign-up", user)
      .then((response) => {
        commit("loginUser", response.data);
        resolve({ ok: true });
      })
      .catch((error) => {
        reject({ ok: false, error: error.response.data });
      });
  });
};

export const checkAuthentication = async ({ commit }) => {
  const accesToken = localStorage.getItem("sbg-admin-access-token");

  if (!accesToken) {
    commit("logout");
    return { ok: false, message: "No estas autorizado" };
  }
  return { ok: true };

  // try {
  //   const { data } = await sbgApi.post(":lookup", { idToken });
  //   const { displayName, email } = data.users[0];

  //   const user = {
  //     name: displayName,
  //     email,
  //   };

  //   commit("loginUser", { user, idToken, refreshToken });

  //   return { ok: true };
  // } catch (error) {
  //   commit("logout");
  //   return { ok: false, message: error.response.data.error.message };
  // }
};
