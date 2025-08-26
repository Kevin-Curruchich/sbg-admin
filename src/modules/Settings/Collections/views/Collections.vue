<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Configuración Cobros</h5>
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
          <el-table
            v-loading="isLoadingCollectionTypes"
            :data="collectionTypes.data"
          >
            <el-table-column label="Nombre" prop="name" />
            <el-table-column
              label="Descripcion"
              prop="description"
              min-width="110px"
            />
            <el-table-column label="Programa">
              <template #default="{ row }">
                {{ row?.programs?.name || "N/A" }}
              </template>
            </el-table-column>
            <el-table-column label="Frecuencia">
              <template #default="{ row }">
                {{ row?.frequency?.name || "Todos" }}
              </template>
            </el-table-column>
            <el-table-column label="Monto base">
              <template #default="{ row }">
                {{ `Q. ${row.default_amount || 0}` }}
              </template>
            </el-table-column>
            <el-table-column width="80px">
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
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="onChangePage"
          />
        </div>
      </div>
    </div>
  </div>
  <AddEditCollection
    :show-modal="showModal"
    :row-selected="rowSelected"
    @hidde-modal="onHideModal"
    @accept-modal="onAcceptModal"
  />
</template>

<script>
import { onMounted, ref } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { useCollections, useStudents } from "@/composables";
import AddEditCollection from "../components/AddEditCollection.vue";

export default {
  name: "Collections",
  components: { ArgonButton, AddEditCollection },
  setup() {
    ArgonButton; //instances
    const {
      isLoadingCollectionTypes,
      collectionTypes,
      requestGetCollectionTypes,
    } = useCollections();
    const { getStudentTypeName } = useStudents();

    //refs
    const showModal = ref(false);
    const rowSelected = ref(null);

    //methods
    const onEditCollection = (row) => {
      rowSelected.value = row;
      showModal.value = true;
    };
    const onHideModal = () => {
      showModal.value = false;
      rowSelected.value = null;
    };

    const onAcceptModal = () => {
      showModal.value = false;
      rowSelected.value = null;
      requestGetCollectionTypes();
    };

    //lifecycle
    onMounted(() => {
      requestGetCollectionTypes();
    });

    //returns
    return {
      collectionTypes,
      getStudentTypeName,
      isLoadingCollectionTypes,
      onAcceptModal,
      onEditCollection,
      onHideModal,
      showModal,
      rowSelected,
    };
  },
};
</script>
