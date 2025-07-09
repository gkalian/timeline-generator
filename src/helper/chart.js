/**
 * @file chart.js
 * @description Chart configuration and management functions for timeline visualization
 */
import { ref, onMounted } from "vue";
import ApexCharts from "apexcharts";

/**
 * @description Reactive reference to the chart instance
 * @type {import('vue').Ref<ApexCharts|null>}
 */
export const chart = ref(null);

/**
 * @description Default configuration options for the ApexCharts timeline chart
 * @type {Object}
 */
export const defaultChartOptions = {
  title: {
    text: "Timeline",
    align: "center",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: "Manrope, sans-serif",
      color: "#263238",
    },
  },
  chart: {
    height: "400px",
    width: "900px",
    responsive: true,
    type: "rangeBar",
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
      type: "x",
      autoScaleYaxis: true,
    },
    background: "white",
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: true,
      barHeight: "30%",
      dataLabels: {
        hideOverflowingLabels: false,
        position: "center",
        enabled: true,
      },
    },
  },
  dataLabels: {
    enabled: true,
    hideOverflowingLabels: false,
    formatter: function (val, opts) {
      const comment = opts.w.config.series[0].data[opts.dataPointIndex].comment;
      return comment || "";
    },
    style: {
      colors: ["#ffffff"],
      fontSize: "12px",
      fontFamily: "Manrope, sans-serif",
      fontWeight: 600,
    },
    background: {
      enabled: true,
      foreColor: "#000000",
      borderRadius: 4,
      padding: 6,
      opacity: 0.8,
      borderWidth: 1,
      borderColor: "#cccccc",
    },
    offsetX: 0,
    offsetY: 0,
  },
  xaxis: {
    type: "datetime",
    categories: [],
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
  theme: {
    palette: "palette1",
  },

  series: [
    {
      name: "",
      data: [
        {
          x: "",
          y: [
            new Date("1970-01-01").getTime(),
            new Date("2038-01-19").getTime(),
          ],
          comment: "",
        },
      ],
    },
  ],
};

/**
 * @description Initializes and renders the chart when component is mounted
 * @param {Object} options - Chart configuration options (defaults to defaultChartOptions)
 * @returns {void}
 */
export const loadChart = (options = defaultChartOptions) => {
  onMounted(() => {
    chart.value = new ApexCharts(document.querySelector("#chart"), options);
    chart.value.render();
  });
};

/**
 * @description Updates the chart with new data and settings
 * @param {import('vue').Ref<Array<{name: string, comment: string, startTime: string, endTime: string}>>} inputRows - Timeline data rows
 * @param {import('vue').Ref<string>} title - Chart title
 * @param {import('vue').Ref<string>} height - Chart height in pixels
 * @param {import('vue').Ref<string>} width - Chart width in pixels
 * @param {import('vue').Ref<string>} palette - Chart color palette
 * @param {import('vue').Ref<boolean>} showLabels - Whether to show data labels
 * @returns {void}
 */
export const updateChartSeries = (
  inputRows,
  title,
  height,
  width,
  palette,
  showLabels,
) => {
  if (!chart.value) return;

  const inputRowsValue = inputRows?.value ?? inputRows;
  const titleValue = title?.value ?? title;
  const heightValue = height?.value ?? height;
  const widthValue = width?.value ?? width;
  const paletteValue = palette?.value ?? palette;
  const showLabelsValue = showLabels?.value ?? showLabels;

  console.log("Updating chart with:", {
    inputRows: inputRowsValue,
    title: titleValue,
    height: heightValue,
    width: widthValue,
    palette: paletteValue,
    showLabels: showLabelsValue,
  });

  let data = inputRowsValue.map((row) => {
    const [startMonth, startYear] = row.startTime.split(".");
    const [endMonth, endYear] = row.endTime.split(".");

    const startTimeFull = `${startYear}-${startMonth}-01`;
    const endTimeFull = `${endYear}-${endMonth}-01`;

    const startTimeDate = new Date(startTimeFull);
    const endTimeDate = new Date(endTimeFull);

    return {
      x: row.name,
      y: [startTimeDate.getTime(), endTimeDate.getTime()],
      comment: row.comment || "",
    };
  });

  // Update all options at once
  chart.value.updateOptions(
    {
      theme: {
        palette: paletteValue,
      },
      title: {
        text: titleValue,
      },
      chart: {
        height: heightValue,
        width: widthValue,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: "zoom",
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: "30%",
          dataLabels: {
            hideOverflowingLabels: false,
            position: "center",
            enabled: showLabelsValue,
          },
        },
      },
      dataLabels: {
        enabled: showLabelsValue,
        hideOverflowingLabels: false,
        formatter: function (val, opts) {
          const comment =
            opts.w.config.series[0].data[opts.dataPointIndex].comment;
          return comment || "";
        },
        style: {
          colors: ["#ffffff"],
          fontSize: "12px",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
        },
        background: {
          enabled: true,
          foreColor: "#000000",
          borderRadius: 4,
          padding: 6,
          opacity: 0.8,
          borderWidth: 1,
          borderColor: "#cccccc",
        },
        offsetX: 0,
        offsetY: 0,
      },
    },
    false,
    true,
  ); // false = don't redraw yet, true = update colors

  // Then update the series data
  chart.value.updateSeries([
    {
      name: "",
      data: data,
    },
  ]);
};
