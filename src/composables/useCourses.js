// import { computed } from "vue";
import { useStore } from "vuex";

export default function useGrades() {
  //instances
  const store = useStore();

  // Courses By Program
  async function requestGetCoursesByProgram(programId) {
    return await store.dispatch(
      "courses/requestGetCoursesByProgram",
      programId
    );
  }

  return {
    requestGetCoursesByProgram,
  };
}
