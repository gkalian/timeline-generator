<template>

<v-col>
    <div class="text-center">
        <v-select
        v-model="localTheme"
        @change="onThemeSelect"
        label="Theme"
        :items="themes"
        variant="outlined"
        hide-details
        density="compact"
        ></v-select>
        <v-menu :theme="localTheme">
        <v-list>
            <v-list-item
            v-for="(themeItem, index) in themeItems"
            :key="index"
            >
            <v-list-item-title>{{ themeItem.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        </v-menu>
    </div>
    </v-col>

    <v-col>
    <div class="text-center">
        <v-select
        v-model="localPalette"
        @change="onPaletteSelect"
        label="Palette"
        :items="palettes"
        variant="outlined"
        hide-details
        density="compact"
        ></v-select>
        <v-menu :palette="localPalette">
        <v-list>
            <v-list-item
            v-for="(item, index) in items"
            :key="index"
            >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        </v-menu>
    </div>
    </v-col>

    <v-col>
    <v-text-field
        label="Placeholder"
        variant="outlined"
        hide-details
        density="compact"
        readonly
    ></v-text-field>
    </v-col>

    <v-col>
    <v-text-field
        label="Placeholder"
        variant="outlined"
        hide-details
        density="compact"
        readonly
    ></v-text-field>
    </v-col>

    <v-col>
    <v-text-field
        label="Placeholder"
        variant="outlined"
        hide-details
        density="compact"
    ></v-text-field>
    </v-col>

</template>

<script>
/**
 * @file AppChartSettings.vue
 * @description Component for managing chart appearance settings like theme and color palette
 */
import { ref, watch } from 'vue';

export default {
    props: {
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
         * @description Initial theme value passed from parent
         * @type {string}
         * @default 'light'
         */
        initialTheme: {
            type: String,
            default: 'light',
        },
    },
    emits: ['update:palette', 'update:theme'],

    setup(props, { emit }) {
        /**
         * @description Local reactive reference to the palette value
         * @type {import('vue').Ref<string>}
         */
        const localPalette = ref(props.initialPalette);
        
        /**
         * @description Local reactive reference to the theme value
         * @type {import('vue').Ref<string>}
         */
        const localTheme = ref(props.initialTheme);

        /**
         * @description Watch for changes in palette to emit update event to parent
         */
        watch(localPalette, () => {
            console.log('Selected palette:', localPalette.value);
            emit('update:palette', localPalette.value);
        });

        /**
         * @description Watch for changes in theme to emit update event to parent
         */
        watch(localTheme, () => {
            console.log('Selected theme:', localTheme.value);
            emit('update:theme', localTheme.value);
        });

        return {
            localPalette,
            localTheme,
            onPaletteSelect: () => onPaletteSelect(),
            onThemeSelect: () => onThemeSelect(),
        };
    },
    data() {
        return {
            /**
             * @description Available color palettes for the chart
             * @type {Array<string>}
             */
            palettes: [
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
            ],
            /**
             * @description Available themes for the chart
             * @type {Array<string>}
             */
            themes: [
                'light',
                'dark',
            ],

        };
    },
};
</script>