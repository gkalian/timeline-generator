<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      min-width="720"
      max-width="2048"
    >
      <div class="header">
        <div class="text-center text-h5 font-weight-light mb-n1">Input your data</div>
        <br/>
      </div>

        <v-row class="main-input-fields" v-for="(row, index) in inputRows" :key="index" dense>
          <v-col class="pr-3">
            <v-text-field
              v-model="row.name"
              :rules="[rules.required]"
              label="Name"
              variant="outlined"
              required
              clearable
            ></v-text-field>
          </v-col>

          <v-col class="pr-3">
            <VueDatePicker @update:model-value="(v) => updateStartTime(row, v)" month-picker>
              <template #trigger>
                <v-text-field
                  v-model="row.startTime"
                  :rules="[rules.dateFormatRule]"
                  label="Start time"
                  variant="outlined"
                  required
                  clearable
                >
                  <template #append-inner>
                    <v-btn icon variant="plain"><v-icon>mdi-calendar</v-icon></v-btn>
                  </template>
                </v-text-field>
              </template>
            </VueDatePicker>
          </v-col>

          <v-col class="pr-3">
            <VueDatePicker @update:model-value="(v) => updateEndTime(row, v)" month-picker>
              <template #trigger>
                <v-text-field
                  v-model="row.endTime"
                  :rules="[rules.dateFormatRule]"
                  label="End time"
                  variant="outlined"
                  required
                  clearable
                >
                  <template #append-inner>
                      <v-btn icon variant="plain"><v-icon>mdi-calendar</v-icon> </v-btn>
                  </template>
						
                </v-text-field>
              </template>
            </VueDatePicker>
          </v-col>
        </v-row>

        <v-row class="optional-elements" >
          <v-col class="d-flex align-center justify-left">
            <v-text-field
              v-model="title"
              label="Title"
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
              style="max-width: 200px;"
              class="mr-3"
            ></v-text-field>

            <v-text-field
              v-model="height"
              label="Height (px)"
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
              style="max-width: 200px;"
              class="mr-3"
            ></v-text-field>

            <v-text-field
              v-model="width"
              label="Width (px)"
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
              style="max-width: 200px;"
              class="mr-3"
            ></v-text-field>
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <v-btn
              v-on:click="addRow"
              title="Add row"
              dark
              bottom
              class="mr-3"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>

            <v-btn
              :disabled="inputRows.length < 2"
              v-on:click="removeRows"
              title="Remove row"
              dark
              bottom
              class="mr-3"
            >
            <v-icon>mdi-minus-thick</v-icon>
            </v-btn>
            
            
            <v-btn
              :disabled="inputRows.length < 2"
              v-on:click="clearAll"
              title="Clear all"
              dark
              bottom
              class="mr-3"
            >
            <v-icon>mdi-close-thick</v-icon>
            </v-btn>

            
            <v-btn
              v-on:click="uploadData"
              title="Upload data"
              dark
              bottom       
              class="mr-3"            
            >
            <v-icon>mdi-upload</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="generate-button"> 
          <v-col class="d-flex justify-center">
            <v-btn
                v-on:click="updateChartSeries"
                title="Generate chart"
                dark
                bottom
                :disabled="!allFieldsFilled"
              >
                Generate timeline
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="chart">
          <div id="chart"></div>
        </v-row>

      </v-responsive>
  </v-container>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { saveInputRows, loadInputRows, clearInputRows, handleFileSelect } from '../helper/utils.js';
import { loadChart, updateChartSeries, defaultChartOptions } from '../helper/chart.js';

export default {

  setup() {
    // input fields
    const title = ref('Timeline');
    const height = ref('400');
    const width = ref('900');
    const inputRows = ref([
      {
        name: '', startTime: '', endTime: ''
      }
    ])

    loadChart(defaultChartOptions);

    // buttons
    const addRow = () => {
      inputRows.value.push({
        name: '', startTime: '',endTime: ''
      })
    }

    const removeRows = () => {
      if (inputRows.value.length > 1) {
        inputRows.value.pop();
      }
    };

    // clear all
    const clearAll = () => {
      inputRows.value.splice(1);
      inputRows.value[0] = {
        name: '', startTime: '',endTime: ''
      };
        clearInputRows();
    }

    // upload data from file
    function uploadData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = () => handleFileSelect(input, inputRows);
      input.click();
      saveInputRows();
    }

    // datepicker
    function updateStartTime(row, date) {
      row.startTime = toMMYYYY(date);
    }

    function updateEndTime(row, date) {
      row.endTime = toMMYYYY(date);
    }

    function toMMYYYY(date) {
      const month = date.month + 1;
      const monthStr = (month < 10 ? '0' : '') + String(month);
      const year = date.year;
      return `${monthStr}.${year}`;
    }

    // rules
    const rules = {
      required: value => !!value || 'Name is required',
      dateFormatRule: value => /^(0[1-9]|1[0-2])\.\d{4}$/.test(value) || 'Correct format is MM.YYYY',
    }

    const allFieldsFilled = computed(() => {
      return (inputRows.value.every((row) => row.name && row.startTime && row.endTime) && height.value && width.value);
    })

    // local storage
    const saveRows = () => saveInputRows(inputRows.value);
    const loadRows = () => loadInputRows(inputRows);

    onMounted(loadRows);

    watch(inputRows, () => {
      saveRows();
    }, { deep: true });

    return {
      inputRows,
      title,
      height,
      width,
      addRow,
      removeRows,
      clearAll,
      uploadData,
      allFieldsFilled,
      rules,
      updateChartSeries,
      updateStartTime,
      updateEndTime,
    }
  }
}
</script>

<style>
/* horizontal scrollbar is needed */ 
html {
  overflow-x: auto;
}

/* set the chart div to the center */ 
#chart {
  width: 100%;
  height: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>../helper/utils.js