<template>
    <VueDatePicker @update:model-value="updateTime" month-picker>
        <template #trigger>
        <v-text-field
            v-model="value"
            :rules="rules"
            :label="label"
            variant="outlined"
            required
            clearable
            readonly
        >
            <template #append-inner>
            <v-btn icon variant="plain"><v-icon>mdi-calendar</v-icon></v-btn>
            </template>
        </v-text-field>
        </template>
    </VueDatePicker>
</template>

<script>
/**
 * @file AppDatePicker.vue
 * @description Custom date picker component that allows selecting month and year
 */
import { ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
components: {
    VueDatePicker,
},
props: {
    /**
     * @description The value bound to the date picker
     * @type {string}
     */
    modelValue: {
        type: String,
        required: true,
    },
    /**
     * @description Label text for the date picker field
     * @type {string}
     */
    label: {
        type: String,
        required: true,
    },
    /**
     * @description Validation rules for the date picker field
     * @type {Array}
     */
    rules: {
        type: Array,
        required: true,
    },
},

emits: ['update:modelValue'],

setup(props, { emit }) {
    /**
     * @description Local reactive reference to the date value
     * @type {import('vue').Ref<string>}
     */
    const value = ref(props.modelValue);

    /**
     * @description Updates the date value when a new date is selected
     * @param {Object} newDate - The new date object with year and month properties
     * @returns {void}
     */
    function updateTime(newDate) {
        const formattedDate = toMMYYYY(new Date(newDate.year, newDate.month));
        value.value = formattedDate;
        emit('update:modelValue', formattedDate);
    }

    /**
     * @description Formats a Date object to MM.YYYY string format
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string in MM.YYYY format
     */
    function toMMYYYY(date) {
        const month = date.getMonth() + 1;
        const monthStr = (month < 10 ? '0' : '') + String(month);
        const year = date.getFullYear();
        return `${monthStr}.${year}`;
    }

    /**
     * @description Watch for changes in the modelValue prop to update the local value
     */
    watch(() => props.modelValue, (newValue) => {
        value.value = newValue;
    });

    return {
        value,
        updateTime,
        toMMYYYY,
    };
    },
};
</script>
