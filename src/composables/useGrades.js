import { computed } from "vue";
import { useStore } from "vuex";

export default function useGrades() {
  //instances
  const store = useStore();

  //computed

  // PROGRAM LEVELS
  const programLevels = computed(
    () => store.getters["grades/getProgramLevels"]
  );

  const requestGetProgramLevels = async (programId) => {
    if (!programId) {
      return;
    }

    const resp = await store.dispatch(
      "grades/requestGetProgramLevels",
      programId
    );
    return resp;
  };

  // PROGRAMS
  const requestGetPrograms = async () => {
    await store.dispatch("grades/requestGetPrograms");
  };
  const programs = computed(() => store.getters["grades/getPrograms"]);

  //post request
  const requestPostStudentProgram = async ({ studentId, data }) => {
    const resp = await store.dispatch("grades/requestPostStudentProgram", {
      studentId,
      data,
    });
    return resp;
  };

  //PUT STUDENT TYPE
  const requestPutStudentType = async ({ studentId, data }) => {
    const resp = await store.dispatch("students/requestPutStudentType", {
      studentId,
      data,
    });
    return resp;
  };

  // GET STUDENT PROGRAMS FEATURE
  const requestGetStudentPrograms = async (studentId) => {
    const resp = await store.dispatch(
      "grades/requestGetStudentPrograms",
      studentId
    );
    return resp;
  };

  const isLadingStudentPrograms = computed(
    () => store.getters["grades/getIsLadingStudentPrograms"]
  );

  const programsByStudent = computed(
    () => store.getters["grades/getStudentPrograms"]
  );

  return {
    programs,
    programLevels,
    requestGetProgramLevels,
    requestGetPrograms,
    requestPostStudentProgram,
    requestPutStudentType,

    requestGetStudentPrograms,
    isLadingStudentPrograms,
    programsByStudent,
  };
}
