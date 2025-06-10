<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- <div class="card"> -->
        <!-- Card header -->
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Cobros</h5>
            </div>
            <div class="my-auto mt-4 ms-auto mt-lg-0">
              <div class="my-auto ms-auto">
                <argon-button color="primary" size="lg"> Nuevo </argon-button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table v-loading="isLoadingCollections" :data="collectionsPerPage">
            <el-table-column label="Cobro">
              <template #default="{ row }">
                {{ collectionId(row.collectionId) }}
              </template>
            </el-table-column>
            <el-table-column label="Tipo de estudiate">
              <template #default="{ row }">
                {{ row.branch.branchName }}
              </template>
            </el-table-column>
            <el-table-column label="Tipo de cobro">
              <template #default="{ row }">
                {{ row.branch.branchName }}
              </template>
            </el-table-column>
            <el-table-column label="Monto base">
              <template #default="{ row }">
                {{ formatDateDMY(row.collectionStartDate) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size=""
          />
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import moment from "moment";
import ArgonButton from "@/components/ArgonButton.vue";
import { useCollections, useFormatDate } from "@/composables";

export default {
  name: "Collections",
  components: { ArgonButton },
  setup() {
    const {
      isLoadingCollections,
      onChangePage,
      collectionsPerPage,
      total,
      collectionId,
      getStatusBadge,
    } = useCollections();

    const { formatDateDMY, formatDateDMYH } = useFormatDate();

    const pagination = reactive({
      page: 1,
      take: 10,
    });

    onMounted(() => {});

    return {
      collectionsPerPage,
      isLoadingCollections,
      moment,
      total,
      onChangePage,
      collectionId,
      formatDateDMY,
      formatDateDMYH,
      getStatusBadge,
      pagination,
    };
  },
};
</script>
