<template>
  <div>
    <div class="col-md-6">
      <el-form-item label="Cobro a Abonar" prop="collectionStudentId">
        <el-select
          v-model="formModel.collectionStudentId"
          placeholder="Cobro a Abonar"
          filterable
        >
          <el-option
            v-for="collection in collectionsOwedByStudent"
            :key="collection.charge_id"
            :value="collection.charge_id"
            :label="
              collection.charge_types.name +
              ' | ' +
              collection.totalAmountDue +
              ' | ' +
              collection.due_date_formatted
            "
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>

    <div class="col-md-6">
      <el-form-item label="Descripcion Cobro">
        <el-input
          v-model="collectionStudentDescription"
          type="textarea"
          :disabled="true"
          :min="3"
          placeholder="Descripcion Cobro"
        />
      </el-form-item>
    </div>

    <div class="col-md-6">
      <el-form-item label="Monto Aportar" prop="paymentAmount">
        <el-input
          v-model="formModel.paymentAmount"
          type="number"
          placeholder="Monto aportar"
        />
      </el-form-item>
    </div>

    <div class="col-md-6">
      <el-form-item label="Cobro menos Aporte">
        <el-input
          v-model="collectionStudentLeftToPay"
          :disabled="true"
          type="text"
          placeholder="Recibo"
        />
      </el-form-item>
    </div>
  </div>
</template>
<script></script>
