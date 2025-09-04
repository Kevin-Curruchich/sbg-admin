<template>
  <div>
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center my-4"
    >
      Cargando Matriculas ...
    </div>

    <div v-else-if="enrollments.length === 0" class="text-center my-4">
      <p class="text-gray-500">No hay matriculas para este nivel.</p>
    </div>

    <div v-else>
      <div
        v-for="enrollment in enrollments"
        :key="enrollment.enrollment_id"
        class="mb-4"
      >
        <el-card shadow="never" class="mb-3">
          <div class="">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-1">
                {{ enrollment.term.term_name }}
              </h6>
              <div class="">
                <argon-button
                  size="sm"
                  color="secondary"
                  @click="onEditEnrollment(enrollment.enrollment_id)"
                >
                  Detalles
                </argon-button>
              </div>
            </div>
            <p class="mb-0 text-muted">
              Fecha de matrícula: {{ enrollment.enrollment_date_for }}
            </p>
            <p class="mb-0 text-muted font-italic">
              Descripción: {{ enrollment.description }}
            </p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useGrades } from "@/composables";
import { ElMessage } from "element-plus";

export default {
  name: "StudentGradeEnrollments",
  props: {
    studentGradeId: {
      type: String,
      required: true,
    },
  },
  emits: ["edit-enrollment"],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const enrollments = ref([]);

    const { requestStudentGradeEnrollments } = useGrades();

    const fetchEnrollments = async () => {
      isLoading.value = true;

      try {
        if (props.studentGradeId) {
          const response = await requestStudentGradeEnrollments(
            props.studentGradeId
          );
          enrollments.value = response.map((enrollment) => ({
            ...enrollment,
            enrollment_courses: enrollment.enrollment_courses.map((course) => ({
              ...course,
              course: {
                ...course.course,
                description: course.course.description || "Sin descripción",
              },
            })),
          }));
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        ElMessage.error("Error al cargar las matrículas.");
      } finally {
        isLoading.value = false;
      }
    };

    function onEditEnrollment(enrollmentId) {
      console.log("enrollmentId on StudentGradeEnrollment:", enrollmentId);
      emit("edit-enrollment", enrollmentId);
    }

    onMounted(() => {
      fetchEnrollments();
    });

    return {
      isLoading,
      enrollments,
      onEditEnrollment,
    };
  },
};
</script>

<style scoped>
.list-group-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
