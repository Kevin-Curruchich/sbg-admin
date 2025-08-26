import sbgApi from "@/apis/sbgApi";

export const requestPostStudentProgram = async (_, { studentId, data }) => {
  console.log("requestPostStudentProgram", studentId, data);

  return new Promise((resolve, reject) => {
    sbgApi
      .post(`/grades/student/${studentId}/program`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentPrograms = async ({ commit }, studentId) => {
  return new Promise((resolve, reject) => {
    commit("setIsLadingStudentPrograms", true);
    sbgApi
      .get(`/grades/student/${studentId}/programs`)
      .then((response) => {
        commit("setIsLadingStudentPrograms", false);
        commit("setStudentPrograms", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetPrograms = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get("/programs")
      .then((response) => {
        commit("setPrograms", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetProgramLevels = async ({ commit }, programId) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get("/programs/levels", {
        params: { programId },
      })
      .then((response) => {
        commit("setProgramLevels", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestGetStudentProgramLevels = async (
  _,
  { studentId, programId }
) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .get(`/grades/student/${studentId}/program/${programId}/levels`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const requestPostStudentProgramLevel = async (
  _,
  { studentId, data }
) => {
  return new Promise((resolve, reject) => {
    sbgApi
      .post(`/grades/student/${studentId}/program-level`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
