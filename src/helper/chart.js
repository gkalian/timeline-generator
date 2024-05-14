//working with Apex Chart
import { ref, onMounted } from 'vue';
import ApexCharts from 'apexcharts';

export const chart = ref(null);

export const loadChart = (options) => {
    onMounted(() => {
        chart.value = new ApexCharts(document.querySelector("#chart"), options);
        chart.value.render();
        });
};

export const updateChartSeries = (inputRows, title, height, width) => {
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
        }
        });
};

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
