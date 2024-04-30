<template>
  <modal scrollable :show="show" size="lg" :on-hide-modal="onHideModal">
    <template #header> Asignar cobro grupo de estudiantes </template>
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
            <el-form-item label="Tipo de estudiante" prop="studentTypeId">
              <el-select
                v-model="formModel.studentTypeId"
                placeholder="Tipo de estudiante"
                filterable
              >
                <el-option
                  v-for="student in studentTypes"
                  :key="student.studentTypeId"
                  :value="student.studentTypeId"
                  :label="student.studentTypeName"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Cobro" prop="collectionId">
              <el-select
                v-model="formModel.collectionId"
                placeholder="Cobro"
                filterable
              >
                <el-option
                  v-for="collection in collectionsToStudent"
                  :key="collection.collectionId"
                  :value="collection.collectionId"
                  :label="collection.collectionName"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Monto" prop="collectionStudentAmountOwed">
              <el-input
                v-model="formModel.collectionStudentAmountOwed"
                type="number"
                placeholder="Monto "
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Trimestre" prop="quartetlyQuartetlyId">
              <el-select v-model="formModel.quartetlyQuartetlyId">
                <el-option
                  v-for="quarter in quartersList"
                  :key="quarter.quartetlyId"
                  :value="quarter.quartetlyId"
                  :label="quarter.quartetlyName"
                />
              </el-select>
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

          <div class="col-md-12">
            <el-form-item
              label="Estudiantes"
              prop="students"
              class="d-flex justify-content-center mt-2"
            >
              <el-transfer
                v-model="formModel.students"
                :data="studentToTransfer"
                filterable
                filter-placeholder="Estudiante"
                :titles="['Estudiantes', 'Seleccionados']"
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
import { computed, onMounted, ref, watch } from "vue";
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
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hide-modal", "accept-modal"],
  setup(_, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances
    const { userIsAcademic } = useAuth();
    const {
      requestGetSudentTypes,
      studentTypes,
      requestGetStudentListByStudentTypeId,
      studentByStudentTypeId,
      isLoadingStudentByStudentTypeId,
      onSetStudentByStudentTypeId,
    } = useStudents();
    const {
      collections,
      requestGetCollections,
      requestPostCollectionStudents,
    } = useCollections();
    const { requestGetQuartresList, quartersList } = useQuarters();
    const { formatDateYMD } = useFormatDate();

    //computed
    const studentToTransfer = computed(() => {
      return studentByStudentTypeId.value.data.map((student) => {
        return {
          key: student.studentId,
          label: student.studentFullName,
        };
      });
    });

    //refs
    const selectedStudents = ref([]);
    const lockModal = ref(false);
    const collectionsToStudent = ref([]);
    const formRef = ref(null);
    const formModel = ref({
      studentTypeId: "",
      collectionId: "",
      quartetlyQuartetlyId: "",
      collectionStudentDate: "",
      collectionStudentAmountOwed: "",
      collectionDescription: "",
      students: [],
    });

    const rules = ref({
      studentTypeId: [{ required: true, message: requiredMessage }],
      collectionId: [{ required: true, message: requiredMessage }],
      collectionStudentAmountOwed: [
        { required: true, message: requiredMessage },
      ],
      collectionStudentDate: [{ required: true, message: requiredMessage }],
      quartetlyQuartetlyId: [{ required: true, message: requiredMessage }],
      students: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      onSetStudentByStudentTypeId();
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
          formModel.value.collectionStudentDate = formatDateYMD(
            formModel.value.collectionStudentDate
          );
          formModel.value.collectionStudentAmountOwed =
            +formModel.value.collectionStudentAmountOwed;

          const data = {
            students: formModel.value.students,
            collection: {
              collectionId: formModel.value.collectionId,
              collectionStudentDate: formModel.value.collectionStudentDate,
              collectionStudentAmountOwed:
                formModel.value.collectionStudentAmountOwed,
              collectionDescription: formModel.value.collectionDescription,
              quartetlyQuartetlyId: formModel.value.quartetlyQuartetlyId,
            },
          };

          requestPostCollectionStudents({ data })
            .then(() => {
              onClearData();
              emit("accept-modal");
            })
            .catch(() => {
              lockModal.value = false;
            });
        }
      });
    };

    //watchers
    watch(
      () => formModel.value.studentTypeId,
      async (studentTypeId) => {
        if (!studentTypeId) return;
        lockModal.value = true;
        formModel.value.collectionId = "";

        formModel.value.collectionStudentAmountOwed = "";

        collectionsToStudent.value = collections.value.filter((collection) =>
          collection.collectionStudentApply.find(
            (applyStudent) => applyStudent.studentTypeId === studentTypeId
          )
        );

        await requestGetStudentListByStudentTypeId({
          studentTypeId: studentTypeId,
        });

        lockModal.value = false;
      }
    );

    watch(
      () => formModel.value.collectionId,
      (collectionId) => {
        if (collectionId) {
          const collectionData = collectionsToStudent.value.find(
            (collection) => collection.collectionId === collectionId
          );

          formModel.value.collectionStudentAmountOwed =
            collectionData.collectionBaseAmount;
        }
      }
    );

    //lifecycle
    onMounted(() => {
      requestGetSudentTypes();
      requestGetCollections();
      requestGetQuartresList();
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      studentTypes,
      collectionsToStudent,
      quartersList,
      userIsAcademic,
      collectionsAcademic,
      studentByStudentTypeId,
      isLoadingStudentByStudentTypeId,
      studentToTransfer,
      selectedStudents,
    };
  },
};
</script>

<style></style>
