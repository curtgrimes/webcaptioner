<template>
  <div class="captioner-view h-100">
    <router-view></router-view>
    <save-to-file-modal ref="saveToFileModal"></save-to-file-modal>
    <clear-transcript-modal ref="clearTranscriptModal"></clear-transcript-modal>

    <navbar></navbar>
  </div>
</template>

<script>
import navbar from '../components/Navbar.vue'
import SaveToFileModal from '../components/SaveToFileModal.vue'
import ClearTranscriptModal from '../components/ClearTranscriptModal.vue'

export default {
  name: 'captioner-view',
  components: {
    navbar,
    SaveToFileModal,
    ClearTranscriptModal,
  },
}
</script>
