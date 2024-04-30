import { computed } from "vue";
import { useStore } from "vuex";

export default function useCollection() {
  const store = useStore();

  //   computed
  const collections = computed(
    () => store.getters["collections/getCollections"]
  );
  const isLoadingCollections = computed(
    () => store.getters["collections/getIsLoadingCollections"]
  );

  const collectionTypes = computed(
    () => store.getters["collections/getCollectionTypes"]
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
  const requestGetCollections = async () => {
    await store.dispatch("collections/requestGetCollections");
  };

  const requestGetCollectionTypes = async () => {
    await store.dispatch("collections/requestGetCollectionTypes");
  };

  const requestGetAssignedCollections = async (
    params = {
      page: 1,
      take: 10,
      searchQuery: "",
      currentYear: "",
    }
  ) => {
    const resp = await store.dispatch(
      "collections/requestGetAssignedCollections",
      params
    );

    return resp;
  };

  const requestGetCollectionsOwedByStudent = async (studentId) => {
    const resp = await store.dispatch(
      "collections/requestGetCollectionsOwedByStudent",
      studentId
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

  //helpers

  const collectionId = (id) => {
    if (!id) return;
    return id.substring(0, 8);
  };

  return {
    assignedCollections,
    collectionId,
    collections,
    collectionsByStudent,
    collectionsOwedByStudent,
    collectionTypes,
    isLoadingAssignedCollections,
    isLoadingCollections,
    isLoadingCollectionsByStudent,
    isLoadingCollectionsOwedByStudent,
    putCollection,
    putCollectionStudent,
    requestGetAssignedCollections,
    requestGetCollections,
    requestGetCollectionsByStudent,
    requestGetCollectionsOwedByStudent,
    requestGetCollectionTypes,
    requestPostCollection,
    requestPostCollectionStudent,
    requestPostCollectionStudents,
  };
}
