<template>
    <div v-show="visibleToastCount > 0" style="position:absolute;width:100%;max-width:500px;top:0;right:0;bottom:0;overflow-y:auto">
        <div class="d-flex flex-column align-items-end pt-3" style="position:absolute;top:0;bottom:0;left:0;right:0;">
            <div class="flex-grow-1"></div>
            <slot ref="slot" />
        </div>
    </div>
</template>


<script>
export default {
    data: function() {
        return {
            visibleToastCount: 0,
        };
    },
    mounted: function () {
        this.$on('toastChange', (visible) => {
            if (visible) {
                this.visibleToastCount++;
            }
            else {
                setTimeout(()=>{
                    this.visibleToastCount--;
                }, 200);
            }
        });
    },
}
</script>
