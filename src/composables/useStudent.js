import { computed } from "vue";
import { useStore } from "vuex";
import { studentStatus } from "../constants/studentStatus";

export default function useStudent() {
  //instances
  const store = useStore();

  //computed
  const student = computed(() => store.getters["students/getStudentById"]);
  const isStudentActive = computed(
    () =>
      store.getters["students/getStudentById"].student_status_id ===
      studentStatus.ACTIVE
  );
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

  const onChangeStatus = async () => {
    if (isStudentActive.value) {
      await store.dispatch(
        "students/requestInactivateStudent",
        student.value.student_id
      );
    } else {
      await store.dispatch(
        "students/requestActivateStudent",
        student.value.student_id
      );
    }

    await requestGetStudentById(student.value.student_id);
  };

  return {
    student,
    isLoadingStudent,
    requestGetStudentById,
    requestPutStudent,
    onChangeStatus,
  };
}
