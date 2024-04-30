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
            <el-form-item label="Estudiante" prop="studentId">
              <el-select
                v-model="formModel.studentId"
                placeholder="Estudiante"
                filterable
                disabled
              >
                <el-option
                  v-for="student in studentsList.data"
                  :key="student.studentId"
                  :value="student.studentId"
                  :label="student.studentFullName"
                />
              </el-select>
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
            <el-form-item label="Trimestre" prop="quartetlyName">
              <el-input
                v-model="formModel.quartetlyName"
                type="text"
                disabled
              />
            </el-form-item>
          </div>

          <div class="col-md-6"></div>
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
            <el-form-item label="Abonado" prop="collectionStudentAmountPaid">
              <el-input
                v-model="formModel.collectionStudentAmountPaid"
                type="number"
                placeholder="Abonado"
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
      <argon-button variant="outline" @click="onHideModal"
        >Cancelar</argon-button
      >
      <argon-button :loading="lockModal" @click="onSubmit"
        >Agregar</argon-button
      >
    </template>
  </modal>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useStudents, useCollections, useAuth } from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import collectionsAcademic from "@/constants/collectionsAcademic";
import { ElMessage } from "element-plus";

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
    const requiredMesage = errorMessages.required;
    //instances
    const { userIsAcademic } = useAuth();
    const { requestGetStudentsList, studentsList } = useStudents();
    const { collections, requestGetCollections, putCollectionStudent } =
      useCollections();

    //refs
    const lockModal = ref(false);
    const collectionsToStudent = ref([]);
    const formRef = ref(null);
    const formModel = ref({
      studentId: "",
      collectionName: "",
      quartetlyName: "",
      collectionStudentDate: "",
      collectionInitAmount: "",
      collectionNewAmount: "",
      collectionStudentAmountPaid: "",
      collectionDescription: "",
    });

    const rules = ref({
      studentId: [{ required: true, message: requiredMesage }],
      collectionNewAmount: [
        { required: true, message: requiredMesage },
        {
          validator: (rule, value, callback) => {
            if (value < formModel.value.collectionStudentAmountPaid) {
              callback(
                new Error("El nuevo monto no puede ser menor al aportado")
              );
            } else {
              callback();
            }
          },
        },
      ],
      collectionStudentDate: [{ required: true, message: requiredMesage }],
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
      await formRef.value.validate((isValid) => {
        if (isValid) {
          lockModal.value = true;
          const data = {
            collectionStudentAmountOwed: formModel.value.collectionNewAmount,
            collectionStudentUpdateDate: formModel.value.collectionStudentDate,
            collectionDescription: formModel.value.collectionDescription,
          };

          const id = props.rowSelected.collectionStudentId;

          putCollectionStudent({ data, id })
            .then(() => {
              onClearData();
              emit("accept-modal");
            })
            .catch((error) => {
              lockModal.value = false;
              ElMessage.error({
                message: error.message,
                showClose: true,
              });
            });
        }
      });
    };

    //watchers

    watch(
      () => formModel.value.studentId,
      (studentId) => {
        if (studentId) {
          lockModal.value = true;

          const studentData = studentsList.value.data.find(
            (student) => student.studentId === studentId
          );

          collectionsToStudent.value = collections.value.filter((collection) =>
            collection.collectionStudentApply.find(
              (applyStudent) =>
                applyStudent.studentTypeId === studentData.studentTypeId
            )
          );

          lockModal.value = false;
        }
      }
    );

    watch(
      () => props.rowSelected,
      (row) => {
        if (row) {
          lockModal.value = true;
          formModel.value.studentId = row.childrenStudentId;
          formModel.value.collectionName = row.collection.collectionName;
          formModel.value.quartetlyName = row.Quartetly?.quartetlyName;
          formModel.value.collectionStudentAmountPaid =
            row.collectionStudentAmountPaid;
          formModel.value.collectionInitAmount =
            row.collectionStudentAmountOwed + row.collectionStudentAmountPaid;
          lockModal.value = false;
        }
      }
    );

    //lifecycle
    onMounted(() => {
      requestGetStudentsList();
      requestGetCollections();
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      studentsList,
      collectionsToStudent,
      userIsAcademic,
      collectionsAcademic,
    };
  },
};
</script>

<style></style>
