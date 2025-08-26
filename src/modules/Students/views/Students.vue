<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Estudiantes</h5>
            </div>
            <div class="my-auto mt-4 ms-auto mt-lg-0">
              <div class="my-auto ms-auto">
                <argon-button color="primary" size="lg" @click="onOpenModal">
                  Nuevo
                </argon-button>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-9">
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label"> Buscar </label>
                  <div class="">
                    <el-input
                      v-model="search"
                      clearable
                      type="text"
                      placeholder="Nombre | Apellido | Correo"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label"> Programa </label>
                  <div>
                    <el-select v-model="studentProgramId" filterable clearable>
                      <el-option label="Todos" value=""></el-option>
                      <el-option
                        v-for="item in programs"
                        :key="item.program_id"
                        :value="item.program_id"
                        :label="item.name"
                      />
                    </el-select>
                  </div>
                </div>
                <div class="col-md-2">
                  <label class="form-label"> Estado </label>
                  <div>
                    <el-select v-model="selectedStatus" filterable clearable>
                      <el-option label="Todos" value=""></el-option>
                      <el-option
                        v-for="item in studentStatuses"
                        :key="item.studentStatusId"
                        :value="item.studentStatusId"
                        :label="item.studentStatussName"
                      >
                        {{ item.studentStatussName }}
                      </el-option>
                    </el-select>
                  </div>
                </div>

                <div v-if="false" class="col-md-3">
                  <label class="form-label"> Tipo de estudiante </label>
                  <div>
                    <el-select
                      v-model="selectedStudentType"
                      filterable
                      clearable
                    >
                      <el-option label="Todos" value=""></el-option>
                      <el-option
                        v-for="item in studentTypes"
                        :key="item.student_type_id"
                        :value="item.student_type_id"
                        :label="item.name"
                      />
                    </el-select>
                  </div>
                </div>
                <div v-if="false" class="col-md-4">
                  <label class="form-label"> Nivel </label>
                  <div>
                    <el-select v-model="programLevelId" filterable clearable>
                      <el-option label="Todos" value=""></el-option>
                      <el-option
                        v-for="item in programLevels"
                        :key="item.program_level_id"
                        :value="item.program_level_id"
                        :label="item.name"
                      />
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="h-100 d-flex align-items-center justify-content-end">
                <argon-button
                  class="mx-2"
                  :disabled="isDownloadingStudentsPersonalData"
                  @click="filter"
                  >Filtrar
                  <i class="fas fa-filter"></i>
                </argon-button>
                <argon-button
                  color="secondary"
                  class="mb-0"
                  :onclick="onDownloadReport"
                  :loading="isDownloadingStudentsPersonalData"
                  type="button"
                  name="button"
                  >Descargar
                  <i
                    v-show="!isDownloadingStudentsPersonalData"
                    class="fas fa-download mx-2"
                  ></i>
                </argon-button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table
            v-loading="isLoadingStudents"
            :data="students.data"
            style="width: 100%"
          >
            <el-table-column label="Nombre" min-width="220px">
              <template #default="{ row }">
                <a
                  href="#"
                  class="text-primary"
                  @click="onNavStudent(row.student_id)"
                  >{{ `${row.first_name} ${row.last_name}` }}
                </a>
                <br />
                <span><b>DPI:</b> {{ row.document_id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Contacto" min-width="200px">
              <template #default="{ row }">
                <span><b>Telefono:</b> {{ row.phone_number }}</span>
                <br />
                <span><b>Correo:</b> {{ row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tipo" width="100px">
              <template #default="{ row }">
                {{ row.student_types?.name }}
              </template>
            </el-table-column>
            <el-table-column label="Nivel" min-width="90px">
              <template #default="{ row }">
                {{
                  row?.student_grades.length > 0
                    ? row.student_grades[0].program_levels.name
                    : "Sin Asignar"
                }}
              </template>
            </el-table-column>
            <el-table-column label="Estado" align="center" width="100px">
              <template #default="{ row }">
                <el-tag
                  :type="
                    getStudentStatusColor(
                      row.student_statuses?.student_status_id
                    )
                  "
                >
                  {{ row.student_statuses?.name }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <!-- v-model="params.page" -->
          <el-pagination
            v-model="params.page"
            background
            layout="prev, pager, next"
            :total="students.total"
            :per-page="params.take"
            @current-change="onChangePage"
          />
          <!-- :current-page="params.page" -->
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
  <add-edit-student
    :show-modal="showModal"
    @hidde-modal="hideModal"
    @accept-modal="acceptModal"
  />
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStudents, useReports, useGrades } from "@/composables";
import ArgonButton from "@/components/ArgonButton.vue";
import AddEditStudent from "../components/AddEditStudent.vue";
import { getStudentStatusColor } from "../../../helpers/student-status";

export default {
  name: "Students",
  components: { ArgonButton, AddEditStudent },
  setup() {
    //instances

    const router = useRouter();

    const {
      students,
      studentStatuses,
      studentTypes,
      isLoadingStudents,
      requestGetStudents,
      programLevels,
      requestGetProgramLevels,
      requestGetStudentTypes,
    } = useStudents();

    const {
      isDownloadingStudentsPersonalData,
      requestDownloadStudentsPersonalData,
    } = useReports();

    const { programs, requestGetPrograms } = useGrades();

    //ref
    const showModal = ref(false);
    const selectedStatus = ref("");
    const selectedStudentType = ref("");
    const search = ref("");
    const studentProgramId = ref("");
    const programLevelId = ref("");
    const params = ref({
      page: 1,
      take: 10,
    });

    //params get
    const paramsGetStudents = computed(() => ({
      page: params.value.page,
      take: params.value.take,
      searchTerm: search.value || null,
      student_type_id: selectedStudentType.value || null,
      student_status_id: selectedStatus.value || null,
      program_id: studentProgramId.value || null,
      program_level_id: programLevelId.value || null,
    }));

    //methods
    const onChangePage = async (page) => {
      params.value.page = page;
      await requestGetStudents(paramsGetStudents.value);
    };

    const onDownloadReport = () => {
      requestDownloadStudentsPersonalData().then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_General_Estudiantes.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    };

    const onNavStudent = (id) => {
      router.push({ name: "Student", params: { id } });
    };

    const filter = () => {
      params.value.page = 1;
      requestGetStudents(paramsGetStudents.value);
    };

    const onOpenModal = () => {
      showModal.value = true;
    };

    const hideModal = () => {
      showModal.value = false;
    };

    const acceptModal = () => {
      hideModal();
      requestGetStudents();
    };

    watch(
      studentProgramId,
      async () => {
        if (!studentProgramId.value) {
          return;
        }

        await requestGetProgramLevels(studentProgramId.value);
      },
      {
        immediate: true,
      }
    );

    //lifecycle
    onMounted(() => {
      requestGetPrograms();
      requestGetStudentTypes();
    });

    return {
      acceptModal,
      filter,
      getStudentStatusColor,
      hideModal,
      isLoadingStudents,
      onNavStudent,
      onOpenModal,
      search,
      selectedStatus,
      selectedStudentType,
      showModal,
      students,
      studentStatuses,
      studentTypes,
      programLevels,
      studentProgramId,
      isDownloadingStudentsPersonalData,
      onDownloadReport,
      params,
      onChangePage,
      programs,
      programLevelId,
    };
  },
};
</script>
