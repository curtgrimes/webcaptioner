<template>
  <div class="settings-vmix-view">
    <p><a href="https://vmix.com" target="_blank">vMix</a> is a popular software video mixer and switcher. You can send text directly to vMix and display it in a title input. You can then use vMix's font and color controls to style captioned text. <a href="/help/integrations/vmix/">Visit the Help Center</a> for more information.</p>
            <!--
            <button id="sendToVmixSettingToggle" type="button" class="btn btn-secondary btn-block" disabled autocomplete="off">
              <i class="fa fa-times mr-2" aira-hidden="true"></i>Send to vMix is <span id="send-to-vmix-status-text">off</span>
            </button>
          -->
    <hr/>
    <div class="vmixStep" data-vmix-step="1" data-error-state="false">
      <h3>
        <span class="badge badge-danger pt-2 mr-2" data-toggle="tooltip" data-placement="top" title="Not complete"><i class="fa fa-exclamation-triangle"></i></span>
        <span class="badge badge-success pt-2 mr-2" hidden><i class="fa fa-check"></i> Done</span>
        <a href="#vmixStep1" data-toggle="collapse" aria-expanded="false" aria-controls="vmixStep1">Step 1: Install the Chrome Extension</a>
      </h3>
      <div id="vmixStep1" class="collapse show ml-4">
        <p class="mb-2">
          The Web Captioner Connector extension enables your browser to send commands to vMix running on your computer or somewhere else on the network.
        </p>
        <button id="addExtensionToChromeButton" type="button" class="btn btn-info"><i class="fa fa-chrome mr-2"></i>Add to Chrome</button>
        <button id="extensionIsAddedToChromeButton" type="button" class="btn btn-success" hidden disabled><i class="fa fa-check mr-2"></i>Added to Chrome</button>
      </div>
    </div>
    <hr/>
    <div class="vmixStep" data-vmix-step="2" data-error-state="false">
      <h3>
          <span class="badge badge-danger pt-2 mr-2" data-toggle="tooltip" data-placement="top" title="Not complete"><i class="fa fa-exclamation-triangle"></i></span>
          <span class="badge badge-success pt-2 mr-2" hidden><i class="fa fa-check"></i> Done</span>
          <a href="#vmixStep2" data-toggle="collapse" aria-expanded="false" aria-controls="vmixStep2">Step 2: Enable vMix web controller</a>
      </h3>
      <div id="vmixStep2" class="collapse show">
        <ol class="ml-0 mb-2">
            <li>In vMix, go to <strong>Settings > Web Controller</strong>.</li>
            <li>Check the box to enable the <a href="http://www.vmix.com/knowledgebase/article.aspx/69/how-to-control-vmix-from-a-web-browser-using-vmix-web-controller" target="_blank">web controller</a>. Specify a port number or accept the default.</li>
            <li>Copy and paste the website address that appears in vMix here:</li>
        </ol>
        <div class="form-group ml-4 mb-2">
            <input type="url" id="vmixWebControllerAddress" class="form-control" placeholder="vMix Web Controller Address" required="true" />
            <p class="mb-2"><small class="form-text text-muted">Example: http://192.168.1.1:8080</small></p>
        </div>
        <p class="ml-4">
          <button class="btn btn-info" id="testConnectionButton"><i class="fa fa-check mr-2" hidden aria-hidden="true"></i>Test Connection</button>
          <i id="testConnectionSpinner" hidden class="fa fa-circle-o-notch fa-spin fa-fw"></i>
          <strong id="connectionSuccessMessage" hidden class="text-success ml-2">Success!</strong>
          <p id="couldNotConnectMessage" hidden class="text-danger ml-4"><strong>Could not connect. Check to make sure that vMix is running, web controller in vMix is enabled, and that the web controller address above is correct.</strong></p>
        </p>
      </div>
    </div>
    <hr/>
    <div class="vmixStep" data-vmix-step="3" data-error-state="false">
      <h3>
        <span class="badge badge-danger pt-2 mr-2" data-toggle="tooltip" data-placement="top" title="Not complete"><i class="fa fa-exclamation-triangle"></i></span>
        <span class="badge badge-success pt-2 mr-2" hidden><i class="fa fa-check"></i> Done</span>
        <a href="#vmixStep3" data-toggle="collapse" aria-expanded="false" aria-controls="vmixStep3">Step 3: Import the Web Captioner title template into vMix</a>
      </h3>
      <div id="vmixStep3" class="collapse show">
        <ol class="ml-0 mb-2">
          <li>Download the Web Captioner vMix title template:<br/> <a href="/web-captioner-title.xaml" class="btn btn-secondary mt-1 mb-2">Web Captioner vMix Title Template <i class="fa fa-external-link ml-1" aria-hidden="true"></i></a></li>
          <li>In vMix, go to <strong>Add Input > Title/XAML</strong>. In the upper right of the Input Select window, click <strong>Browse...</strong> and open the Web Captioner title template.</li>
          <li>The title will appear in the <strong>Recent</strong> tab. Double-click it.</li>
          <li>In the Title Editor that appears, optionally customize font and text size. Close it when you are finished.</li>
          <li>Test your imported title:</li>
        </ol>
        <div class="ml-4">
          <button class="btn btn-info" id="testVmixTitleButton"><i class="fa fa-check mr-2" hidden aria-hidden="true"></i>Send Test Message to vMix</button>
          <i id="testVmixTitleSpinner" hidden class="fa fa-circle-o-notch fa-spin fa-fw"></i>
          <p id="testVmixTitleSuccessMessage" style="font-weight:bold" hidden class="text-success ml-4">Success!</p>
          <p id="testVmixTitleErrorMessage" style="font-weight:bold" hidden class="text-danger ml-4">Error</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-vmix-view',
}
</script>
