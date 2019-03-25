<script>
export default {
    inheritAttrs: false,
    props: {
        label: {
            type: String,
            required: true,
        },
        appendInputText: {
            type: String,
            required: false,
        },
        hint: {
            type: String,
            required: false,
        },
    },
}
</script>

<template>
    <label class="form-group row">
        <div class="col-sm-6 col-form-label">{{label}}</div>
        <div class="col-sm-6">
            <div :class="appendInputText ? 'input-group' : ''">
                <input
                    v-bind="$attrs"
                    v-on:input="$emit('input', $event.target.value)"
                    class="form-control"
                />
                <span v-if="appendInputText" class="input-group-append">
                    <span class="input-group-text">{{appendInputText}}</span>
                </span>
            </div>
            <p v-if="hint" class="small mb-0 mt-1">{{hint}}</p>
        </div>
    </label>
</template>