<template>
  <div>
    <div class="row small mb-3 mb-sm-2">
      <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Interim</div>
      <div ref="interimScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.interim}}</div>
    </div>

    <div class="row small mb-3 mb-sm-2">
      <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Final</div>
      <div ref="finalScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.final}}</div>
    </div>

    <div class="row small mb-3 mb-sm-2">
      <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Stabilized</div>
      <div ref="stabilizedScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.stabilized}}</div>
    </div>

    <div class="row mb-3 mb-sm-2">
      <div class="col-sm-3 small col-lg-2 font-weight-bold text-uppercase text-sm-right">Cursor</div>
      <div class="col-sm-9">
        <div v-for="(phrase, index) in $store.state.captioner.transcript.cursorable" :key="index" class="d-inline">
          <div
            v-for="({word, firstSeen, stable}, index) in phrase"
            :key="index"
            class="card card-body p-0 d-inline-block small"
            style="overflow:hidden;"
          >
            <div class="row m-0 px-1" :class="stable ? 'bg-success' : 'bg-danger text-white'">{{word}}</div>
            <div class="row m-0 px-1" :class="stable ? 'text-muted' : 'text-danger'">{{Date.now() - firstSeen}}</div>
          </div>
          <div v-if="index != $store.state.captioner.transcript.cursorable.length - 1" class="card card-body p-0 d-inline-block small bg-primary" style="overflow:hidden">
            <div class="row m-0 px-1">&nbsp;</div>
            <div class="row m-0 px-1">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
  .transcriptGrid {
    display:grid;
    grid-template-columns: 15% auto;
    grid-column-gap:25px;
  }
  .transcriptGrid > div {
    padding:10px 0;
  }
  .scrollRight {
    white-space:nowrap;
    overflow-x:auto;
  }
</style>


<script>

export default {
  name: 'settings-title-cards',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Stats',
  },
  methods: {
    scrollRight: function(el) {
      this.$nextTick(function() {
        el.scrollLeft = 9999999;
      });
    },
  },
  watch: {
    '$store.state.captioner.transcript.interim': function () {
      this.scrollRight(this.$refs.interimScroller);
    },
    '$store.state.captioner.transcript.final': function () {
      this.scrollRight(this.$refs.finalScroller);
    },
    '$store.state.captioner.transcript.stabilized': function () {
      this.scrollRight(this.$refs.stabilizedScroller);
    },
  },
}
</script>
