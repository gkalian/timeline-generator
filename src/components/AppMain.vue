<template>
  <v-container>
    <v-responsive class="align-center mx-auto"
      min-width="320"
      max-width="2048"
    >
      <div class="header">
        <div class="text-center text-h5 font-weight-light mb-n1 mt-4">Input your data</div>
        <br/>
      </div>

      <InputFieldsRow
        v-model="inputRows"
      />

      <ChartHeader
        v-model="inputRows"
        v-model:title="title"
        v-model:height="height"
        v-model:width="width"
        @add-row="addRow"
        @remove-rows="removeRows"
        @clear-all="clearAll"
      />

      <ChartContainer
        :input-rows="inputRows"
        :title="title"
        :height="height"
        :width="width"
      />

    </v-responsive>
  </v-container>
</template>

<script>
/**
 * @file AppMain.vue
 * @description Main component that handles timeline data input, visualization and management
 */
import { ref, onMounted, watch } from 'vue'
import { saveInputRows, saveChartSettings, clearInputRows, clearChartSettings, loadChartSettings, loadInputRows } from '../helper/utils.js';
import { updateChartSeries } from '../helper/chart.js';
import InputFieldsRow from './InputFieldsRow.vue';
import ChartHeader from './ChartHeader.vue';
import ChartContainer from './ChartContainer.vue';

export default {
  components: {
    InputFieldsRow,
    ChartHeader,
    ChartContainer
  },

  setup() {
    const chartSettings = loadChartSettings();
    const title = ref('Timeline');
    const height = ref('400');
    const width = ref('900');
    const palette = ref('palette1');
    //const showLabels = ref(true);
    //const showLegend = ref(true);
    const inputRows = ref([{ name: '', startTime: '', endTime: '', comment: '' }]);

    // Load saved settings and data if available
    if (chartSettings) {
      if (chartSettings.title) title.value = chartSettings.title;
      if (chartSettings.height) height.value = chartSettings.height;
      if (chartSettings.width) width.value = chartSettings.width;
    }

    // Load saved input rows
    console.log('Before loading:', inputRows.value);
    loadInputRows(inputRows);
    console.log('After loading:', inputRows.value);

    const addRow = () => {
      inputRows.value.push({ name: '', startTime: '', endTime: '', comment: '' });
    }

    const removeRows = () => {
      if (inputRows.value.length > 1) {
        inputRows.value.pop();
      }
    }

    const clearAll = () => {
      inputRows.value.splice(1);
      inputRows.value[0] = { name: '', startTime: '', endTime: '', comment: '' };
      title.value = 'Timeline';
      height.value = '400';
      width.value = '900';
      clearInputRows();
      clearChartSettings();
    }

    // Load saved data on mount
    
    /**
     * @description Generates the timeline chart with current data and settings
     * @returns {void}
     */
    const generateChart = () => updateChartSeries(inputRows, title, height, width, palette);
    
    /**
     * @description Lifecycle hook that runs when component is mounted
     * @returns {void}
     */
    onMounted(() => {
      console.log('Component mounted, current data:', inputRows.value);
      // Add a small delay to ensure data is loaded
      setTimeout(() => {
        if (inputRows.value.length > 0 && 
            inputRows.value[0].name && // Check if we have actual data, not just empty row
            title.value &&
            height.value &&
            width.value) {
          generateChart();
        }
      }, 100);
    });

    // Watch for changes in input rows to save to localStorage
    watch(inputRows, () => {
      saveInputRows(inputRows.value);
    }, { deep: true });

    // Watch for changes in chart settings to save to localStorage
    watch([title, height, width], () => {
      saveChartSettings(title.value, height.value, width.value);
    });

    return {
      inputRows,
      title,
      height,
      width,
      palette,
      //showLabels,
      //showLegend,
      addRow,
      removeRows,
      clearAll
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

</style>