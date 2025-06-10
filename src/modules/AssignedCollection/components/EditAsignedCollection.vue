<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header> Editar cobro </template>
    <template #body>
      <el-form
        ref="formRef"
        v-loading="lockModal"
        label-position="top"
        :model="formModel"
        :rules="rules"
      >
        <div class="row">
          <div class="col-md-6">
            <el-form-item label="Estudiante" prop="studentName">
              <el-input
                v-model="formModel.studentName"
                placeholder="Estudiante"
                filterable
                disabled
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Cobro" prop="collectionName">
              <el-input
                v-model="formModel.collectionName"
                type="text"
                disabled
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Monto inicial" prop="collectionInitAmount">
              <el-input
                v-model="formModel.collectionInitAmount"
                type="number"
                placeholder="Monto Inicial"
                disabled
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item
              label="Monto Abonado"
              prop="collectionStudentAmountPaid"
            >
              <el-input
                v-model="formModel.collectionStudentAmountPaid"
                type="number"
                placeholder="Monto Abonado"
                disabled
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Nuevo monto" prop="collectionNewAmount">
              <el-input
                v-model="formModel.collectionNewAmount"
                type="number"
                placeholder="Nuevo monto"
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Fecha" prop="collectionStudentDate">
              <el-date-picker
                v-model="formModel.collectionStudentDate"
                placeholder="Fecha"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <div class="col-md-12">
            <el-form-item label="Descripcion" prop="collectionDescription">
              <el-input
                v-model="formModel.collectionDescription"
                placeholder="Descripcion"
                type="textarea"
                rows="2"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
    <template #footer>
      <argon-button variant="outline" @click="onHideModal">
        Cancelar
      </argon-button>

      <argon-button :loading="lockModal" @click="onSubmit">
        Editar
      </argon-button>
    </template>
  </modal>
</template>

<script>
import { ref, watch } from "vue";
import { useCollections, useAuth } from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import collectionsAcademic from "@/constants/collectionsAcademic";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    Modal,
    ArgonButton,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    rowSelected: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["hide-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances
    const { userIsAcademic } = useAuth();

    const { putCollectionStudent } = useCollections();

    //refs
    const lockModal = ref(false);
    const collectionsToStudent = ref([]);
    const formRef = ref(null);
    const formModel = ref({
      studentName: "",
      collectionName: "",

      collectionStudentDate: "",
      collectionInitAmount: "",
      collectionNewAmount: "",
      collectionStudentAmountPaid: "",
      collectionDescription: "",
    });

    const rules = ref({
      studentName: [{ required: true, message: requiredMessage }],
      collectionNewAmount: [{ required: true, message: requiredMessage }],
      collectionStudentDate: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hide-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();
      collectionsToStudent.value = [];
      lockModal.value = false;
    };

    const onSubmit = async () => {
      //validate if the new original_amount is less than the collectionStudentAmountPaid, if it is, show an dialog to confirm

      if (
        formModel.value.collectionNewAmount <
        formModel.value.collectionStudentAmountPaid
      ) {
        let messageConfirm =
          "El monto nuevo es menor al monto abonado, ¿Desea continuar?";

        const difference = (
          formModel.value.collectionStudentAmountPaid -
          formModel.value.collectionNewAmount
        ).toFixed(2);

        if (difference > 0) {
          messageConfirm = `La diferencia de ${difference}, será saldo a favor del estudiante, ¿Desea continuar?`;
        }

        ElMessageBox.confirm(messageConfirm).then(() => {
          submitForm();
        });
      } else {
        submitForm();
      }
    };

    const submitForm = async () => {
      lockModal.value = true;
      const data = {
        original_amount: +formModel.value.collectionNewAmount,
        due_date: formModel.value.collectionStudentDate,
        description: formModel.value.collectionDescription,
      };

      const response = await putCollectionStudent({
        id: props.rowSelected.charge_id,
        data,
      });

      if (response) {
        ElMessage.success("Cobro editado correctamente");
        onClearData();
        emit("accept-modal");
      } else {
        ElMessage.error("Error al editar el cobro");
      }
    };

    //watchers
    watch(
      () => props.rowSelected,
      (row) => {
        if (row) {
          lockModal.value = true;
          formModel.value.studentName = `${row.students.first_name} ${row.students.last_name}`;
          formModel.value.collectionName = row.charge_types.name;
          formModel.value.collectionStudentAmountPaid = row.totalAmountPaid;
          formModel.value.collectionInitAmount = row.current_amount;
          formModel.value.collectionStudentDate = row.due_date;
          formModel.value.collectionDescription = row.description;
          lockModal.value = false;
        }
      }
    );

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,

      collectionsToStudent,
      userIsAcademic,
      collectionsAcademic,
    };
  },
};
</script>

<style></style>
