<template>
  <v-container>
    <v-responsive class="align-center mx-auto"
      min-width="320"
      max-width="2048"
    >
      <div class="header">
        <div class="text-center text-h5 font-weight-light mb-n1">Input your data</div>
        <br/>
      </div>

        <v-row class="main-input-fields" v-for="(row, index) in inputRows" :key="index" dense wrap>
          <v-col cols="12" sm="12" md="4" class="pr-md-3">
            <v-text-field
              v-model="row.name"
              label="Name"
              :rules=[rules.nameRequiredRule]
              variant="outlined"
              required
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4" class="pr-md-3">
            <AppDatePicker
              v-model="row.startTime"
              :label="'Start time'"
              :rules=[rules.dateFormatRule]
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" class="pr-md-3">
            <AppDatePicker
              v-model="row.endTime"
              :label="'End time'"
              :rules=[rules.dateFormatRule]
            />
          </v-col>
        </v-row>

        <v-row class="optional-elements" wrap>
          <v-col cols="12" md="7" class="d-flex flex-wrap align-center justify-start">
            <v-text-field class="mr-3 mb-3 title-field"
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

            <v-text-field class="mr-3 mb-3 dimension-field"
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

            <v-text-field class="mr-3 mb-3 dimension-field"
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

            <v-btn class="mb-3" :disabled="true" @click="toggleNewRow">{{ showNewRow ? 'Less' : 'More' }} settings</v-btn>
          </v-col>

          <v-col cols="12" md="5" class="d-flex flex-wrap align-center justify-start justify-md-end">
            <v-btn class="mr-3 mb-3"
              v-on:click="addRow"
              title="Add row"
              dark
              bottom
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>

            <v-btn class="mr-3 mb-3"
              :disabled="inputRows.length < 2"
              v-on:click="removeRows"
              title="Remove row"
              dark
              bottom
            >
            <v-icon>mdi-minus-thick</v-icon>
            </v-btn>

            <v-btn class="mr-3 mb-3"
              :disabled="inputRows.length < 2"
              v-on:click="clearAll"
              title="Clear all"
              dark
              bottom
            >
            <v-icon>mdi-close-thick</v-icon>
            </v-btn>

            <v-btn class="mr-3 mb-3"
              v-on:click="uploadData"
              title="Upload data"
              dark
              bottom
            >
            <v-icon>mdi-upload</v-icon>
            </v-btn>

            <v-btn class="mr-3 mb-3"
              v-on:click="downloadData"
              title="Download data"
              dark
              bottom
            >
            <v-icon>mdi-download</v-icon>
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

        <v-row class="chart-container">
          <v-col cols="12" class="chart-wrapper">
            <div id="chart" class="chart-element"></div>
          </v-col>
        </v-row>

      </v-responsive>
  </v-container>
</template>

<script>
/**
 * @file AppMain.vue
 * @description Main component that handles timeline data input, visualization and management
 */
import { ref, computed, watch, onMounted } from 'vue'
import { saveInputRows, loadInputRows, saveChartSettings, clearInputRows, handleFileLoad, clearChartSettings } from '../helper/utils.js';
import { loadChart, updateChartSeries } from '../helper/chart.js';
import AppDatePicker from './AppDatePicker.vue';
import AppChartSettings from './AppChartSettings.vue';

