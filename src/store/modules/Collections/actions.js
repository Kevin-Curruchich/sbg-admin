import sbgApi from "@/apis/sbgApi";

//get
export const requestGetCollections = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollections", true);
    sbgApi
      .get(`/collections`)
      .then((response) => {
        commit("setCollection", response.data);
        commit("setIsLoadingCollections", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetAssignedCollections = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingAssignedCollections", true);
    commit("setAssignedCollection", { data: [], total: 0 });
    sbgApi
      .get(`/collections/students`, { params })
      .then((response) => {
        commit("setAssignedCollection", response.data);
        commit("setIsLoadingAssignedCollections", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetCollectionsByStudent = async (
  { commit },
  { studentId, params }
) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollectionsByStudent", true);
    sbgApi
      .get(`/collections/students/${studentId}/history`, { params })
      .then((response) => {
        commit("setCollectionsByStudent", response.data);
        commit("setIsLoadingCollectionsByStudent", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetCollectionsOwedByStudent = async (
  { commit },
  studentId
) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollectionsByStudent", true);
    sbgApi
      .get(`/collections/students/${studentId}/owed`)
      .then((response) => {
        commit("setCollectionsOwedByStudent", response.data);
        commit("setIsLoadingCollectionsOwedByStudent", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetCollectionTypes = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollectionTypes", true);
    sbgApi
      .get(`/collections/types`)
      .then((response) => {
        commit("setCollectionTypes", response.data);
        commit("setIsLoadingCollectionTypes", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

//post
export const requestPostCollectionStudent = async (_, params) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post(`/collections/student`, params)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPostCollection = async (_, data) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post(`/collections`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPostCollectionStudents = async (_, { data }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post("/collections/students", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const putCollection = async (_, { id, data }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .put(`/collections/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error.response.data);
      });
  });
};

export const putCollectionStudent = async (_, { id, data }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .put(`/collections/students/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error.response.data);
      });
  });
};
