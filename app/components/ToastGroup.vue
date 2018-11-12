<template>
    <div ref="toastGroup" style="position:absolute;width:100%;max-width:500px;top:0;right:0;bottom:0;overflow-y:auto" :style="{'pointerEvents' : shouldAcceptPointerEvents ? 'auto' : 'none'}">
        <div class="d-flex flex-column align-items-end pt-3" style="height:100%;pointer-events:none;">
            <div class="flex-grow-1"></div>
            <slot ref="slot" />
        </div>
    </div>
</template>


<script>
export default {
    data: function() {
        return {
            shouldAcceptPointerEvents: false,
            shouldAcceptPointerEventsInterval: null,
        };
    },
    mounted: function() {
        this.shouldAcceptPointerEventsInterval = setInterval(() => {
            // Check if overflowed, and therefore has toasts, and therefore should
            // accept pointer events
            this.shouldAcceptPointerEvents = this.$refs.toastGroup && this.$refs.toastGroup.scrollHeight > this.$refs.toastGroup.clientHeight;
        }, 1000);
    },
    beforeDestroy: function() {
        clearInterval(this.shouldAcceptPointerEventsInterval);
    },
}
</script>
