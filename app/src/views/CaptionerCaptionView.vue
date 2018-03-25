<template>
  <div class="captioner-caption-view">
    <div class="text-white">Hello</div>
    <div class="row w-100 caption-wrap-row">
      <div class="caption-wrap-col col-12">
        <div class="caption-wrap caption-wrap-real d-flex h-100">
          <div class="captions d-flex align-items-end">
            <div id="results">
              <span class="final" id="final_span" contenteditable="true"></span> <span class="interim" id="interim_span"></span>
              <div id="captioning-spinner" hidden class="lds-message" style="width:100%;height:100%"> <div></div><div></div><div></div> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'captioner-caption-view',
}
</script>
