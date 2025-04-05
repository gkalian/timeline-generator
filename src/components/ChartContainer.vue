<template>
  <div>
    <v-row class="mt-n3">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn v-on:click="toggleNewRow" disabled>{{ showNewRow ? 'Less' : 'More' }} settings</v-btn>
      </v-col>
    </v-row>

    <v-row v-show="showNewRow" class="chart-settings">
      <AppChartSettings
        :initial-palette="palette"
        :initial-show-labels="showLabels"
        :initial-show-legend="showLegend"
        @update:palette="updatePalette"
        @update:show-labels="updateShowLabels"
        @update:show-legend="updateShowLegend"
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
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { loadChart, updateChartSeries, defaultChartOptions } from '../helper/chart.js'
import AppChartSettings from './AppChartSettings.vue'

export default defineComponent({
  name: 'ChartContainer',

  components: {
    AppChartSettings
  },

  props: {
    inputRows: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Timeline'
    },
    height: {
      type: String,
      default: '400'
    },
    width: {
      type: String,
      default: '900'
    }
  },

  setup(props) {
    const showNewRow = ref(false)
    const palette = ref('palette3')
    const showLabels = ref(false)
    const showLegend = ref(false)

    const allFieldsFilled = computed(() => {
      return props.inputRows.every(row => 
        row.name && row.startTime && row.endTime
      ) && props.title && props.height && props.width
    })

    const toggleNewRow = () => {
      showNewRow.value = !showNewRow.value
    }

    const updatePalette = (newPalette) => {
      palette.value = newPalette
      updateChartSeries(props.inputRows, props.title, props.height, props.width, palette.value, showLabels.value, showLegend.value)
    }

    const updateShowLabels = (newShowLabels) => {
      showLabels.value = newShowLabels
      updateChartSeries(props.inputRows, props.title, props.height, props.width, palette.value, showLabels.value, showLegend.value)
    }

    const updateShowLegend = (newShowLegend) => {
      showLegend.value = newShowLegend
      updateChartSeries(props.inputRows, props.title, props.height, props.width, palette.value, showLabels.value, showLegend.value)
    }

    const generateChart = () => {
      updateChartSeries(props.inputRows, props.title, props.height, props.width, palette.value, showLabels.value, showLegend.value)
    }

    // Initialize chart with default theme and current palette
    const initialOptions = {
      ...defaultChartOptions,
      theme: {
        mode: 'light',
        palette: palette.value
      },
      legend: {
        show: false,
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'Roboto, sans-serif'
      },
      dataLabels: {
        enabled: false
      }
    }
    loadChart(initialOptions)

    // If we have valid props, generate the chart immediately
    if (props.inputRows?.length && props.title && props.height && props.width) {
      generateChart()
    }

    return {
      showNewRow,
      palette,
      showLabels,
      showLegend,
      allFieldsFilled,
      toggleNewRow,
      updatePalette,
      updateShowLabels,
      updateShowLegend,
      generateChart
    }
  }
})
</script>

<style scoped>
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
