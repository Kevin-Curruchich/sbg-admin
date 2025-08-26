import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import paymentsState from "@/constants/paymentsState";

export default function usePayments() {
  const store = useStore();
  const router = useRouter();

  //   computed
  const payments = computed(() => store.getters["payments/getPayments"]);
  const isLoadingPayments = computed(
    () => store.getters["payments/getIsLoadingPayments"]
  );
  const paymentById = computed(() => store.getters["payments/getPaymentById"]);
  const isLoadingPaymentById = computed(
    () => store.getters["payments/getIsLoadingPaymentById"]
  );

  //refs
  const paymentPerPage = ref([]);

  //methods
  //get
  const requestGetPayments = async (params = { page: 1, take: 10 }) => {
    await store.dispatch("payments/requestGetPayments", params);
  };

  const requestGetPaymentById = async (id) => {
    await store.dispatch("payments/requestGetPaymentById", id);
  };

  //post
  const requestPostPayments = async (params) => {
    const response = await store.dispatch(
      "payments/requestPostPayments",
      params
    );
    return response;
  };

  const requestPostGlobalStudentsPayment = async (data) => {
    const response = await store.dispatch(
      "payments/requestPostGlobalStudentsPayment",
      data
    );
    return response;
  };

  const requestSpreadStudentPositiveCredit = async (studentId) => {
    const response = await store.dispatch(
      "payments/requestSpreadStudentPositiveCredit",
      studentId
    );
    return response;
  };

  const requestPostInvoiceMail = async (id) => {
    const response = await store.dispatch(
      "payments/requestPostInvoiceMail",
      id
    );
    return response;
  };

  const requestDeletePayment = async (paymentId) => {
    const response = await store.dispatch(
      "payments/requestDeletePayment",
      paymentId
    );
    return response;
  };

  //functions
  const getPaymentsId = (id) => {
    if (!id) return;
    return id.substring(0, 8);
  };

  const onNavigateToPayment = (id) => {
    router.push({ name: "Invoice", params: { id: id } });
  };

  const getStatusBadge = (status) => {
    let statusId = status;
    let statusReturn = "";
    switch (statusId) {
      case paymentsState.DRAFT:
        statusReturn = "info";
        break;
      case paymentsState.APPROVE:
        statusReturn = "success";
        break;
      case paymentsState.CANCEL:
        statusReturn = "danger";
        break;
    }
    return statusReturn;
  };

  const getStatus = (status) => {
    let statusId = status;
    let statusReturn = "";
    switch (statusId) {
      case paymentsState.DRAFT:
        statusReturn = "Borrador";
        break;
      case paymentsState.APPROVE:
        statusReturn = "Aprobada";
        break;
      case paymentsState.CANCEL:
        statusReturn = "Cancelada";
        break;
    }
    return statusReturn;
  };

  return {
    getPaymentsId,
    getStatus,
    getStatusBadge,
    isLoadingPaymentById,
    isLoadingPayments,
    onNavigateToPayment,
    paymentById,
    paymentPerPage,
    payments,
    requestGetPaymentById,
    requestGetPayments,
    requestPostPayments,
    requestPostInvoiceMail,
    requestPostGlobalStudentsPayment,
    requestSpreadStudentPositiveCredit,
    requestDeletePayment,
  };
}
