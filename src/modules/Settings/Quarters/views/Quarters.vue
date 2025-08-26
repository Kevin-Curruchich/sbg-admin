<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Ciclos</h5>
            </div>
            <div class="my-auto mt-4 ms-auto mt-lg-0">
              <div class="my-auto ms-auto">
                <argon-button
                  color="primary"
                  size="lg"
                  @click="showModal = true"
                >
                  Nuevo
                </argon-button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table v-loading="isLoadingQuarters" :data="quarters.data">
            <el-table-column label="Nombre" prop="term_name" />
            <el-table-column label="Fecha Inicio" prop="start_date_formatted" />
            <el-table-column label="Fecha Fin" prop="end_date_formatted" />
            <el-table-column label="Estado">
              <template #default="{ row }">
                <span>{{ row.term_status?.name }}</span>
              </template>
            </el-table-column>
            <el-table-column width="80">
              <template #default="{ row }">
                <el-button size="small" @click="onEditQuarter(row)">
                  <i class="fas fa-edit"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="onChangePage"
          />
        </div>
      </div>
    </div>
  </div>
  <add-edit-quartet
    :show-modal="showModal"
    :row-selected="rowSelected"
    @hidde-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
</template>

<script>
import { onMounted, ref } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { useQuarters, useFormatDate } from "@/composables";
import AddEditQuartet from "../components/AddEditQuartet.vue";

export default {
  name: "Collections",
  components: { ArgonButton, AddEditQuartet },
  setup() {
    const {
      isLoadingQuarters,
      quarters,
      requestGetTerms,
      requestGetTermsStatuses,
    } = useQuarters();

    const { formatDateDMY } = useFormatDate();

    //refs
    const showModal = ref(false);
    const rowSelected = ref(null);

    const onCloseModal = () => {
      showModal.value = false;
      rowSelected.value = null;
    };

    const onAcceptModal = () => {
      showModal.value = false;
      requestGetTerms();
    };

    const onEditQuarter = (row) => {
      rowSelected.value = row;
      showModal.value = true;
    };

    //lifecycle
    onMounted(() => {
      requestGetTerms();
      requestGetTermsStatuses();
    });

    return {
      formatDateDMY,
      isLoadingQuarters,
      onAcceptModal,
      onCloseModal,
      onEditQuarter,
      quarters,
      rowSelected,
      showModal,
    };
  },
};
</script>
