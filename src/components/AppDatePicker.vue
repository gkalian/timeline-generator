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
import { ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
components: {
    VueDatePicker,
},
props: {
    modelValue: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    rules: {
        type: Array, 
        required: true,
    },
},

emits: ['update:modelValue'],

setup(props, { emit }) {
    const value = ref(props.modelValue);

    function updateTime(newDate) {
        const formattedDate = toMMYYYY(new Date(newDate.year, newDate.month - 1));
        value.value = formattedDate;
        emit('update:modelValue', formattedDate);
    }

    function toMMYYYY(date) {
        const month = date.getMonth() + 1;
        const monthStr = (month < 10 ? '0' : '') + String(month);
        const year = date.getFullYear();
        return `${monthStr}.${year}`;
    }

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
