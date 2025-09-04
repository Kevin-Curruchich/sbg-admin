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
      <el-table-column type="expand" lazy>
        <template #default="{ row }">
          <student-program-levels
            :student-id="studentId"
            :program-id="row.programs.program_id"
            @set-program-selected="
              onSelectProgramToAssignLevel(row.programs.program_id)
            "
            @enroll-courses="
              (student_grade_id) =>
                onEnrollCourses(student_grade_id, row.programs.program_id)
            "
            @show-enrollment="
              (enrollmentId) =>
                onShowEnrollment(enrollmentId, row.programs.program_id)
            "
          />
        </template>
      </el-table-column>
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
  <add-edit-student-program-level
    :show-modal="showModalProgramLevel"
    :student-id="studentId"
    :program-id="programIdToAssignLevel"
    :row-selected="rowSelectedProgramLevel"
    @hide-modal="onHideModalLevel"
    @accept-modal="onAcceptModalLevel"
  />
  <add-edit-student-program-level-enrollment
    :show-modal="showModalProgramLevelEnrollment"
    :student-id="studentId"
    :program-id="programIdToEnrollment"
    :student-grade-id="studentGradeIdToEnrollment"
    :enrollment-id="studentEnrollmentId"
    @hide-modal="onHideModalLevelEnrollment"
    @accept-modal="onAcceptModalLevelEnrollment"
  />
</template>

<script>
import { onMounted, ref } from "vue";
import { useGrades } from "@/composables";
import AddEditStudentProgram from "./AddEditStudentProgram.vue";
import AddEditStudentProgramLevel from "./AddEditStudentProgramLevel.vue";
import StudentProgramLevels from "./StudentProgramLevels.vue";
import AddEditStudentProgramLevelEnrollment from "./AddEditStudentProgramLevelEnrollment.vue";

export default {
  components: {
    AddEditStudentProgram,
    StudentProgramLevels,
    AddEditStudentProgramLevelEnrollment,
    AddEditStudentProgramLevel,
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

    const showModalProgramLevel = ref(false);
    const rowSelectedProgramLevel = ref({});
    const programIdToAssignLevel = ref("");

    const studentGradeIdToEnrollment = ref("");
    const studentEnrollmentId = ref("");
    const showModalProgramLevelEnrollment = ref(false);
    const programIdToEnrollment = ref("");

    //methods
    const onAddProgram = async () => {
      showModal.value = true;
    };

    const onHideModal = () => {
      showModal.value = false;
      rowSelected.value = {};
    };

    function onHideModalLevelEnrollment() {
      showModalProgramLevelEnrollment.value = false;
      studentGradeIdToEnrollment.value = "";
      programIdToAssignLevel.value = "";
      studentEnrollmentId.value = "";
    }

    async function onAcceptModalLevelEnrollment() {
      onHideModalLevelEnrollment();

      await requestGetStudentPrograms(props.studentId);
    }

    function onEnrollCourses(student_grade_id, programId) {
      studentGradeIdToEnrollment.value = student_grade_id;
      programIdToEnrollment.value = programId;
      showModalProgramLevelEnrollment.value = true;
    }

    function onShowEnrollment(enrollmentId, programId) {
      programIdToEnrollment.value = programId;

      studentEnrollmentId.value = enrollmentId;
      showModalProgramLevelEnrollment.value = true;
    }

    function onSelectProgramToAssignLevel(programId) {
      programIdToAssignLevel.value = programId;
      showModalProgramLevel.value = true;
    }

    function onHideModalLevel() {
      showModalProgramLevel.value = false;
      rowSelectedProgramLevel.value = {};
      programIdToAssignLevel.value = "";
    }

    const onAcceptModal = async () => {
      showModal.value = false;
      rowSelected.value = {};
      await requestGetStudentPrograms(props.studentId);
    };

    async function onAcceptModalLevel() {
      await requestGetStudentPrograms(props.studentId);
      onHideModalLevel();
    }

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
      showModalProgramLevel,
      rowSelectedProgramLevel,
      programIdToAssignLevel,
      onHideModalLevel,
      onAcceptModalLevel,
      onSelectProgramToAssignLevel,

      showModalProgramLevelEnrollment,
      studentGradeIdToEnrollment,

      onHideModalLevelEnrollment,
      onAcceptModalLevelEnrollment,
      programIdToEnrollment,
      onEnrollCourses,

      onShowEnrollment,
      studentEnrollmentId,
    };
  },
};
</script>
