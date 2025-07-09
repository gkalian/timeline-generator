<template>
  <v-container>
    <v-responsive
      class="main-container align-center mx-auto"
      min-width="320"
      max-width="2048"
    >
      <div class="header">
        <div class="text-center text-h5 font-weight-light mb-n1 mt-4">
          Input your data
        </div>
        <br />
      </div>

      <InputFieldsRow v-model="inputRows" />

      <ChartHeader
        v-model="inputRows"
        :input-rows="inputRows"
        v-model:title="title"
        v-model:height="height"
        v-model:width="width"
        @add-row="addRow"
        @remove-rows="removeRows"
        @clear-all="clearAll"
        @toggle-new-row="toggleNewRow"
      />

      <v-row class="chart-container">
        <ChartContainer
          :input-rows="inputRows"
          :title="title"
          :height="height"
          :width="width"
          :show-new-row="showNewRow"
        />
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
/**
 * @file AppMain.vue
 * @description Main component that handles timeline data input, visualization and management
 */
import { ref, onMounted, watch } from "vue";
import {
  saveInputRows,
  saveChartSettings,
  clearInputRows,
  clearChartSettings,
  loadChartSettings,
  loadInputRows,
} from "../helper/utils.js";
import { updateChartSeries } from "../helper/chart.js";
import InputFieldsRow from "./InputFieldsRow.vue";
import ChartHeader from "./chart/ChartHeader.vue";
import ChartContainer from "./chart/ChartContainer.vue";

export default {
  components: {
    InputFieldsRow,
    ChartHeader,
    ChartContainer,
  },

  setup() {
    const chartSettings = loadChartSettings();
    const title = ref("Timeline");
    const height = ref("400");
    const width = ref("900");
    const palette = ref("palette1");
    const showNewRow = ref(false);
    const inputRows = ref([
      { name: "", comment: "", startTime: "", endTime: "" },
    ]);

    // Load saved settings and data if available
    if (chartSettings) {
      if (chartSettings.title) title.value = chartSettings.title;
      if (chartSettings.height) height.value = chartSettings.height;
      if (chartSettings.width) width.value = chartSettings.width;
    }

    // Load saved input rows
    console.log("Before loading:", inputRows.value);
    loadInputRows(inputRows);
    console.log("After loading:", inputRows.value);

    const addRow = () => {
      inputRows.value.push({
        name: "",
        comment: "",
        startTime: "",
        endTime: "",
      });
    };

    const removeRows = () => {
      if (inputRows.value.length > 1) {
        inputRows.value.pop();
      }
    };

    const clearAll = () => {
      inputRows.value.splice(1);
      inputRows.value[0] = {
        name: "",
        comment: "",
        startTime: "",
        endTime: "",
      };
      title.value = "Timeline";
      height.value = "400";
      width.value = "900";
      clearInputRows();
      clearChartSettings();
    };

    const toggleNewRow = () => {
      showNewRow.value = !showNewRow.value;
    };

    // Load saved data on mount

    /**
     * @description Generates the timeline chart with current data and settings
     * @returns {void}
     */
    const generateChart = () =>
      updateChartSeries(inputRows, title, height, width, palette);

    /**
     * @description Lifecycle hook that runs when component is mounted
     * @returns {void}
     */
    onMounted(() => {
      console.log("Component mounted, current data:", inputRows.value);
      // Add a small delay to ensure data is loaded
      setTimeout(() => {
        if (
          inputRows.value.length > 0 &&
          inputRows.value[0].name && // Check if we have actual data, not just empty row
          title.value &&
          height.value &&
          width.value
        ) {
          generateChart();
        }
      }, 100);
    });

    // Watch for changes in input rows to save to localStorage
    watch(
      inputRows,
      () => {
        saveInputRows(inputRows.value);
      },
      { deep: true },
    );

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
      showNewRow,
      addRow,
      removeRows,
      clearAll,
      toggleNewRow,
    };
  },
};
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
