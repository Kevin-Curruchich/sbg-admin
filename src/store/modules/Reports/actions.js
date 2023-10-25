import sbgApi from "@/apis/sbgApi";

export const requestDownloadCollectionHistoryByStudent = async (
  { commit },
  { studentId, params }
) => {
  return new Promise((resolve, reject) => {
    commit("setIsDownloadReportByStudent", true);
    sbgApi
      .get(`/reports/students/${studentId}`, { params, responseType: "blob" })
      .then((response) => {
        commit("setIsDownloadReportByStudent", false);
        resolve(response);
      })
      .catch((error) => {
        commit("setIsDownloadReportByStudent", false);

        console.log(error);
        reject(error);
      });
  });
};

export const requestDownloadCollectionHistoryByYear = async (
  { commit },
  { params }
) => {
  return new Promise((resolve, reject) => {
    commit("setIsDownloadingReportByYear", true);
    sbgApi
      .get(`/reports/year`, { params, responseType: "blob" })
      .then((response) => {
        commit("setIsDownloadingReportByYear", false);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        commit("setIsDownloadingReportByYear", false);
        reject(error);
      });
  });
};

export const requestDownloadStudentsPersonalData = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setIsDownloadingStudentsPersonalData", true);
    sbgApi
      .get(`/reports/all-students`, {
        // params,
        responseType: "blob",
      })
      .then((response) => {
        commit("setIsDownloadingStudentsPersonalData", false);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        commit("setIsDownloadingStudentsPersonalData", false);
        reject(error);
      });
  });
};
