import sbgApi from "@/apis/sbgApi";

export const requestGetTerms = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingTerms", true);
    sbgApi
      .get(`/terms`, { params })
      .then((response) => {
        commit("setTerms", response.data);
        commit("setIsLoadingTerms", false);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGetTermsList = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/terms/list`, { params })
      .then((response) => {
        commit("setQuartersList", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGetTermsStatuses = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/terms/statuses`)
      .then((response) => {
        commit("setTermsStatuses", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGetQuartresByStudent = async ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/quartes/student/${id}`)
      .then((response) => {
        commit("setQuartersByStudent", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//post
export const requestPostTerm = async (_, data) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post(`/terms`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//put
export const requestPutTerm = async (_, { data, id }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .put(`/terms/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
