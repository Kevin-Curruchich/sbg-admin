<template>
  <el-card shadow="never">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-bold">Programas</span>
        <argon-button type="primary" @click="onAddProgram">
          <i class="fas fa-plus"></i>
        </argon-button>
      </div>
    </template>

    <el-table v-loading="isLadingStudentPrograms" :data="programsByStudent">
      <el-table-column prop="programs.name" label="Programa" />
      <el-table-column prop="student_types.name" label="Tipo de estudiante" />
      <el-table-column prop="student_program_code" label="Carnet" />
    </el-table>

    <add-edit-student-program
      :student-id="studentId"
      :show-modal="showModal"
      :row-selected="rowSelected"
      @hide-modal="onHideModal"
      @accept-modal="onAcceptModal"
    />
  </el-card>
</template>

<script>
import { onMounted, ref } from "vue";
import { useGrades } from "@/composables";
import AddEditStudentProgram from "./AddEditStudentProgram.vue";

export default {
  components: {
    AddEditStudentProgram,
  },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    //instances
    const {
      requestGetStudentPrograms,
      isLadingStudentPrograms,
      programsByStudent,
    } = useGrades();

    const isLoading = ref(false);
    const showModal = ref(false);
    const rowSelected = ref({});

    //methods
    const onAddProgram = async () => {
      showModal.value = true;
    };

    const onHideModal = () => {
      showModal.value = false;
      rowSelected.value = {};
    };

    const onAcceptModal = async () => {
      showModal.value = false;
      rowSelected.value = {};
      await requestGetStudentPrograms(props.studentId);
    };

    //lifecycle
    onMounted(async () => {
      await Promise.all([requestGetStudentPrograms(props.studentId)]);
    });

    return {
      showModal,
      onAddProgram,
      onHideModal,
      isLoading,
      rowSelected,
      isLadingStudentPrograms,
      programsByStudent,

      onAcceptModal,
    };
  },
};
</script>
