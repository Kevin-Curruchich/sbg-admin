import { computed } from "vue";
import { useStore } from "vuex";

export default function useStudent() {
  //instances
  const store = useStore();

  //computed
  const student = computed(() => store.getters["students/getStudentById"]);
  const isLoadingStudent = computed(
    () => store.getters["students/getIsLoadingStudent"]
  );

  //methods
  const requestGetStudentById = async (id) => {
    const resp = await store.dispatch("students/requestGetStudentById", id);
    return resp;
  };

  const requestPutStudent = async ({ data, studentId }) => {
    const resp = await store.dispatch("students/requestPutStudent", {
      data,
      studentId,
    });
    return resp;
  };

  //Student academic grade history

  return {
    student,
    isLoadingStudent,
    requestGetStudentById,
    requestPutStudent,
  };
}
