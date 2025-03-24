/**
 * @file chart.js
 * @description Chart configuration and management functions for timeline visualization
 */
import { ref, onMounted } from 'vue';
import ApexCharts from 'apexcharts';

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
        text: 'Timeline',
        align: 'center',
        style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'Roboto, sans-serif',
        color: '#263238'
        },
    },
    chart: {
        height: '400px',
        width: '900px',
        responsive: true,
        type: 'rangeBar',
        toolbar: {
            show: true,
        },
        zoom: {
            enabled: true,
    },
        background: 'white'
    },
    plotOptions: {
        bar: {
        distributed: true,
        horizontal: true,
        barHeight: '30%'
        }
    },
    xaxis: {
        type: 'datetime',
        categories: []
    },
    tooltip: {
        enabled: false,
        },
    grid: {
        row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
        }
    },
    theme: {
        mode: 'light',
        palette: 'palette3'
    },
    series: [
        {
        name: "",
        data: [
            {
                x: '',
                y: [
                    new Date('1970-01-01').getTime(),
                    new Date('2038-01-19').getTime()
                ]
                },
        ],
        }
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
 * @param {import('vue').Ref<Array<{name: string, startTime: string, endTime: string}>>} inputRows - Timeline data rows
 * @param {import('vue').Ref<string>} title - Chart title
 * @param {import('vue').Ref<string>} height - Chart height in pixels
 * @param {import('vue').Ref<string>} width - Chart width in pixels
 * @param {import('vue').Ref<string>} theme - Chart theme (light/dark)
 * @param {import('vue').Ref<string>} palette - Chart color palette
 * @returns {void}
 */
export const updateChartSeries = (inputRows, title, height, width, theme, palette) => {
    if (!chart.value) return;

    //console.log('inputRows: ', inputRows.value, ', title: ', title.value,
    //            ', height: ', height.value, ', width: ', width.value,
    //            ', palette: ', palette.value, ', theme: ', theme.value);
    let data = inputRows.value.map(row => {
        const [startMonth, startYear] = row.startTime.split('.');
        const [endMonth, endYear] = row.endTime.split('.');

        const startTimeFull = `${startYear}-${startMonth}-01`;
        const endTimeFull = `${endYear}-${endMonth}-01`;

        const startTimeDate = new Date(startTimeFull);
        const endTimeDate = new Date(endTimeFull);

        return {
            x: row.name,
            y: [startTimeDate.getTime(), endTimeDate.getTime()]
        };
    });

    chart.value.updateSeries([
        {
            name: "",
            data: data
        }
    ]);

    chart.value.updateOptions({
        title: {
            text: title.value
        },
        chart: {
            height: height.value,
            width: width.value
        },
        theme: {
            mode: theme.value,
            palette: palette.value
        },
    });
};