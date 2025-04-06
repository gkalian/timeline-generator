<template>
  <v-row class="chart-container-settings mt-0" wrap>
    <v-col cols="12" md="7" class="d-flex align-center">
      <v-text-field class="mr-3 mb-3 title-field"
        v-model="title"
        label="Title"
        :rules="[rules.chartRequiredRule]"
        variant="outlined"
        hide-details
        required
        clearable
        density="compact"
        @update:model-value="updateTitle"
      >
      </v-text-field>

      <v-text-field class="mr-3 mb-3 dimension-field"
        v-model="height"
        label="Height (px)"
        :rules="[rules.chartRequiredRule]"
        variant="outlined"
        hide-details
        required
        clearable
        density="compact"
        @update:model-value="updateHeight"
      >
      </v-text-field>

      <v-text-field class="mr-3 mb-3 dimension-field"
        v-model="width"
        label="Width (px)"
        :rules="[rules.chartRequiredRule]"
        variant="outlined"
        hide-details
        required
        clearable
        density="compact"
        @update:model-value="updateWidth"
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" md="5" class="d-flex pl-10">
      <v-btn class="mr-3 mb-3"
        v-on:click="addRow"
        title="Add row"
        dark
        bottom
      >
        <v-icon>mdi-plus-thick</v-icon>
      </v-btn>

      <v-btn class="mr-3 mb-3"
        :disabled="modelValue.length < 2"
        v-on:click="removeRows"
        title="Remove row"
        dark
        bottom
      >
        <v-icon>mdi-minus-thick</v-icon>
      </v-btn>

      <v-btn class="mr-3 mb-3"
        :disabled="modelValue.length < 2"
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

      <v-btn class="mr-3 mb-3"
        v-on:click="$emit('toggle-new-row')"
        title="Settings"
        dark
        bottom
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { saveInputRows, loadInputRows, saveChartSettings, clearInputRows, handleFileLoad, clearChartSettings } from '../../helper/utils.js'

export default defineComponent({
  name: 'ChartHeader',

  props: {
    modelValue: {
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
    },
    inputRows: {
      type: Array,
      required: true
    }
  },

  emits: ['update:modelValue', 'update:title', 'update:height', 'update:width', 'add-row', 'remove-rows', 'clear-all', 'toggle-new-row'],

  setup(props, { emit }) {
    const title = ref(props.title || 'Timeline')
    const height = ref(props.height || '400')
    const width = ref(props.width || '900')

    watch(() => props.title, (newTitle) => {
      if (newTitle !== title.value) {
        title.value = newTitle || 'Timeline'
      }
    })

    watch(() => props.height, (newHeight) => {
      if (newHeight !== height.value) {
        height.value = newHeight || '400'
      }
    })

    watch(() => props.width, (newWidth) => {
      if (newWidth !== width.value) {
        width.value = newWidth || '900'
      }
    })

    const rules = {
      chartRequiredRule: v => !!v || 'Field is required'
    }

    const updateTitle = (value) => {
      emit('update:title', value)
    }

    const updateHeight = (value) => {
      emit('update:height', value)
    }

    const updateWidth = (value) => {
      emit('update:width', value)
    }

    const addRow = () => {
      emit('add-row')
    }

    const removeRows = () => {
      emit('remove-rows')
    }

    const clearAll = () => {
      emit('clear-all')
    }

    const uploadData = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.csv'
      input.onchange = () => {
        const file = input.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = handleFileLoad(event, props.inputRows)

            if (result) {
              title.value = result.chartTitle || 'Timeline'
              height.value = result.chartHeight || '400'
              width.value = result.chartWidth || '900'
              emit('update:title', title.value)
              emit('update:height', height.value)
              emit('update:width', width.value)
              saveChartSettings(title.value, height.value, width.value)
              saveInputRows(props.inputRows, title.value, height.value, width.value)
              // Update input rows in parent component
              emit('update:modelValue', result.rows)
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }

    const downloadData = () => {
      // Ensure we have data to download
      if (!props.inputRows || props.inputRows.length === 0) {
        console.error('No data to download')
        return
      }

      // Create metadata row with chart settings
      const metadataRow = [title.value, height.value, width.value].join(',')
      
      // Create data rows, filtering out empty rows
      const dataRows = props.inputRows
        .filter(row => row.name || row.comment|| row.startTime || row.endTime )
        .map(row => {
          return [
            row.name || '',
            row.comment || '',
            row.startTime || '',
            row.endTime || ''
          ].join(',')
        }).join('\n')

      // Combine metadata and data rows
      const csvContent = `${metadataRow}\n${dataRows}`
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${title.value || 'timeline'}.csv`);
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return {
      title,
      height,
      width,
      rules,
      updateTitle,
      updateHeight,
      updateWidth,
      addRow,
      removeRows,
      clearAll,
      uploadData,
      downloadData
    }
  }
})
</script>

<style scoped>
.title-field {
  width: 300px;
}

.dimension-field {
  width: 120px;
}
</style>
