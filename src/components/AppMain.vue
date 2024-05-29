<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto"
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
              label="Name"
              :rules=[rules.nameRequiredRule]
              variant="outlined"
              required
              clearable
            ></v-text-field>
          </v-col>

          <v-col class="pr-3">
            <AppDatePicker
              v-model="row.startTime"
              :label="'Start time'"
              :rules=[rules.dateFormatRule]
            />
          </v-col>

          <v-col class="pr-3">
            <AppDatePicker
              v-model="row.endTime"
              :label="'End time'"
              :rules=[rules.dateFormatRule] 
            />
          </v-col>
        </v-row>

        <v-row class="optional-elements" >
          <v-col class="d-flex align-center justify-left">
            <v-text-field class="mr-3" style="max-width: 250px; min-width: 250px;"
              v-model="title"
              label="Title"
              :rules=[rules.chartRequiredRule]
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
            >
            </v-text-field>

            <v-text-field class="mr-3" style="max-width: 250px; min-width: 250px;"
              v-model="height"
              label="Height (px)"
              :rules=[rules.chartRequiredRule]
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
            >
            </v-text-field>

            <v-text-field class="mr-3" style="max-width: 250px; min-width: 250px;"
              v-model="width"
              label="Width (px)"
              :rules=[rules.chartRequiredRule]
              variant="outlined"
              hide-details
              required
              clearable
              density="compact"
            >
            </v-text-field>

            <v-col>
              <v-btn :disabled="true" @click="toggleNewRow">{{ showNewRow ? 'Less' : 'More' }} settings</v-btn>
            </v-col>
          </v-col>

          <v-col class="d-flex align-center justify-end">
            <v-btn class="mr-3"
              v-on:click="addRow"
              title="Add row"
              dark
              bottom
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>

            <v-btn class="mr-3"
              :disabled="inputRows.length < 2"
              v-on:click="removeRows"
              title="Remove row"
              dark
              bottom
            >
            <v-icon>mdi-minus-thick</v-icon>
            </v-btn>            
            
            <v-btn class="mr-3"
              :disabled="inputRows.length < 2"
              v-on:click="clearAll"
              title="Clear all"
              dark
              bottom
            >
            <v-icon>mdi-close-thick</v-icon>
            </v-btn>

            <v-btn class="mr-3"
              v-on:click="uploadData"
              title="Upload data"
              dark
              bottom
            >
            <v-icon>mdi-upload</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-show="showNewRow" class="chart-settings">
          <AppChartSettings
            :initial-palette="palette"
            :initial-theme="theme"
            @update:palette="updatePalette"
            @update:theme="updateTheme"
          />
        </v-row>

        <v-row class="generate-button"> 
          <v-col class="d-flex justify-center">
            <v-btn
                :disabled="!allFieldsFilled"
                v-on:click="generateChart"
                title="Generate chart"
                dark
                bottom
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
import AppDatePicker from './AppDatePicker.vue';
import AppChartSettings from './AppChartSettings.vue';

export default {
  components: {
    AppDatePicker,
    AppChartSettings
  },

  setup() {
    // input fields
    const title = ref('Timeline');
    const height = ref('400');
    const width = ref('900');
    const inputRows = ref([
      {
        name: '', startTime: '', endTime: ''
      }
    ]);
    const showNewRow = ref(false);

    const palette = ref('palette3');
    const theme = ref('light');

    const updatePalette = (newPalette) => {
      console.log('Parent received new palette:', newPalette);
      palette.value = newPalette;
    };

    const updateTheme = (newTheme) => {
      console.log('Parent received new theme:', newTheme);
      theme.value = newTheme;
    };
    
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

    // rules
    const rules = {
      nameRequiredRule: value => !!value || 'Name is required',
      dateFormatRule: value => /^(0[1-9]|1[0-2])\.\d{4}$/.test(value) || 'Correct format is MM.YYYY',
      chartRequiredRule: value => !!value || 'Value is required',
    }
    
    const allFieldsFilled = computed(() => {
      return (inputRows.value.every((row) => row.name && row.startTime && row.endTime) && height.value && width.value);
    })

    // methods
    const saveRows = () => saveInputRows(inputRows.value);
    const loadRows = () => loadInputRows(inputRows);
    const generateChart = () => updateChartSeries(inputRows, title, height, width, theme, palette);
    const toggleNewRow = () => showNewRow.value = !showNewRow.value;

    onMounted(loadRows);

    watch(inputRows, () => {
      saveRows();
    }, { deep: true });
    
    return {
      inputRows, title, height, width,
      palette, theme, updatePalette, updateTheme,
      addRow, removeRows, clearAll, uploadData,
      rules, allFieldsFilled,
      showNewRow, toggleNewRow, generateChart,
    }
  },

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

.dp__theme_light {
  --dp-font-family: 'Roboto', sans-serif;
  --dp-text-color: #fff;
  --dp-background-color: #121212;
  --dp-primary-color: #212121;
  --dp-border-color: transparent;
  --dp-action-button-height: 34px;
}

</style>