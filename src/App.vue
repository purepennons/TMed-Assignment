<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
    <RouterView />
</template>

<style lang="scss">
// v-calendar overwrite
.vc-calendar-date-picker {
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }

    &.vc-container {
        border-radius: 8px;
        border-bottom: 3px solid #ededed;
        background: white;
        box-shadow: 0px 0px 0px 3px rgba(221, 221, 221, 0.16);
    }

    & .vc-title,
    .vc-arrow {
        background: white;
    }
}
</style>
