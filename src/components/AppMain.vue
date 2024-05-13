<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      min-width="720"
      max-width="2048"
    >
      <div class="header">
        <div class="text-center text-h5 font-weight-light mb-n1">Input your data</div>
        <br/>
      </div>

      <v-container class = "input-fields">        
        <v-row v-for="(row, index) in inputRows" :key="index" dense>
          <v-col class="pr-3">
            <v-text-field
              v-model="row.name"
              :rules="[rules.required]"
              label="Name"
              variant="solo"
              required
              clearable
            ></v-text-field>
          </v-col>

          <v-col class="pr-3">
            <VueDatePicker @update:model-value="(v) => updateStartTime(row, v)" month-picker>
              <template #trigger>
                <v-text-field
                  v-model="row.startTime"
                  :rules="[rules.dateFormatRule]"
                  label="Start time"
                  variant="solo"
                  required
                  clearable
                >
                  <template #append-inner>
                    <v-btn icon variant="plain"><v-icon>mdi-calendar</v-icon></v-btn>
                  </template>
                </v-text-field>
              </template>
            </VueDatePicker>
          </v-col>

          <v-col class="pr-3">
            <VueDatePicker @update:model-value="(v) => updateEndTime(row, v)" month-picker>
              <template #trigger>
                <v-text-field
                  v-model="row.endTime"
                  :rules="[rules.dateFormatRule]"
                  label="End time"
                  variant="solo"
                  required
                  clearable
                >
                  <template #append-inner>
                      <v-btn icon variant="plain"><v-icon>mdi-calendar</v-icon> </v-btn>
                  </template>
						
                </v-text-field>
              </template>
            </VueDatePicker>
          </v-col>
        </v-row>


        <v-col class="d-flex align-center justify-end">
          <v-text-field
            v-model="title"
            label="Title"
            variant="outlined"
            hide-details
            required
            clearable
            density="compact"
            style="max-width: 200px;"
            class="mr-3"
          ></v-text-field>

          <v-text-field
            v-model="height"
            label="Height (px)"
            variant="outlined"
            hide-details
            required
            clearable
            density="compact"
            style="max-width: 200px;"
            class="mr-3"
          ></v-text-field>

          <v-text-field
            v-model="width"
            label="Width (px)"
            variant="outlined"
            hide-details
            required
            clearable
            density="compact"
            style="max-width: 200px;"
            class="mr-3"
          ></v-text-field>

          <v-btn
              v-on:click="addRow"
              dark
              bottom
              variant="text"
              class="mr-3"
            >
              Add row
          </v-btn>

          <v-btn
            :disabled="inputRows.length < 2"
            v-on:click="removeRows"
            dark
            bottom
            variant="text"
            class="mr-3"
          >
            Remove row
          </v-btn>
        </v-col>
      </v-container>

        <v-col class="d-flex justify-center">
          <v-btn
              v-on:click="updateChartSeries"
              dark
              bottom
              :disabled="!allFieldsFilled"
            >
              Generate timeline
          </v-btn>
        </v-col>

        <div id="chart"></div>

      </v-responsive>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ApexCharts from 'apexcharts';

export default {

  setup() {

    // input fields
    const title = ref('Timeline');
    const height = ref('400');
    const width = ref('900');
    const inputRows = ref([
      {
        name: '',
        startTime: '',
        endTime: ''
      }
    ])

    // rows
    const addRow = () => {
      inputRows.value.push({
        name: '',
        startTime: '',
        endTime: ''
      })
    }

    const removeRows = () => {
      if (inputRows.value.length > 1) {
        inputRows.value.pop();
      }
    };

    // datepicker
    function updateStartTime(row, date) {
      row.startTime = toMMYYYY(date);
    }

    function updateEndTime(row, date) {
      row.endTime = toMMYYYY(date);
    }

    function toMMYYYY(date) {
      const month = date.month + 1;
      const monthStr = (month < 10 ? '0' : '') + String(month);
      const year = date.year;
      return `${monthStr}.${year}`;
    }

    // rules
    const rules = {
      required: value => !!value || 'Name is required',
      dateFormatRule: value => /^(0[1-9]|1[0-2])\.\d{4}$/.test(value) || 'Correct format is MM.YYYY',
    }

    const allFieldsFilled = computed(() => {
      return (inputRows.value.every((row) => row.name && row.startTime && row.endTime) && height.value && width.value);
    })

    // chart
    onMounted(() => {
      chart.value = new ApexCharts(document.querySelector("#chart"), options);
      chart.value.render();
    });

    function updateChartSeries() {
      let data = inputRows.value.map(row => {
        // split start and end time
        const [startMonth, startYear] = row.startTime.split('.');
        const [endMonth, endYear] = row.endTime.split('.');
        
        // re-format style
        const startTimeFull = `${startYear}-${startMonth}-01`;
        const endTimeFull = `${endYear}-${endMonth}-01`;

        // create a date object
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
    }

    let options = {
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

    return {
      inputRows,
      title,
      height,
      width,
      addRow,
      removeRows,
      allFieldsFilled,
      rules,
      updateChartSeries,
      options,
      updateStartTime,
      updateEndTime
    }
  },
}
</script>

<style>

#chart {
  width: 100%;
  height: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>