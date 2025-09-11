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

  //GET STUDENT PROGRAM LEVELS FEATURE
  const requestGetStudentProgramLevels = async ({ studentId, programId }) => {
    const resp = await store.dispatch("grades/requestGetStudentProgramLevels", {
      studentId,
      programId,
    });
    return resp;
  };

  const requestPostStudentProgramLevel = async ({ studentId, data }) => {
    const resp = await store.dispatch("grades/requestPostStudentProgramLevel", {
      studentId,
      data,
    });
    return resp;
  };

  //Enrollment Details
  const requestStudentGradeEnrollments = async (studentGradeId) => {
    const resp = await store.dispatch(
      "grades/requestStudentGradeEnrollments",
      studentGradeId
    );
    return resp;
  };

  const requestGetEnrollmentDetails = async (enrollmentId) => {
    const resp = await store.dispatch(
      "grades/requestGetEnrollmentDetails",
      enrollmentId
    );
    return resp;
  };

  const requestPostStudentGradeEnrollmentPreview = async (data) => {
    const resp = await store.dispatch(
      "grades/requestPostStudentGradeEnrollmentPreview",
      data
    );
    return resp;
  };

  async function requestPostStudentGradeEnrollment({
    studentId,
    studentGradeId,
    data,
  }) {
    const resp = await store.dispatch(
      "grades/requestPostStudentGradeEnrollment",
      { studentId, studentGradeId, data }
    );
    return resp;
  }

  async function requestPutStudentGradeEnrollment({ enrollmentId, data }) {
    const resp = await store.dispatch(
      "grades/requestPutStudentGradeEnrollment",
      { enrollmentId, data }
    );
    return resp;
  }

  async function requestPostEnrollmentEvidence({ enrollmentId, formData }) {
    const resp = await store.dispatch("grades/requestPostEnrollmentEvidence", {
      enrollmentId,
      data: formData,
    });
    return resp;
  }

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

    requestGetStudentProgramLevels,
    requestPostStudentProgramLevel,

    requestStudentGradeEnrollments,
    requestGetEnrollmentDetails,
    requestPostStudentGradeEnrollmentPreview,
    requestPostStudentGradeEnrollment,
    requestPutStudentGradeEnrollment,

    requestPostEnrollmentEvidence,
  };
}
