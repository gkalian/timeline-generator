<template>
  <div>
    <v-row v-show="showNewRow">
      <v-col cols="12" class="d-flex justify-start">
        <ChartSettings
          :initial-palette="palette"
          :initial-show-labels="showLabels"
          @update:palette="updatePalette"
          @update:show-labels="updateShowLabels"
        />
      </v-col>
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
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import {
  loadChart,
  updateChartSeries,
  defaultChartOptions,
} from "../../helper/chart.js";
import ChartSettings from "./ChartSettings.vue";

export default defineComponent({
  name: "ChartContainer",

  components: {
    ChartSettings,
  },

  props: {
    inputRows: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "Timeline",
    },
    height: {
      type: String,
      default: "400",
    },
    width: {
      type: String,
      default: "900",
    },
    showNewRow: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const palette = ref("palette1");
    const showLabels = ref(false);

    const allFieldsFilled = computed(() => {
      return (
        props.inputRows.every(
          (row) => row.name && row.startTime && row.endTime,
        ) &&
        props.title &&
        props.height &&
        props.width
      );
    });

    const updatePalette = (newPalette) => {
      palette.value = newPalette;
      updateChartSeries(
        props.inputRows,
        props.title,
        props.height,
        props.width,
        palette.value,
        showLabels.value,
      );
    };

    const updateShowLabels = (newShowLabels) => {
      showLabels.value = newShowLabels;
      updateChartSeries(
        props.inputRows,
        props.title,
        props.height,
        props.width,
        palette.value,
        showLabels.value,
      );
    };

    const generateChart = () => {
      updateChartSeries(
        props.inputRows,
        props.title,
        props.height,
        props.width,
        palette.value,
        showLabels.value,
      );
    };

    onMounted(() => {
      loadChart(defaultChartOptions);
    });

    // Initialize chart with default theme and current palette
    const initialOptions = {
      ...defaultChartOptions,
      theme: {
        mode: "light",
        palette: palette.value,
      },
      dataLabels: {
        enabled: false,
      },
    };
    loadChart(initialOptions);

    // If we have valid props, generate the chart immediately
    if (props.inputRows?.length && props.title && props.height && props.width) {
      generateChart();
    }

    return {
      palette,
      showLabels,
      allFieldsFilled,
      updatePalette,
      updateShowLabels,
      generateChart,
    };
  },
});
</script>
