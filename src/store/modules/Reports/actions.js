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

export const requestGetPaymentsReport = async ({ commit }, { params }) => {
  return new Promise((resolve, reject) => {
    commit("setIsLoadingPaymentsReport", true);
    sbgApi
      .get(`/reports/payments`, { params })
      .then((response) => {
        commit("setIsLoadingPaymentsReport", false);
        commit("setPaymentsReport", response.data);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        commit("setIsLoadingPaymentsReport", false);
        reject(error);
      });
  });
};

export const requestDownloadPaymentsReport = async ({ commit }, { params }) => {
  return new Promise((resolve, reject) => {
    commit("setIsDownloadingPaymentsReport", true);
    sbgApi
      .get(`/reports/payments/export`, { params, responseType: "blob" })
      .then((response) => {
        commit("setIsDownloadingPaymentsReport", false);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        commit("setIsDownloadingPaymentsReport", false);
        reject(error);
      });
  });
};
