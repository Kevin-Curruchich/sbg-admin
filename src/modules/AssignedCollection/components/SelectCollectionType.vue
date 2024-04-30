<template>
  <modal scrollable :show="props.showModal" :on-hide-modal="onHideModal">
    <template #header> Tipo de cobro </template>
    <template #body>
      <div class="d-flex justify-content-center">
        <el-radio-group v-model="isStudentGroupSelected">
          <el-radio label="student" border>Estudiante</el-radio>
          <el-radio label="studentGroup" border>Grupo de Estudiante</el-radio>
        </el-radio-group>
      </div>
    </template>
    <template #footer>
      <argon-button variant="outline" @click="onHideModal">
        Cancelar
      </argon-button>
      <argon-button @click="onSubmit">Siguiente</argon-button>
    </template>
  </modal>
</template>

<script>
import { ref } from "vue";
import { ArgonButton, Modal } from "@/components";

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
    //refs
    const isStudentGroupSelected = ref("student");

    //methods
    const onHideModal = () => {
      isStudentGroupSelected.value = "student";
      emit("hide-modal");
    };

    const onSubmit = async () => {
      emit("accept-modal", { collectionType: isStudentGroupSelected.value });
    };

    return {
      onHideModal,
      onSubmit,
      isStudentGroupSelected,
      props,
    };
  },
};
</script>

<style scoped>
#collectionSelectType {
  justify-content: center;
}
</style>
