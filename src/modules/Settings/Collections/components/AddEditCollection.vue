<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header>
      {{ `${props.rowSelected ? "Editar" : "Crear"} Cobro` }}
    </template>
    <template #body>
      <el-form
        ref="formRef"
        v-loading="sendingRequest"
        label-position="top"
        :model="formModel"
        :rules="rules"
      >
        <div class="row">
          <div class="col-md-6">
            <el-form-item label="Nombre cobro" prop="collectionName">
              <el-input
                v-model="formModel.collectionName"
                type="text"
                placeholder="Nombre cobro"
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Tipo de cobro" prop="collectionTypeId">
              <el-select v-model="formModel.collectionTypeId">
                <el-option
                  v-for="item in collectionTypes"
                  :key="item.collectionTypeId"
                  :value="item.collectionTypeId"
                  :label="item.collectionTypeName"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Monto Base" prop="collectionBaseAmount">
              <el-input
                v-model="formModel.collectionBaseAmount"
                type="number"
                placeholder="Monto Base"
                :min="0"
              />
            </el-form-item>
          </div>
          <div class="col-md-12">
            <el-form-item
              label="Tipo de estudiantes"
              prop="collectionStudentApply"
            >
              <el-select v-model="formModel.collectionStudentApply" multiple>
                <el-option
                  v-for="item in studentTypes"
                  :key="item.studentTypeId"
                  :value="item.studentTypeId"
                  :label="item.studentTypeName"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-12">
            <el-form-item label="Descripcion" prop="collectionDesc">
              <el-input
                v-model="formModel.collectionDesc"
                type="text"
                placeholder="Descripcion"
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
      <argon-button :loading="sendingRequest" @click="onSubmit">
        {{ props.rowSelected ? "Actualizar" : "Agregar" }}
      </argon-button>
    </template>
  </modal>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { ArgonButton, Modal } from "@/components";
import { useStudents, useCollections } from "@/composables";
import errorMessages from "@/constants/formErrorMessages";
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
  emits: ["hidde-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMesage = errorMessages.required;
    //instances
    const { studentTypes, requestGetStudentTypes } = useStudents();
    const {
      collectionTypes,
      requestGetCollectionTypes,
      requestPostCollection,
      putCollection,
    } = useCollections();

    //refs
    const sendingRequest = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      collectionName: "",
      collectionTypeId: "",
      collectionBaseAmount: 0,
      collectionStudentApply: [],
      collectionDesc: "",
    });

    const rules = ref({
      collectionName: [{ required: true, message: requiredMesage }],
      collectionTypeId: [{ required: true, message: requiredMesage }],
      collectionBaseAmount: [{ required: true, message: requiredMesage }],
      collectionStudentApply: [{ required: true, message: requiredMesage }],
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hidde-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();
      sendingRequest.value = false;
    };

    const onSubmit = async () => {
      await formRef.value.validate((isValid) => {
        if (!isValid) return;

        sendingRequest.value = true;

        formModel.value.collectionBaseAmount =
          +formModel.value.collectionBaseAmount;

        formModel.value.collectionStudentApply =
          formModel.value.collectionStudentApply.map((item) => ({
            studentTypeId: item,
          }));

        const data = { ...formModel.value };

        if (props.rowSelected) {
          const id = props.rowSelected.collectionId;

          putCollection({ id, data })
            .then(() => {
              emit("accept-modal");
              onClearData();
            })
            .catch(() => {
              sendingRequest.value = false;
              ElMessage.error("Error al actualizar el cobro");
            });
        } else {
          requestPostCollection(data)
            .then(() => {
              emit("accept-modal");
              onClearData();
            })
            .catch(() => {
              sendingRequest.value = false;
            });
        }
      });
    };

    //watchers
    watch(
      () => props.rowSelected,
      (newValue) => {
        if (newValue) {
          formModel.value = {
            collectionName: newValue.collectionName,
            collectionTypeId: newValue.collectionTypeId,
            collectionBaseAmount: newValue.collectionBaseAmount,
            collectionStudentApply: newValue.collectionStudentApply.map(
              (item) => item.studentTypeId
            ),
            collectionDesc: newValue.collectionDesc,
          };
        }
      },
      { immediate: true }
    );

    //lifecycle
    onMounted(() => {
      requestGetCollectionTypes();
      requestGetStudentTypes();
    });

    return {
      collectionTypes,
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      sendingRequest,
      studentTypes,
      props,
    };
  },
};
</script>

<style></style>
