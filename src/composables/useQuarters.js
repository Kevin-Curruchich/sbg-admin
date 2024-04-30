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

  //methods
  const requestGetQuartres = async (params = { page: 1, take: 10 }) => {
    const resp = await store.dispatch("quarters/requestGetQuartres", params);
    return resp;
  };

  const requestGetQuartresByStudent = async (id) => {
    const resp = await store.dispatch(
      "quarters/requestGetQuartresByStudent",
      id
    );

    return resp;
  };

  const requestGetQuartresList = async () => {
    const resp = await store.dispatch("quarters/requestGetQuartresList");
    return resp;
  };

  const requestPostQuarters = async (data) => {
    const resp = await store.dispatch("quarters/requestPostQuarters", data);
    return resp;
  };

  const requestPutQuarters = async ({ data, id }) => {
    const resp = await store.dispatch("quarters/requestPutQuarters", {
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
    requestGetQuartres,
    requestGetQuartresByStudent,
    requestGetQuartresList,
    requestPostQuarters,
    requestPutQuarters,
  };
};

export default useQuarters;