export default {
  components: {
    AppDatePicker,
    AppChartSettings
  },

  setup() {
    /**
     * @description Load saved chart settings from localStorage
     * @type {Object}
     */
    const chartSettings = loadChartSettings();
    
    /**
     * @description Chart title reactive reference
     * @type {import('vue').Ref<string>}
     */
    const title = ref(chartSettings.title);
    
    /**
     * @description Chart height reactive reference
     * @type {import('vue').Ref<string>}
     */
    const height = ref(chartSettings.height);
    
    /**
     * @description Chart width reactive reference
     * @type {import('vue').Ref<string>}
     */
    const width = ref(chartSettings.width);

    /**
     * @description Array of input rows for timeline data
     * @type {import('vue').Ref<Array<{name: string, startTime: string, endTime: string}>>}
     */
    const inputRows = ref([
      {
        name: '', startTime: '', endTime: ''
      }
    ]);
    
    /**
     * @description Controls visibility of additional chart settings
     * @type {import('vue').Ref<boolean>}
     */
    const showNewRow = ref(false);

    /**
     * @description Selected color palette for the chart
     * @type {import('vue').Ref<string>}
     */
    const palette = ref('palette3');
    
    /**
     * @description Selected theme (light/dark) for the chart
     * @type {import('vue').Ref<string>}
     */
    const theme = ref('light');

    /**
     * @description Updates the chart palette
     * @param {string} newPalette - New palette value
     * @returns {void}
     */
    const updatePalette = (newPalette) => {
      console.log('Parent received new palette:', newPalette);
      palette.value = newPalette;
    };

    /**
     * @description Updates the chart theme
     * @param {string} newTheme - New theme value (light/dark)
     * @returns {void}
     */
    const updateTheme = (newTheme) => {
      console.log('Parent received new theme:', newTheme);
      theme.value = newTheme;
    };

    loadChart();

    // buttons
    /**
     * @description Adds a new empty row to the input data
     * @returns {void}
     */
    const addRow = () => {
      inputRows.value.push({
        name: '', startTime: '',endTime: ''
      })
    }

    /**
     * @description Removes the last row from the input data
     * @returns {void}
     */
    const removeRows = () => {
      if (inputRows.value.length > 1) {
        inputRows.value.pop();
      }
    };

    /**
     * @description Clears all input data and resets to default values
     * @returns {void}
     */
    const clearAll = () => {
      inputRows.value.splice(1);
      inputRows.value[0] = {
        name: '', startTime: '',endTime: ''
      };

      title.value = 'Timeline';
      height.value = '400';
      width.value = '900';

      clearInputRows();
      clearChartSettings();
    }

    /**
     * @description Handles uploading data from a CSV file
     * @returns {void}
     */
    function uploadData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = handleFileLoad(event, inputRows);

            if (result) {
              title.value = result.chartTitle || 'Timeline';
              height.value = result.chartHeight || '400';
              width.value = result.chartWidth || '900';
              inputRows.value = result.rows;
              saveChartSettings(title.value, height.value, width.value);
              saveRows();
            }
            saveRows();
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }

    /**
     * @description Exports current data to a CSV file and triggers download
     * @returns {void}
     */
    function downloadData() {
      const metadataRow = [title.value, height.value, width.value].join(',');

      const dataRows = inputRows.value.map(row => {
        return [
          row.name,
          row.startTime,
          row.endTime
        ].join(',');
      }).join('\n');

      const csvContent = metadataRow + '\n' + dataRows;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `${title.value || 'timeline'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /**
     * @description Validation rules for form fields
     * @type {Object}
     */
    const rules = {
      nameRequiredRule: value => !!value || 'Name is required',
      dateFormatRule: value => /^(0[1-9]|1[0-2])\.\d{4}$/.test(value) || 'Correct format is MM.YYYY',
      chartRequiredRule: value => !!value || 'Value is required',
    }

    /**
     * @description Computed property that checks if all required fields are filled
     * @type {import('vue').ComputedRef<boolean>}
     */
    const allFieldsFilled = computed(() => {
      return (inputRows.value.every((row) => row.name && row.startTime && row.endTime) && height.value && width.value);
    })

    /**
     * @description Loads chart settings from localStorage
     * @returns {Object} Object containing chart title, height, and width
     */
    function loadChartSettings() {
      const savedTitle = localStorage.getItem('chartTitle');
      const savedHeight = localStorage.getItem('chartHeight');
      const savedWidth = localStorage.getItem('chartWidth');

      return {
        title: savedTitle || 'Timeline',
        height: savedHeight || '400',
        width: savedWidth || '900'
      };
    }

    // methods
    /**
     * @description Saves the current input rows and chart settings to localStorage
     * @returns {void}
     */
    const saveRows = () => saveInputRows(inputRows.value, title.value, height.value, width.value);
    
    /**
     * @description Loads saved input rows from localStorage
     * @returns {void}
     */
    const loadRows = () => loadInputRows(inputRows);
    
    /**
     * @description Generates the timeline chart with current data and settings
     * @returns {void}
     */
    const generateChart = () => updateChartSeries(inputRows, title, height, width, theme, palette);
    
    /**
     * @description Toggles visibility of additional chart settings
     * @returns {void}
     */
    const toggleNewRow = () => showNewRow.value = !showNewRow.value;

    /**
     * @description Lifecycle hook that runs when component is mounted
     * @returns {void}
     */
    onMounted(() => {
      loadRows();
      // Automatically generate chart on initial load if data exists in localStorage
      if (localStorage.getItem('inputRows') &&
          inputRows.value.length > 0 &&
          inputRows.value.every(row => row.name && row.startTime && row.endTime) &&
          height.value &&
          width.value) {
        generateChart();
      }
    });

    /**
     * @description Watch for changes in input rows to save to localStorage
     */
    watch(inputRows, () => {
      saveRows();
    }, { deep: true });

    /**
     * @description Watch for changes in chart settings to save to localStorage
     */
    watch([title, height, width], () => {
      saveRows();
    });

    return {
      inputRows, title, height, width,
      palette, theme, updatePalette, updateTheme,
      addRow, removeRows, clearAll, uploadData, downloadData,
      rules, allFieldsFilled,
      showNewRow, toggleNewRow, generateChart,
    }
  },
}
</script>

<style scoped>
.title-field {
  max-width: 250px;
  min-width: 200px;
}

.dimension-field {
  max-width: 250px;
  min-width: 150px;
}

.chart-container {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 5;
  justify-content: center;
}

.chart-element {
  min-width: 100%;
  height: auto;
  padding-left: 5px;
  padding-right: 5px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
</style>

<style>
html, body {
  overflow-x: auto;
}
</style>