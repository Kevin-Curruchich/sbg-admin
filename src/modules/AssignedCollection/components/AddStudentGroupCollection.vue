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
            <el-form-item label="Programa" prop="programId">
              <el-select
                v-model="formModel.programId"
                placeholder="Tipo de estudiante"
                filterable
              >
                <el-option
                  v-for="studentType in programs"
                  :key="studentType.program_id"
                  :value="studentType.program_id"
                  :label="studentType.name"
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
                  v-for="chargeType in collectionsList"
                  :key="chargeType.charge_type_id"
                  :value="chargeType.charge_type_id"
                  :label="chargeType.name"
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
              prop="students"
              class="d-flex justify-content-center mt-2 w-100"
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
      <argon-button variant="outline" @click="onHideModal">
        Cancelar
      </argon-button>
      <argon-button :loading="lockModal" @click="onSubmit">
        Agregar
      </argon-button>
    </template>
  </modal>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import {
  useStudents,
  useCollections,
  useFormatDate,
  useGrades,
} from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";

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

    const {
      requestGetStudentListFiltered,
      studentsListWithFilters,
      isLoadingStudentByStudentTypeId,
      onSetStudentListFiltered,
    } = useStudents();

    const {
      collectionsList,
      requestGetCollectionsList,
      requestPostCollectionStudents,
    } = useCollections();

    const { programs, requestGetPrograms } = useGrades();

    const { formatDateYMD } = useFormatDate();

    //computed
    const studentToTransfer = computed(() => {
      return studentsListWithFilters.value.map((student) => ({
        key: student.student_id,
        label: `${student.first_name} ${student.last_name}`,
      }));
    });

    //refs
    const selectedStudents = ref([]);
    const lockModal = ref(false);

    const formRef = ref(null);
    const formModel = ref({
      programId: "",
      collectionId: "",
      collectionStudentDate: "",
      collectionStudentAmountOwed: "",
      collectionDescription: "",
      students: [],
    });

    const rules = ref({
      programId: [{ required: true, message: requiredMessage }],
      collectionId: [{ required: true, message: requiredMessage }],
      collectionStudentAmountOwed: [
        { required: true, message: requiredMessage },
      ],
      collectionStudentDate: [{ required: true, message: requiredMessage }],
      students: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      onSetStudentListFiltered();
      formRef.value.resetFields();
      emit("hide-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();

      lockModal.value = false;
    };

    const onSubmit = async () => {
      const isValid = await formRef.value.validate((isValid) => {
        if (isValid) {
          return true;
        } else {
          return false;
        }
      });

      if (!isValid) {
        return;
      }

      lockModal.value = true;
      formModel.value.collectionStudentDate = formatDateYMD(
        formModel.value.collectionStudentDate
      );
      formModel.value.collectionStudentAmountOwed =
        +formModel.value.collectionStudentAmountOwed;

      const data = {
        student_ids: formModel.value.students,
        charge_type_id: formModel.value.collectionId,
        due_date: formModel.value.collectionStudentDate,
        original_amount: formModel.value.collectionStudentAmountOwed,
        description: formModel.value.collectionDescription,
      };

      requestPostCollectionStudents({ data })
        .then(() => {
          onClearData();
          emit("accept-modal");
        })
        .catch(() => {
          lockModal.value = false;
        });
    };

    //watchers
    watch(
      () => formModel.value.programId,
      async (programId) => {
        if (!programId) return;
        lockModal.value = true;
        formModel.value.collectionId = "";

        formModel.value.collectionStudentAmountOwed = "";

        await requestGetStudentListFiltered({
          program_id: programId,
        });

        await requestGetCollectionsList({
          params: {
            program_id: programId,
          },
        });

        lockModal.value = false;
      }
    );

    watch(
      () => formModel.value.collectionId,
      (collectionId) => {
        if (collectionId) {
          const collectionData = collectionsList.value.find(
            (collection) => collection.charge_type_id === collectionId
          );

          formModel.value.collectionStudentAmountOwed =
            collectionData.default_amount;
        }
      }
    );

    //lifecycle
    onMounted(async () => {
      await Promise.all([requestGetPrograms()]);
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      studentsListWithFilters,
      isLoadingStudentByStudentTypeId,
      studentToTransfer,
      selectedStudents,
      collectionsList,
      programs,
    };
  },
};
</script>
