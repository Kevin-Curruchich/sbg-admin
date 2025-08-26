<template>
  <div v-loading="isLoadingStudent" class="p-4 container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-lg-flex">
          <div>
            <argon-button variant="outline" color="black" @click="onBack">
              <i class="fas fa-arrow-left"></i>
            </argon-button>
          </div>
          <div class="my-auto mx-auto">
            <span class="fs-4">{{ student.studentFullName }}</span>
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <el-tag
              :type="
                getStudentStatusColor(
                  student.student_statuses?.student_status_id
                )
              "
            >
              <span class="text-muted fs-6">
                {{ student.student_statuses?.name }}
              </span>
            </el-tag>
            <el-popconfirm title="Cambiar estado" @confirm="onChangeStatus">
              <template #reference>
                <el-button variant="outline" size="small" icon>
                  <i class="fas fa-sync-alt"></i>
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>

    <el-tabs type="border-card" stretch>
      <el-tab-pane lazy>
        <template #label>
          <i class="fas fa-money-bill-wave-alt m-2"></i> Historial de Aportes
        </template>
        <StudentCollectionHistory />
      </el-tab-pane>
      <el-tab-pane lazy>
        <template #label>
          Historial academico

          <i class="fas fa-graduation-cap m-2"></i>
        </template>

        <student-academic-information :student-id="props.id" />
      </el-tab-pane>
      <el-tab-pane lazy>
        <template #label>
          <i class="fas fa-address-card m-2"></i> Información
        </template>
        <StudentInformation :student-id="props.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStudent, useAuth } from "@/composables";
import StudentCollectionHistory from "../components/StudentCollectionHistory.vue";
import StudentInformation from "../components/StudentInformation.vue";
import { getStudentStatusColor } from "../../../helpers/student-status";
import StudentAcademicInformation from "../components/StudentAcademicInformation.vue";

export default {
  components: {
    StudentCollectionHistory,
    StudentInformation,
    StudentAcademicInformation,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    //instances
    const router = useRouter();
    const { student, requestGetStudentById, isLoadingStudent, onChangeStatus } =
      useStudent();
    const { userIsAdmin, userIsAcademic } = useAuth();

    const onBack = () => {
      router.push({ name: "List of Students" });
    };

    //lifecycle
    onMounted(() => {
      requestGetStudentById(props.id);
    });

    return {
      onBack,
      student,
      isLoadingStudent,
      userIsAdmin,
      userIsAcademic,
      props,
      getStudentStatusColor,
      onChangeStatus,
    };
  },
};
</script>
