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
        fontFamily: 'Manrope, sans-serif',
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
            barHeight: '30%',
            dataLabels: {
                hideOverflowingLabels: true,
                position: 'bottom',
                enabled: false
            }
        }
    },
    dataLabels: {
        enabled: false,
        hideOverflowingLabels: true,
        style: {
            colors: ['#333'],
            fontSize: '12px',
            fontWeight: 'bold'
        },
        background: {
            enabled: true,
            foreColor: '#fff',
            borderRadius: 2,
            padding: 4,
            opacity: 0.9,
            borderWidth: 1,
            borderColor: '#fff'
        }
    },
    xaxis: {
        type: 'datetime',
        categories: []
    },
    tooltip: {
        enabled: true,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const comment = w.config.series[seriesIndex].data[dataPointIndex].comment;
            return comment ? `<div class="apexcharts-tooltip-title">${comment}</div>` : '';
        }
    },
    grid: {
        row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
        }
    },
    theme: {
        palette: 'palette1'
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
 * @param {import('vue').Ref<Array<{name: string, comment: string, startTime: string, endTime: string}>>} inputRows - Timeline data rows
 * @param {import('vue').Ref<string>} title - Chart title
 * @param {import('vue').Ref<string>} height - Chart height in pixels
 * @param {import('vue').Ref<string>} width - Chart width in pixels
 * @param {import('vue').Ref<string>} palette - Chart color palette
 * @returns {void}
 */
export const updateChartSeries = (inputRows, title, height, width, palette, showLabels) => {
    if (!chart.value) return;

    const inputRowsValue = inputRows?.value ?? inputRows;
    const titleValue = title?.value ?? title;
    const heightValue = height?.value ?? height;
    const widthValue = width?.value ?? width;
    const paletteValue = palette?.value ?? palette;

    console.log('Updating chart with:', {
        inputRows: inputRowsValue,
        title: titleValue,
        height: heightValue,
        width: widthValue,
        palette: paletteValue
    });

    let data = inputRowsValue.map(row => {
        const [startMonth, startYear] = row.startTime.split('.');
        const [endMonth, endYear] = row.endTime.split('.');

        const startTimeFull = `${startYear}-${startMonth}-01`;
        const endTimeFull = `${endYear}-${endMonth}-01`;

        const startTimeDate = new Date(startTimeFull);
        const endTimeDate = new Date(endTimeFull);

        return {
            x: row.name,
            y: [startTimeDate.getTime(), endTimeDate.getTime()],
            comment: row.comment || ''
        };
    });

    // Update all options at once
    chart.value.updateOptions({
        theme: {
            palette: paletteValue
        },
        title: {
            text: titleValue
        },
        chart: {
            height: heightValue,
            width: widthValue
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: showLabels,
                    hideOverflowingLabels: true,
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: showLabels,
            hideOverflowingLabels: true,
            formatter: function(val, opts) {
                const comment = opts.w.config.series[0].data[opts.dataPointIndex].comment;
                return comment || '';
            },
            style: {
                colors: ['#000000'],
                fontSize: '12px',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400
            },
            offsetX: -30
        }
    }, false, true); // false = don't redraw yet, true = update colors

    // Then update the series data
    chart.value.updateSeries([{
        name: "",
        data: data
    }]);
};