export const setIsDownloadReportByStudent = (state, val) => {
  state.isDownloadingStudentChargesReport = val;
};

export const setIsDownloadingReportByYear = (state, val) => {
  state.isDownloadingReportByYear = val;
};

export const setIsDownloadingStudentsPersonalData = (state, val) => {
  state.isDownloadingStudentsPersonalData = val;
};

export const setPaymentsReport = (state, val) => {
  state.paymentsReport = val;
};

export const setIsLoadingPaymentsReport = (state, val) => {
  state.isLoadingPaymentsReport = val;
};

export const setIsDownloadingPaymentsReport = (state, val) => {
  state.isDownloadingPaymentsReport = val;
};
