import sbgApi from "@/apis/sbgApi";

export const requestGetStudents = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingStudents", true);
    sbgApi
      .get(`/students`, { params })
      .then((response) => {
        commit("setStudents", response.data);
        commit("setIsLoadingStudents", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        commit("setIsLoadingStudents", false);
        reject(error);
      });
  });
};

export const requestGetStudentsList = async ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/students/list`, {
        params,
      })
      .then((response) => {
        commit("setStudentsList", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentById = async ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingStudent", true);
    sbgApi
      .get(`/students/${id}`)
      .then((response) => {
        commit("setStudentById", response.data);
        commit("setIsLoadingStudent", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentStatuses = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get("/students/statuses")
      .then((response) => {
        commit("setStudentStatuses", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentTypes = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingStudentTypes", true);
    sbgApi
      .get("/students/types")
      .then((response) => {
        commit("setStudentTypes", response.data);
        commit("setIsLoadingStudentTypes", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentListFiltered = async ({ commit }, { params }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingStudentByStudentTypeId", true);
    sbgApi
      .get(`/students/list`, {
        params,
      })
      .then((response) => {
        commit("setStudentsListFiltered", response.data);
        commit("setIsLoadingStudentByStudentTypeId", false);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPostStudent = async (_, data) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post("/students", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPostStudentType = async (_, data) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post("/students/types", data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPutStudent = async (_, { studentId, data }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .put(`/students/${studentId}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
