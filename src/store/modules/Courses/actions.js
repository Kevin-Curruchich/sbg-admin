import sbgApi from "@/apis/sbgApi";

export const requestGetCoursesByProgram = async (_, programId) => {
  try {
    const response = await sbgApi.get(`/courses/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by program:", error);
  }
};
