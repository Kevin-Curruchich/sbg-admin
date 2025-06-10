import { studentStatus } from "@/constants/studentStatus";
import studentType from "@/constants/studentType";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default function useStudents() {
  //instances
  const store = useStore();

  //computed
  const students = computed(() => store.getters["students/getStudents"]);
  const studentsList = computed(
    () => store.getters["students/getStudentsList"]
  );
  const isLoadingStudents = computed(
    () => store.getters["students/getIsLoadingStudents"]
  );
  const studentTypes = computed(
    () => store.getters["students/getStudentTypes"]
  );

  const studentTypesTotal = ref(studentTypes.value.length);
  const isLoadingStudentTypes = computed(
    () => store.getters["students/getIsLoadingStudentTypes"]
  );
  const studentStatuses = computed(
    () => store.getters["students/getStudentStatuses"]
  );

  const studentsListWithFilters = computed(
    () => store.getters["students/getStudentListFiltered"]
  );

  const isLoadingStudentByStudentTypeId = computed(
    () => store.getters["students/getIsLoadingStudentByStudentTypeId"]
  );

  //methods
  const requestGetStudents = async (params = { page: 1, take: 10 }) => {
    await store.dispatch("students/requestGetStudents", params);
  };

  const requestGetStudentsList = async (params = {}) => {
    await store.dispatch("students/requestGetStudentsList", params);
  };

  const requestGetStudentStatuses = async () => {
    await store.dispatch("students/requestGetStudentStatuses");
  };

  const requestGetStudentTypes = async () => {
    await store.dispatch("students/requestGetStudentTypes");
  };

  const requestGetProgramLevels = async (programId) => {
    if (!programId) {
      return;
    }

    const resp = await store.dispatch(
      "students/requestGetProgramLevels",
      programId
    );
    return resp;
  };

  const requestGetPrograms = async () => {
    await store.dispatch("students/requestGetPrograms");
  };

  //post request
  const requestPostStudent = async (student) => {
    const resp = await store.dispatch("students/requestPostStudent", student);
    return resp;
  };

  const requestPostStudentType = async (studentType) => {
    const resp = await store.dispatch(
      "students/requestPostStudentType",
      studentType
    );
    return resp;
  };

  const requestGetStudentListFiltered = async (params) => {
    const resp = await store.dispatch(
      "students/requestGetStudentListFiltered",
      {
        params,
      }
    );
    return resp;
  };

  //commits
  const onSetStudentListFiltered = (data = []) => {
    store.commit("students/setStudentsListFiltered", data);
  };

  //helpers
  const getStatusBadge = (status) => {
    let statusId = status;
    let statusReturn = "";
    switch (statusId) {
      case studentStatus.ACTIVE:
        statusReturn = "success";
        break;
      case studentStatus.INACTIVE:
        statusReturn = "danger";
        break;
    }
    return statusReturn;
  };

  const getStudentTypeName = (status) => {
    switch (status) {
      case studentType.INTERNAL:
        return "Interno";
      case studentType.EXTERNAL:
        return "Externo";
      case studentType.MARRIED:
        return "Casado";
    }
  };

  //lifecycle
  onMounted(() => {
    onSetStudentListFiltered();
  });

  return {
    getStatusBadge,
    getStudentTypeName,
    isLoadingStudentByStudentTypeId,
    isLoadingStudents,
    isLoadingStudentTypes,
    onSetStudentListFiltered,
    requestGetStudentListFiltered,
    requestGetStudents,
    requestGetStudentsList,
    requestGetStudentStatuses,
    requestGetProgramLevels,
    requestGetStudentTypes,
    requestPostStudent,
    requestPostStudentType,
    studentsListWithFilters,
    students,
    studentsList,
    studentStatuses,
    studentTypes,
    studentTypesTotal,
    requestGetPrograms,
  };
}
