<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header>
      {{ `${props.rowSelected ? "Editar" : "Crear"} Ciclo` }}
    </template>
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
            <el-form-item label="Nombre Trimestre" prop="term_name">
              <el-input
                v-model="formModel.term_name"
                placeholder="I Semestre/Trimestre 2025"
              />
            </el-form-item>
          </div>
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <el-form-item label="Fecha Inicio" prop="start_date">
              <el-date-picker
                v-model="formModel.start_date"
                placeholder="Fecha Inicio"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Fecha Final" prop="end_date">
              <el-date-picker
                v-model="formModel.end_date"
                placeholder="Fecha Final"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div v-if="props.rowSelected" class="col-md-6">
            <el-form-item label="Estado" prop="term_status_id">
              <el-select
                v-model="formModel.term_status_id"
                placeholder="Seleccionar Estado"
              >
                <el-option
                  v-for="status in termsStatuses"
                  :key="status.term_status_id"
                  :label="status.name"
                  :value="status.term_status_id"
                />
              </el-select>
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
        {{ props.rowSelected ? "Editar" : "Agregar" }}
      </argon-button>
    </template>
  </modal>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useQuarters, useFormatDate } from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";

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
  emits: ["hidde-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMessage = errorMessages.required;

    //instances
    const { requestPostTerm, requestPutTerm, termsStatuses } = useQuarters();
    const { formatDateYMD } = useFormatDate();

    //refs
    const lockModal = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      term_name: "",
      start_date: "",
      end_date: "",
      term_status_id: "",
    });

    const rules = ref({
      term_name: [{ required: true, message: requiredMessage }],
      start_date: [{ required: true, message: requiredMessage }],
      end_date: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hidde-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();
      lockModal.value = false;
    };

    const onSubmit = async () => {
      await formRef.value.validate((isValid) => {
        if (!isValid) return;
        lockModal.value = true;

        formModel.value.start_date = formatDateYMD(formModel.value.start_date);
        formModel.value.end_date = formatDateYMD(formModel.value.end_date);

        const data = { ...formModel.value };

        if (props.rowSelected) {
          const id = props.rowSelected.term_id;

          requestPutTerm({ id, data })
            .then(() => {
              onClearData();
              emit("accept-modal");
            })
            .catch(() => {
              lockModal.value = false;
            });
        } else {
          const termData = {
            term_name: data.term_name,
            start_date: data.start_date,
            end_date: data.end_date,
          };

          requestPostTerm(termData)
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
      () => props.rowSelected,
      (value) => {
        if (value) {
          formModel.value.term_name = value.term_name;
          formModel.value.start_date = value.start_date;
          formModel.value.end_date = value.end_date;
          formModel.value.term_status_id = value.term_status_id;
        }
      }
    );

    //lifecycle
    onMounted(() => {});

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      props,
      termsStatuses,
    };
  },
};
</script>
