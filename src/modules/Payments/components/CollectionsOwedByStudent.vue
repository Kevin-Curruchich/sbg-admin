<template>
  <div class="collections-owed-by-student">
    <div v-show="isLoadingCollectionsOwedByStudent">Loading...</div>
    <div v-show="!isLoadingCollectionsOwedByStudent">
      <div class="mb-2">
        <p class="text-sm text-gray-500">
          Selecciona los cobros pendientes que el estudiante desea abonar.
        </p>

        <el-select v-model="selectCollectionOwed" multiple filterable>
          <el-option
            v-for="collection in collectionsOwedByStudent"
            :key="collection.charge_id"
            :label="`${collection.charge_types.name} (${collection.totalAmountDueFormatted})`"
            :value="collection.charge_id"
          />
        </el-select>
      </div>

      <div v-if="selectCollectionOwed.length > 0" class="w-100">
        <p class="text-sm text-gray-500">
          Agrega el monto que el estudiante desea abonar a cada cobro.
        </p>

        <el-form
          ref="collectionsToPayForm"
          :model="selectedCollectionOwed"
          hide-required-asterisk
        >
          <el-table
            :data="selectedCollectionOwed"
            border
            size="default"
            row-key="studentId"
          >
            <el-table-column label="Cobro" min-width="200">
              <template #default="{ row }">
                {{ row?.charge_types?.name }}
              </template>
            </el-table-column>

            <el-table-column label="Cobro" min-width="100">
              <template #default="{ row }">
                {{ row.totalAmountDueFormatted }}
              </template>
            </el-table-column>
            <el-table-column label="Aporte" min-width="100">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}` + '.paymentAmount'"
                  :rules="rules"
                >
                  <el-input-number
                    v-model="row.paymentAmount"
                    type="number"
                    placeholder="Aporte"
                    :min="0"
                    :max="row.totalAmountDue"
                    :step="1"
                    :precision="2"
                    :style="{ width: '100%' }"
                    @change="
                      $refs.collectionsToPayForm.validateField(
                        `selectedCollectionOwed[${$index}].paymentAmount`
                      )
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="Saldo Pendiente" min-width="100">
              <template #default="{ row }">
                {{ row.totalAmountDue - row.paymentAmount }}
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useCollections } from "@/composables";
import collectionStateConstants from "@/constants/collectionStateConstants";

export default {
  name: "CollectionsOwedByStudent",
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const collectionsToPayForm = ref(null);
    const selectedCollectionOwed = ref([]);
    const selectCollectionOwed = ref([]);

    const rules = ref([
      { required: true, message: "El monto es requerido", trigger: "blur" },
      {
        type: "number",
        min: 0.01,
        message: "El monto debe ser mayor a 0 y menor al cobro",
        trigger: "blur",
      },
    ]);

    const {
      collectionsOwedByStudent,
      requestGetCollectionsOwedByStudent,
      isLoadingCollectionsOwedByStudent,
    } = useCollections();

    const getCollectionsOwedByStudent = async () => {
      requestGetCollectionsOwedByStudent({
        studentId: props.studentId,
        params: {
          charge_status_id: collectionStateConstants.PENDING,
        },
      });
    };

    const onValidate = async () => {
      const isValid = await collectionsToPayForm.value.validate((valid) => {
        if (valid) {
          return true;
        } else {
          return false;
        }
      });

      if (!isValid) {
        return false;
      }

      const totalAmount = selectedCollectionOwed.value.reduce(
        (acc, collection) => acc + collection.paymentAmount,
        0
      );

      if (totalAmount === 0) {
        return false;
      }

      return {
        collectionWithPayments: selectedCollectionOwed.value,
        paymentTotalAmount: totalAmount,
      };
    };

    const onClear = () => {
      if (collectionsToPayForm.value) {
        collectionsToPayForm.value.resetFields();
      }

      selectedCollectionOwed.value = [];
      selectCollectionOwed.value = [];
    };

    watch(
      () => props.studentId,
      (newStudentId, oldValue) => {
        if (newStudentId === oldValue) {
          getCollectionsOwedByStudent();
        } else {
          selectCollectionOwed.value = [];
          selectedCollectionOwed.value = [];
          getCollectionsOwedByStudent();
        }
      },
      { immediate: true }
    );

    watch(selectCollectionOwed, (newValue) => {
      if (newValue.length === 0) {
        selectedCollectionOwed.value = [];
        return;
      }

      selectedCollectionOwed.value = collectionsOwedByStudent.value
        .filter((collection) => newValue.includes(collection.charge_id))
        .map((collection) => ({
          ...collection,
          paymentAmount: 0,
        }));
    });

    return {
      rules,
      isLoadingCollectionsOwedByStudent,
      onValidate,
      onClear,
      selectCollectionOwed,
      collectionsOwedByStudent,
      selectedCollectionOwed,
      collectionsToPayForm,
    };
  },
};
</script>
