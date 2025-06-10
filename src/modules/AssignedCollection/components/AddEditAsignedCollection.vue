<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header> Asignar cobro </template>
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
            <el-form-item label="Estudiante" prop="student_id">
              <el-select
                v-model="formModel.student_id"
                placeholder="Estudiante"
                filterable
              >
                <el-option
                  v-for="student in studentsList"
                  :key="student.student_id"
                  :value="student.student_id"
                  :label="student.first_name + ' ' + student.last_name"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Cobro" prop="charge_type_id">
              <el-select
                v-model="formModel.charge_type_id"
                placeholder="Cobro"
                filterable
              >
                <el-option
                  v-for="collection in collectionsToStudent"
                  :key="collection.charge_type_id"
                  :value="collection.charge_type_id"
                  :label="collection.name"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Monto" prop="original_amount">
              <el-input
                v-model="formModel.original_amount"
                type="number"
                placeholder="Monto "
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Fecha" prop="due_date">
              <el-date-picker
                v-model="formModel.due_date"
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
      <argon-button :disabled="lockModal" @click="onSubmit"
        >Agregar</argon-button
      >
    </template>
  </modal>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import {
  useStudents,
  useCollections,
  useFormatDate,
  useQuarters,
  useAuth,
} from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import collectionsAcademic from "@/constants/collectionsAcademic";

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
  },
  emits: ["hide-modal", "accept-modal"],
  setup(_, { emit }) {
    const requiredMesage = errorMessages.required;
    //instances
    const { userIsAcademic } = useAuth();
    const { requestGetStudentsList, studentsList, programs } = useStudents();
    const { requestPostCollectionStudent, requestGetCollectionApplyToStudent } =
      useCollections();
    const { quartersList } = useQuarters();

    const { formatDateYMD } = useFormatDate();

    //refs
    const lockModal = ref(false);
    const collectionsToStudent = ref([]);
    const formRef = ref(null);
    const formModel = reactive({
      student_id: "",
      charge_type_id: "",
      due_date: "",
      original_amount: "",
      collectionDescription: "",
    });

    const rules = ref({
      student_id: [{ required: true, message: requiredMesage }],
      charge_type_id: [{ required: true, message: requiredMesage }],
      original_amount: [{ required: true, message: requiredMesage }],
      due_date: [{ required: true, message: requiredMesage }],
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
        if (!isValid) return;

        lockModal.value = true;

        const data = {
          student_id: formModel.student_id,
          charge_type_id: formModel.charge_type_id,
          original_amount: +formModel.original_amount,
          due_date: formatDateYMD(formModel.due_date),
          description: formModel.collectionDescription || null,
        };

        requestPostCollectionStudent(data)
          .then(() => {
            onClearData();
            emit("accept-modal");
          })
          .catch(() => {
            lockModal.value = false;
          });
      });
    };

    //watcherss
    watch(
      () => formModel.student_id,
      async (studentId) => {
        if (!studentId) return;
        lockModal.value = true;

        const collections = await requestGetCollectionApplyToStudent(studentId);
        formModel.charge_type_id = "";

        collectionsToStudent.value = collections;

        lockModal.value = false;
      }
    );

    watch(
      () => formModel.charge_type_id,
      (collectionId) => {
        if (collectionId) {
          formModel.original_amount =
            collectionsToStudent.value.find(
              (collection) => collection.charge_type_id === collectionId
            ).default_amount || 0;
        }
      }
    );

    //lifecycle
    onMounted(() => {
      requestGetStudentsList();
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
      quartersList,
      userIsAcademic,
      collectionsAcademic,
      programs,
    };
  },
};
</script>
<style></style>
