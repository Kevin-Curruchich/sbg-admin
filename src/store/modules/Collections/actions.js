import sbgApi from "@/apis/sbgApi";

//get
export const requestGetCollectionsList = async ({ commit }, { params }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollections", true);
    sbgApi
      .get(`/charges/list`, {
        params,
      })
      .then((response) => {
        commit("setCollectionList", response.data);
        commit("setIsLoadingCollections", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestChargeFrequency = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/charges/frequency`)
      .then((response) => {
        commit("setChargesFrequency", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGetCollections = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollections", true);
    sbgApi
      .get(`/charges`, {
        params,
      })
      .then((response) => {
        commit("setCollections", response.data);
        commit("setIsLoadingCollections", false);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGetAssignedCollections = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingAssignedCollections", true);
    sbgApi
      .get(`/charges`, { params })
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
      .get(`/charges/student/${studentId}`, { params })
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

export const requestGetCollectionsOwedByStudent = (
  { commit },
  { studentId, params }
) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollectionsByStudent", true);
    sbgApi
      .get(`/charges/student/${studentId}`, {
        params,
      })
      .then((response) => {
        commit("setCollectionsOwedByStudent", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
      .finally(() => {
        commit("setIsLoadingCollectionsOwedByStudent", false);
      });
  });
};

export const requestGetCollectionTypes = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingCollectionTypes", true);
    sbgApi
      .get(`/charges/types`)
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

export const requestGetCollectionApplyToStudent = async (_, studentId) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/charges/apply/student/${studentId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetCollectionStatuses = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/charges/statuses`)
      .then((response) => {
        commit("setCollectionStatuses", response.data);

        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentBalance = async ({ commit }, studentId) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/charges/student/${studentId}/balance`)
      .then((response) => {
        commit("setStudentBalance", response.data);
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
      .post(`/charges/student`, params)
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
      .post("/charges/students", data)
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
      .put(`/charges/${id}/student`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error.response.data);
      });
  });
};
