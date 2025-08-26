<template>
  <div class="px-4">
    <div class="d-flex justify-content-end">
      <argon-button type="primary" size="sm" @click="onAddProgramLevel">
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
      <el-card
        class="mb-4 d-flex justify-content-between align-items-center"
        shadow="none"
      >
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
      </el-card>
    </div>

    <add-edit-student-program-level
      :show-modal="showModal"
      :student-id="studentId"
      :program-id="programId"
      :row-selected="{}"
      @hide-modal="onHideModal"
      @accept-modal="onAcceptModal"
    />
  </div>
</template>
<script>
import useGrades from "@/composables/useGrades";
import { onMounted, ref } from "vue";
import AddEditStudentProgramLevel from "./AddEditStudentProgramLevel.vue";

export default {
  name: "StudentProgramLevels",
  components: { AddEditStudentProgramLevel },
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

  setup(props) {
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
    };
  },
};
</script>
