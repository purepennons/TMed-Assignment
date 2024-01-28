<script>
export default {
    name: 'InputWithIcon',
    inheritAttrs: false,
    props: {
        modelValue: String,
        svgIconComponent: Object
    }
}
</script>
<template>
    <div class="input-with-icon input-group">
        <input
            v-bind="$attrs"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :class="{ 'no-border-right': !!svgIconComponent }"
        />
        <span v-if="svgIconComponent" class="input-group-text">
            <component :is="svgIconComponent" />
        </span>
    </div>
</template>
<style lang="scss" scoped>
.no-border-right {
    border-right: none;
}

.input-with-icon {
    border-radius: 8px !important;
    border: 2px solid #ededed;
    background: white;

    & > input {
        border-radius: 8px;
    }

    & > span {
        background: white;
    }
}
</style>
