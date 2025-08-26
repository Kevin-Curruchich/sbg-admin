import { computed } from "vue";
import { useStore } from "vuex";

export default function useCollection() {
  const store = useStore();

  //   computed
  const collectionsList = computed(
    () => store.getters["collections/getCollectionsList"]
  );

  const collections = computed(
    () => store.getters["collections/getCollections"]
  );

  const isLoadingCollections = computed(
    () => store.getters["collections/getIsLoadingCollections"]
  );

  const isLoadingCollectionList = computed(
    () => store.getters["collections/getIsLoadingCollectionList"]
  );

  const collectionTypes = computed(
    () => store.getters["collections/getCollectionTypes"]
  );

  const isLoadingCollectionTypes = computed(
    () => store.getters["collections/getIsLoadingCollectionTypes"]
  );

  const assignedCollections = computed(
    () => store.getters["collections/getAssignedCollections"]
  );
  const isLoadingAssignedCollections = computed(
    () => store.getters["collections/getIsLoadingAssignedCollections"]
  );

  const collectionsOwedByStudent = computed(
    () => store.getters["collections/getCollectionsOwedByStudent"]
  );

  const isLoadingCollectionsOwedByStudent = computed(
    () => store.getters["collections/getIsLoadingCollectionsOwedByStudent"]
  );

  const collectionsByStudent = computed(
    () => store.getters["collections/getCollectionsByStudent"]
  );

  const isLoadingCollectionsByStudent = computed(
    () => store.getters["collections/getIsLoadingCollectionsByStudent"]
  );

  //methods
  //gets
  const requestGetCollectionsList = async ({ params } = {}) => {
    await store.dispatch("collections/requestGetCollectionsList", { params });
  };

  const requestGetCollections = async (params = { page: 1, take: 10 }) => {
    await store.dispatch("collections/requestGetCollections", params);
  };

  const requestGetCollectionTypes = async () => {
    await store.dispatch("collections/requestGetCollectionTypes");
  };

  const requestChargeFrequency = async () => {
    await store.dispatch("collections/requestChargeFrequency");
  };

  const chargesFrequency = computed(
    () => store.getters["collections/getChargesFrequency"]
  );

  const requestGetCollectionStatuses = async () => {
    await store.dispatch("collections/requestGetCollectionStatuses");
  };

  const collectionStatuses = computed(
    () => store.getters["collections/getCollectionStatuses"]
  );

  const requestGetAssignedCollections = async (
    params = {
      page: 1,
      take: 10,
    }
  ) => {
    const resp = await store.dispatch(
      "collections/requestGetAssignedCollections",
      params
    );

    return resp;
  };

  const requestGetCollectionsOwedByStudent = async ({ studentId, params }) => {
    const resp = await store.dispatch(
      "collections/requestGetCollectionsOwedByStudent",
      { studentId, params }
    );

    return resp;
  };

  const requestGetCollectionsByStudent = async (studentId, params) => {
    const resp = await store.dispatch(
      "collections/requestGetCollectionsByStudent",
      { studentId, params }
    );

    return resp;
  };

  const requestGetCollectionApplyToStudent = async (studentId) => {
    const resp = await store.dispatch(
      "collections/requestGetCollectionApplyToStudent",
      studentId
    );

    return resp;
  };

  //post
  const requestPostCollectionStudent = async (params) => {
    const resp = await store.dispatch(
      "collections/requestPostCollectionStudent",
      params
    );

    return resp;
  };

  const requestPostCollection = async (data) => {
    const resp = await store.dispatch(
      "collections/requestPostCollection",
      data
    );

    return resp;
  };

  const requestPostCollectionStudents = async ({ data }) => {
    const resp = await store.dispatch(
      "collections/requestPostCollectionStudents",
      { data }
    );
    return resp;
  };

  const putCollection = async ({ id, data }) => {
    const resp = await store.dispatch("collections/putCollection", {
      id,
      data,
    });

    return resp;
  };

  const putCollectionStudent = async ({ id, data }) => {
    const resp = await store.dispatch("collections/putCollectionStudent", {
      id,
      data,
    });

    return resp;
  };

  const requestGetStudentBalance = async (studentId) => {
    const resp = await store.dispatch(
      "collections/requestGetStudentBalance",
      studentId
    );

    return resp;
  };

  const studentBalance = computed(
    () => store.getters["collections/getStudentBalance"]
  );

  //helpers
  const collectionId = (id) => {
    if (!id) return;
    return id.substring(0, 8);
  };

  //SETTERS
  const setCollectionsByStudent = (val) => {
    store.commit("collections/setCollectionsByStudent", val);
  };

  return {
    assignedCollections,
    collectionId,
    collectionsList,
    collectionsByStudent,
    collectionsOwedByStudent,
    collectionTypes,
    isLoadingAssignedCollections,
    isLoadingCollections,
    isLoadingCollectionList,
    isLoadingCollectionsByStudent,
    isLoadingCollectionsOwedByStudent,
    putCollection,
    putCollectionStudent,
    requestGetAssignedCollections,
    requestGetCollectionsList,
    requestGetCollections,
    requestGetCollectionsByStudent,
    requestGetCollectionsOwedByStudent,
    requestGetCollectionTypes,
    isLoadingCollectionTypes,
    requestPostCollection,
    requestPostCollectionStudent,
    requestPostCollectionStudents,
    setCollectionsByStudent,
    requestGetCollectionApplyToStudent,
    requestGetCollectionStatuses,
    collectionStatuses,
    requestGetStudentBalance,
    studentBalance,
    collections,

    requestChargeFrequency,
    chargesFrequency,
  };
}
