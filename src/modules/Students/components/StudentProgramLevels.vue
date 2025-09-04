<template>
  <div class="px-4">
    <div class="d-flex justify-content-end mb-3">
      <argon-button
        type="primary"
        size="sm"
        @click="onSelectProgramToAssignLevel"
      >
        <i class="fas fa-plus"></i>
        Agregar Nivel
      </argon-button>
    </div>

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center my-4"
    >
      Cargando niveles de programa...
    </div>

    <div v-else-if="programLevels.length === 0" class="text-center my-4">
      <p class="text-gray-500">No hay niveles de programa asignados.</p>
    </div>

    <div
      v-for="programLevel in programLevels"
      v-else
      :key="programLevel.student_grade_id"
    >
      <el-card class="mb-4" shadow="none">
        <div class="row">
          <div class="col-6">
            <div class="text-lg font-bold mb-2">
              {{ programLevel.program_levels.name }}
            </div>

            <div class="text-sm text-gray-600">
              {{ programLevel.student_grade_statuses.name }}
            </div>
            <div class="d-flex gap-2">
              <span class="text-sm text-gray-500 mr-2">
                <b>Fecha de Inicio:</b>
                {{ programLevel.start_date_formatted }}
              </span>
              |
              <span class="text-sm text-gray-500">
                <b> Fecha de Fin: </b>
                {{ programLevel.end_date_formatted || "No definida" }}
              </span>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex justify-content-end">
              <argon-button
                size="sm"
                variant="outline"
                color="info"
                @click="onEnrollCourses(programLevel.student_grade_id)"
              >
                Matricular Cursos
              </argon-button>
            </div>
            <div class="col-12 mt-2">
              <StudentGradeEnrollments
                :student-grade-id="programLevel.student_grade_id"
                @edit-enrollment="onShowEnrollment"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import useGrades from "@/composables/useGrades";
import { onMounted, ref } from "vue";
import StudentGradeEnrollments from "./StudentGradeEnrollments.vue";
// import AddEditStudentProgramLevel from "./AddEditStudentProgramLevel.vue";

export default {
  name: "StudentProgramLevels",
  components: { StudentGradeEnrollments },
  props: {
    studentId: {
      type: String,
      required: true,
    },
    programId: {
      type: String,
      required: true,
    },
  },
  emits: ["set-program-selected", "enroll-courses", "show-enrollment"],
  setup(props, { emit }) {
    //instances
    const { requestGetStudentProgramLevels } = useGrades();

    //states
    const isLoading = ref(false);
    const programLevels = ref([]);
    const showModal = ref(false);

    //methods
    const onAddProgramLevel = () => {
      showModal.value = true;
    };

    const onHideModal = () => {
      showModal.value = false;
    };

    const onAcceptModal = async () => {
      showModal.value = false;
      await getAndSetProgramLevels();
    };

    const getAndSetProgramLevels = async () => {
      isLoading.value = true;
      try {
        const response = await requestGetStudentProgramLevels({
          studentId: props.studentId,
          programId: props.programId,
        });

        programLevels.value = response;
      } catch (error) {
        console.error("Error fetching student program levels:", error);
      } finally {
        isLoading.value = false;
      }
    };

    function onSelectProgramToAssignLevel() {
      emit("set-program-selected", props.programId);
    }

    function onEnrollCourses(student_grade_id) {
      emit("enroll-courses", student_grade_id);
    }

    function onShowEnrollment(enrollmentId) {
      emit("show-enrollment", enrollmentId);
    }

    onMounted(async () => {
      await getAndSetProgramLevels();
    });

    return {
      isLoading,
      programLevels,
      showModal,

      onAddProgramLevel,
      onHideModal,
      onAcceptModal,

      onSelectProgramToAssignLevel,
      onEnrollCourses,

      onShowEnrollment,
    };
  },
};
</script>
