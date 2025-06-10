import sbgApi from "@/apis/sbgApi";

export const requestGetDashboard = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingDashboard", true);
    sbgApi
      .get("/general/dashboard")
      .then((response) => {
        commit("setDashboardData", response.data);
        commit("setIsLoadingDashboard", false);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
