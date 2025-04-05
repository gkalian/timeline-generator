<template>
  <v-row class="main-input-fields" v-for="(row, index) in modelValue" :key="index" dense wrap>
    <v-col cols="12" sm="12" md="4">
      <v-text-field
        v-model="row.name"
        label="Name"
        :rules="[rules.nameRequiredRule]"
        variant="outlined"
        required
        clearable
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="12" md="4">
      <v-text-field
        v-model="row.comment"
        label="Comment"
        variant="outlined"
        clearable
        disabled
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6" md="2">
      <AppDatePicker
        v-model="row.startTime"
        :label="'Start time'"
        :rules="[rules.dateFormatRule]"
        dense
      />
    </v-col>

    <v-col cols="12" sm="6" md="2">
      <AppDatePicker
        v-model="row.endTime"
        :label="'End time'"
        :rules="[rules.dateFormatRule]"
        dense
      />
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from 'vue'
import AppDatePicker from './AppDatePicker.vue'

export default defineComponent({
  name: 'InputFieldsRow',
  
  components: {
    AppDatePicker
  },

  props: {
    modelValue: {
      type: Array,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {

    const rules = {
      nameRequiredRule: value => !!value || 'Name is required',
      dateFormatRule: value => /^(0[1-9]|1[0-2])\.\d{4}$/.test(value) || 'Correct format is MM.YYYY',
      chartRequiredRule: value => !!value || 'Value is required',
    }

    const updateRow = (index, field, value) => {
      const updatedRows = [...props.modelValue]
      updatedRows[index][field] = value
      emit('update:modelValue', updatedRows)
    }

    return {
      rules,
      updateRow
    }
  }
})
</script>
