<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- <div class="card"> -->
        <!-- Card header -->
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
            <div class="col-md-3">
              <label class="form-label"> Buscar </label>
              <div class="">
                <el-input
                  v-model="search"
                  clearable
                  type="text"
                  placeholder="Buscar"
                />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label"> Tipo de estudiante </label>
              <div>
                <el-select v-model="selectedStudentType">
                  <el-option label="Todos" value=""></el-option>
                  <el-option
                    v-for="item in studentTypes"
                    :key="item.studentTypeId"
                    :value="item.studentTypeId"
                    :label="item.studentTypeName"
                  />
                </el-select>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label"> Año </label>
              <div>
                <el-select v-model="studentCurrentYear">
                  <el-option label="Todos" value=""></el-option>
                  <el-option
                    v-for="item in studentYears"
                    :key="item.year"
                    :value="item.year"
                    :label="item.label"
                  />
                </el-select>
              </div>
            </div>
            <!-- <div class="col-md-2">
              <label class="form-label"> Estado </label>
              <div>
                <el-select v-model="selectedStatus">
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
            </div> -->
            <div class="col-md-4">
              <div class="h-100 d-flex align-items-end justify-content-end">
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
            <el-table-column label="Nombre" min-width="200px">
              <template #default="{ row }">
                <a
                  href="#"
                  class="text-primary"
                  @click="onNavStudent(row.studentId)"
                  >{{ `${row.studentName} ${row.studentLastName}` }}
                </a>
                <br />
                <span><b>DPI:</b> {{ row.studentDni }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Contacto" min-width="200px">
              <template #default="{ row }">
                <span><b>Telefono:</b> {{ row.studentPhone }}</span>
                <br />
                <span><b>Correo:</b> {{ row.studentEmail }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tipo de estudiante" min-width="100px">
              <template #default="{ row }">
                {{ row.StudentType?.studentTypeName }}
              </template>
            </el-table-column>
            <el-table-column label="Año" width="80px">
              <template #default="{ row }">
                {{ row?.studentCurrentYear }}
              </template>
            </el-table-column>
            <el-table-column label="Estado" align="center" width="100px">
              <template #default="{ row }">
                <el-tag
                  :type="getStatusBadge(row.studentStatusId)"
                  effect="dark"
                >
                  {{ row.StudentStatus?.studentStatusName }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            v-model="currentPage"
            background
            layout="prev, pager, next"
            :total="students.total"
            @current-change="onChangePage"
          />
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
  <add-edit-student
    :show-modal="showModal"
    @hidde-modal="hiddeModal"
    @accept-modal="acceptModal"
  />
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStudents, useReports } from "@/composables";
import ArgonButton from "@/components/ArgonButton.vue";
import AddEditStudent from "../components/AddEditStudent.vue";

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
      getStatusBadge,
      studentYears,
    } = useStudents();

    const {
      isDownloadingStudentsPersonalData,
      requestDownloadStudentsPersonalData,
    } = useReports();

    //ref
    const showModal = ref(false);
    const selectedStatus = ref("");
    const selectedStudentType = ref("");
    const search = ref("");
    const studentCurrentYear = ref("");
    const currentPage = ref(1);

    //methods
    const onChangePage = (page) => {
      requestGetStudents({
        take: 10,
        page,
        search: search.value,
        studentTypeId: selectedStudentType.value,
        studentStatusId: selectedStatus.value,
        studentCurrentYear: studentCurrentYear.value,
      });
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
      requestGetStudents({
        page: 1,
        take: 10,
        search: search.value,
        studentTypeId: selectedStudentType.value,
        studentStatusId: selectedStatus.value,
        studentCurrentYear: studentCurrentYear.value,
      });
    };

    const onOpenModal = () => {
      showModal.value = true;
    };

    const hiddeModal = () => {
      showModal.value = false;
    };

    const acceptModal = () => {
      hiddeModal();
      requestGetStudents({});
    };

    return {
      acceptModal,
      filter,
      getStatusBadge,
      hiddeModal,
      isLoadingStudents,
      onChangePage,
      onNavStudent,
      onOpenModal,
      search,
      selectedStatus,
      selectedStudentType,
      showModal,
      students,
      studentStatuses,
      studentTypes,
      studentYears,
      studentCurrentYear,
      isDownloadingStudentsPersonalData,
      onDownloadReport,
      currentPage,
    };
  },
};
</script>
