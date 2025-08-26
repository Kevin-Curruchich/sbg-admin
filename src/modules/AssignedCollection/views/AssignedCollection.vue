<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Card header -->
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Asignación de Cobros</h5>
            </div>
            <div class="my-auto mt-4 ms-auto mt-lg-0">
              <div class="my-auto ms-auto">
                <argon-button
                  color="primary"
                  size="lg"
                  :disabled="isLoadingAssignedCollections"
                  @click="showModalSelect = true"
                >
                  Nuevo
                </argon-button>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-5">
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

            <div class="col-md-5">
              <label class="form-label"> Mes </label>
              <div>
                <el-date-picker
                  v-model="due_date"
                  type="month"
                  format="MM-YYYY"
                  value-format="YYYY-MM"
                  placeholder="Mes"
                  :clearable="true"
                  class="w-100"
                />
              </div>
            </div>
            <div class="col-md-2">
              <div
                class="h-100 d-flex align-items-end justify-content-between px-2"
              >
                <argon-button
                  :disabled="isLoadingAssignedCollections"
                  @click="onFilter"
                >
                  Filtrar
                  <i class="fas fa-filter"></i>
                </argon-button>
                <!-- <argon-button
                  v-if="userIsAdmin"
                  color="secondary"
                  class="mb-0"
                  :onclick="onDownloadReport"
                  :loading="isDownloadingReportByYear"
                  type="button"
                  name="button"
                  >Descargar
                  <i
                    v-show="!isDownloadingReportByYear"
                    class="fas fa-download mx-2"
                  ></i>
                </argon-button> -->
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table
            v-loading="isLoadingAssignedCollections"
            :data="assignedCollections.data"
            border
            size="default"
            row-key="studentId"
          >
            <el-table-column label="Estudiate" min-width="250">
              <template #default="{ row }">
                {{ row.students?.first_name }} {{ row.students?.last_name }}
              </template>
            </el-table-column>
            <el-table-column label="Cobro" min-width="200">
              <template #default="{ row }">
                {{ row?.charge_types?.name }} -
                {{ row?.due_date_formatted }}
                <br />
                <span class="text-muted">{{
                  row?.charge_types?.description
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Mes" width="100">
              <template #default="{ row }">
                {{ row?.due_date_formatted }}
              </template>
            </el-table-column>
            <el-table-column label="Cobro Actual" min-width="100">
              <template #default="{ row }">
                {{ row.currentAmountFormatted }}
              </template>
            </el-table-column>
            <el-table-column label="Abonado" min-width="100">
              <template #default="{ row }">
                <div class="text-success">
                  {{ row.totalAmountPaidFormatted }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Saldo" min-width="100">
              <template #default="{ row }">
                <div class="text-danger">
                  {{ row.totalAmountDueFormatted }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template #default="{ row }">
                <el-button size="small" @click="onEditCollection(row)">
                  <i class="fas fa-edit"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            v-model:current-page="pagination.page"
            :disabled="isLoadingAssignedCollections"
            :page-size="pagination.take"
            :total="assignedCollections.total"
            background
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>
  </div>

  <SelectCollectionType
    :show="showModalSelect"
    @hide-modal="onCloseModal"
    @accept-modal="onAcceptSelect"
  />

  <AddEditAsignedCollection
    :show="showModal"
    @hide-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
  <EditAsignedCollection
    :show="showModalEdit"
    :row-selected="rowSelected"
    @hide-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
  <AddStudentGroupCollection
    :show="showModalCollectionGroup"
    @hide-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  useCollections,
  useFormatDate,
  useQuarters,
  useReports,
  useAuth,
} from "@/composables";
import ArgonButton from "@/components/ArgonButton.vue";
import AddEditAsignedCollection from "../components/AddEditAsignedCollection.vue";
import EditAsignedCollection from "../components/EditAsignedCollection.vue";
import SelectCollectionType from "../components/SelectCollectionType.vue";
import AddStudentGroupCollection from "../components/AddStudentGroupCollection.vue";

export default {
  name: "Collections",
  components: {
    ArgonButton,
    AddEditAsignedCollection,
    EditAsignedCollection,
    SelectCollectionType,
    AddStudentGroupCollection,
  },
  setup() {
    //instances
    const { userIsAdmin } = useAuth();
    const {
      isLoadingAssignedCollections,
      assignedCollections,
      total,
      collectionId,
      getStatusBadge,
      requestGetAssignedCollections,
    } = useCollections();

    const {
      isDownloadingReportByYear,
      requestDownloadCollectionHistoryByYear,
    } = useReports();

    const { formatDateDMY, formatDateDMYH } = useFormatDate();
    const { quartersList } = useQuarters();

    //refs
    const showModalCollectionGroup = ref(false);
    const showModalSelect = ref(false);
    const showModal = ref(false);
    const showModalEdit = ref(false);
    const search = ref("");
    const due_date = ref("");

    const charge_type_id = ref("");
    const rowSelected = ref(null);
    const pagination = reactive({
      page: 1,
      take: 10,
    });

    //computed
    const queryParams = computed(() => ({
      search_query: search.value || null,
      due_date: due_date.value || null,
      charge_type_id: charge_type_id.value || null,
      page: pagination.page,
      take: pagination.take,
    }));

    //methods
    const onEditCollection = (row) => {
      rowSelected.value = row;
      showModalEdit.value = true;
    };

    const onFilter = () => {
      requestGetAssignedCollections(queryParams.value);
    };

    const onAcceptSelect = (data) => {
      const { collectionType } = data;

      if (collectionType === "student") {
        showModalSelect.value = false;
        showModal.value = true;
      } else {
        showModalSelect.value = false;
        showModalCollectionGroup.value = true;
      }
    };

    const onCloseModal = () => {
      showModalSelect.value = false;
      showModal.value = false;
      showModalEdit.value = false;
      showModalCollectionGroup.value = false;
      rowSelected.value = null;
    };

    const onAcceptModal = () => {
      showModal.value = false;
      showModalEdit.value = false;
      rowSelected.value = null;
      showModalCollectionGroup.value = false;
      requestGetAssignedCollections();
    };

    const onDownloadReport = () => {
      requestDownloadCollectionHistoryByYear({
        search_query: search.value,

        charge_type_id: charge_type_id.value,
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    };

    watch(
      () => pagination.page,
      (newPage) => {
        pagination.page = newPage;
        requestGetAssignedCollections(queryParams.value);
      }
    );

    onMounted(() => {
      requestGetAssignedCollections();
    });

    return {
      assignedCollections,
      collectionId,
      onFilter,
      formatDateDMY,
      formatDateDMYH,
      getStatusBadge,
      isLoadingAssignedCollections,
      onAcceptModal,
      onCloseModal,
      quartersList,
      charge_type_id,
      search,
      showModal,
      due_date,

      total,
      onDownloadReport,
      isDownloadingReportByYear,
      onEditCollection,
      showModalEdit,
      rowSelected,
      userIsAdmin,
      showModalSelect,
      onAcceptSelect,
      showModalCollectionGroup,
      pagination,
    };
  },
};
</script>
