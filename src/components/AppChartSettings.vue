<template>
    <v-row>
        <v-col cols="12" sm="6">
            <v-select
                v-model="localPalette"
                label="Color Palette"
                :items="palettes"
                variant="outlined"
                hide-details
                density="compact"
            ></v-select>
        </v-col>
        <v-col cols="12" sm="3" class="d-flex align-center">
            <v-switch
                v-model="localShowLabels"
                label="Show Labels"
                hide-details
                density="compact"
                color="primary"
            ></v-switch>
        </v-col>
        <v-col cols="12" sm="3" class="d-flex align-center">
            <v-switch
                v-model="localShowLegend"
                label="Show Legend"
                hide-details
                density="compact"
                color="primary"
            ></v-switch>
        </v-col>
    </v-row>
</template>

<script setup>
/**
 * @file AppChartSettings.vue
 * @description Component for managing chart appearance settings like theme and color palette
 */
import { ref, watch } from 'vue';

const props = defineProps({
    /**
     * @description Initial palette value passed from parent
     * @type {string}
     * @default 'palette3'
     */
    initialPalette: {
        type: String,
        default: 'palette3',
    },
    /**
     * @description Initial show labels value passed from parent
     * @type {boolean}
     * @default false
     */
    initialShowLabels: {
        type: Boolean,
        default: false,
    },
    /**
     * @description Initial show legend value passed from parent
     * @type {boolean}
     * @default false
     */
    initialShowLegend: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:palette', 'update:showLabels', 'update:showLegend']);

/**
 * @description Local reactive reference to the palette value
 * @type {import('vue').Ref<string>}
 */
const localPalette = ref(props.initialPalette);

/**
 * @description Local reactive reference to the show labels value
 * @type {import('vue').Ref<boolean>}
 */
const localShowLabels = ref(props.initialShowLabels);

/**
 * @description Local reactive reference to the show legend value
 * @type {import('vue').Ref<boolean>}
 */
const localShowLegend = ref(props.initialShowLegend);

/**
 * @description Available color palettes for the chart
 * @type {Array<string>}
 */
const palettes = [
    'palette1',
    'palette2',
    'palette3',
    'palette4',
    'palette5',
    'palette6',
    'palette7',
    'palette8',
    'palette9',
    'palette10',
];

/**
 * @description Watch for changes in palette to emit update event to parent
 */
watch(localPalette, () => {
    console.log('Selected palette:', localPalette.value);
    emit('update:palette', localPalette.value);
});

/**
 * @description Watch for changes in show labels to emit update event to parent
 */
watch(localShowLabels, () => {
    console.log('Show labels:', localShowLabels.value);
    emit('update:showLabels', localShowLabels.value);
});

/**
 * @description Watch for changes in show legend to emit update event to parent
 */
watch(localShowLegend, () => {
    console.log('Show legend:', localShowLegend.value);
    emit('update:showLegend', localShowLegend.value);
});
</script>