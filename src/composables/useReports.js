import { computed } from "vue";
import { useStore } from "vuex";

const useReports = () => {
  const store = useStore();

  //getters
  const isDownlodReportByStudent = computed(
    () => store.getters["reports/getIsDownloadReportByStudent"]
  );

  const isDownloadingReportByYear = computed(
    () => store.getters["reports/getIsDownloadingReportByYear"]
  );

  const isDownloadingStudentsPersonalData = computed(
    () => store.getters["reports/getIsDownloadingStudentsPersonalData"]
  );

  const paymentsReport = computed(
    () => store.getters["reports/getPaymentsReport"]
  );

  const isLoadingPaymentsReport = computed(
    () => store.getters["reports/getIsLoadingPaymentsReport"]
  );

  const isDownloadingPaymentsReport = computed(
    () => store.getters["reports/getIsDownloadingPaymentsReport"]
  );

  //methods
  const requestDownloadCollectionHistoryByStudent = (id, params) => {
    const resp = store.dispatch(
      "reports/requestDownloadCollectionHistoryByStudent",
      { studentId: id, params }
    );
    return resp;
  };

  const requestDownloadCollectionHistoryByYear = (params) => {
    const resp = store.dispatch(
      "reports/requestDownloadCollectionHistoryByYear",
      { params }
    );
    return resp;
  };

  const requestDownloadStudentsPersonalData = () => {
    const resp = store.dispatch("reports/requestDownloadStudentsPersonalData");
    return resp;
  };

  const requestGetPaymentsReport = (params) => {
    const resp = store.dispatch("reports/requestGetPaymentsReport", { params });
    return resp;
  };

  const requestDownloadPaymentsReport = (params) => {
    const resp = store.dispatch("reports/requestDownloadPaymentsReport", {
      params,
    });
    return resp;
  };

  return {
    isDownlodReportByStudent,
    requestDownloadCollectionHistoryByStudent,
    isDownloadingReportByYear,
    requestDownloadCollectionHistoryByYear,
    isDownloadingStudentsPersonalData,
    requestDownloadStudentsPersonalData,
    requestGetPaymentsReport,
    requestDownloadPaymentsReport,
    paymentsReport,
    isLoadingPaymentsReport,
    isDownloadingPaymentsReport,
  };
};

export default useReports;
