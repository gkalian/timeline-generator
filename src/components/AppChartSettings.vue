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
import { ref, watch } from 'vue';

export default {
    props: {
        initialPalette: {
            type: String,
            default: 'palette3',
        },
        initialTheme: {
            type: String,
            default: 'light',
        },
    },
    emits: ['update:palette', 'update:theme'],

    setup(props, { emit }) {
        const localPalette = ref(props.initialPalette);
        const localTheme = ref(props.initialTheme);

        watch(localPalette, () => {
            console.log('Selected palette:', localPalette.value);
            emit('update:palette', localPalette.value);
        });

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
            themes: [
                'light',
                'dark',
            ],

        };
    },
};
</script>