import { computed } from "vue";
import { useStore } from "vuex";

const useQuarters = () => {
  const store = useStore();

  //getters
  const quarters = computed(() => store.getters["quarters/getQuarters"]);
  const isLoadingQuarters = computed(
    () => store.getters["quarters/getIsLoadingQuarters"]
  );

  const quartersList = computed(
    () => store.getters["quarters/getQuartersList"] || []
  );

  const quartersByStudent = computed(
    () => store.getters["quarters/getQuartersByStudent"]
  );

  const termsStatuses = computed(
    () => store.getters["quarters/getTermsStatuses"] || []
  );

  const isLoadingTermsStatuses = computed(
    () => store.getters["quarters/getIsLoadingTermsStatuses"]
  );

  //methods
  const requestGetTerms = async (params = { page: 1, take: 10 }) => {
    const resp = await store.dispatch("quarters/requestGetTerms", params);
    return resp;
  };

  const requestGetQuartresByStudent = async (id) => {
    const resp = await store.dispatch(
      "quarters/requestGetQuartresByStudent",
      id
    );

    return resp;
  };

  const requestGetTermsList = async () => {
    const resp = await store.dispatch("quarters/requestGetTermsList");
    return resp;
  };

  const requestGetTermsStatuses = async () => {
    const resp = await store.dispatch("quarters/requestGetTermsStatuses");
    return resp;
  };

  const requestPostTerm = async (data) => {
    const resp = await store.dispatch("quarters/requestPostTerm", data);
    return resp;
  };

  const requestPutTerm = async ({ data, id }) => {
    const resp = await store.dispatch("quarters/requestPutTerm", {
      data,
      id,
    });
    return resp;
  };

  return {
    isLoadingQuarters,
    quarters,
    quartersByStudent,
    quartersList,
    requestGetTerms,
    requestGetQuartresByStudent,
    requestGetTermsList,
    requestPostTerm,
    requestPutTerm,
    termsStatuses,
    isLoadingTermsStatuses,
    requestGetTermsStatuses,
  };
};

export default useQuarters;
