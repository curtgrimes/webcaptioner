<template>
  <div id="app" class="w-100">
    <router-view class="view"></router-view>

    <nav id="main-navbar" class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <span class="navbar-brand">
        <a href="/">
          <img src="/public/logo.svg" width="20" height="20" class="d-inline-block align-top mr-2" alt="Web Captioner" />
          <span class="d-none d-md-inline">Web Captioner</span>
        </a>
      </span>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li id="audioLevelWrap" hidden>
            <div class="row mr-3" style="width:350px">
              <div class="col text-right">
                <span id="clippingMessage" hidden class="navbar-text text-white bg-danger px-3">
                  <i class="fa fa-exclamation-triangle pr-1" aria-hidden="true"></i> Too loud
                </span>
                <span id="lowLevelMessage" hidden class="navbar-text text-white bg-danger px-2">
                  <i class="fa fa-exclamation-triangle pr-1" aria-hidden="true"></i> Too quiet
                </span>
              </div>
              <div class="col">
                <div id="meterWrap" class="progress" style="margin-top:.7rem">
                  <div id="meter" class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          </li>
          <li id="now_listening" class="navbar-text text-white px-3" hidden>
            Now listening...
          </li>
          <li class="nav-item">
            <div id="settingsDropdownContainer" class="btn-group dropup">
              <button type="button" class="btn btn-primary" id="startButton">Start<span class="d-none d-sm-inline"> Captioning</span></button>
              <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="ga('send', 'event', 'settings', 'expandDropdown')">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</a>
                <a class="dropdown-item" href="/help" target="_blank" onclick="ga('send', 'event', 'settings', 'helpCenterButton')">Help Center</a>
                <a class="dropdown-item" href="/blog" target="_blank" onclick="ga('send', 'event', 'settings', 'blogButton')">Blog</a>
                <a class="dropdown-item" href="/feedback" target="_blank" onclick="ga('send', 'event', 'settings', 'reportAProblemButton')">Report a Problem</a>
                <a class="dropdown-item" href="/donate" target="_blank" onclick="ga('send', 'event', 'settings', 'donateButton')">Donate</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="javascript:void(0)" id="saveTranscriptToFileButton" onclick="ga('send', 'event', 'settings', 'saveToFile')"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</a>
                <a class="dropdown-item disabled" hidden href="javascript:void(0)" id="saveTranscriptToFileDisabledButton" data-toggle="tooltip" data-trigger="hover" data-placement="left" title="Nothing to save right now"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</a>
                <a class="dropdown-item" href="javascript:void(0)" id="clearTranscriptButton"><i class="fa fa-trash-o mr-1" aria-hidden="true"></i> Clear...</a>
                <div class="dropdown-divider"></div>
                <h6 class="dropdown-header">vMix</h6>
                <a class="dropdown-item" id="startStopVmixToggle" href="javascript:void(0)" data-toggle="modal" onclick="ga('send', 'event', 'settings', 'vmixToggle')">Send to vMix <span class="badge-vmix-status-on badge badge-primary text-muted text-uppercase ml-1" hidden style="position:relative;top:-1px">On</span> <span class="badge-vmix-status-off badge badge-dark text-uppercase ml-1" hidden style="position:relative;top:-1px">Off</span></a>
                <a class="dropdown-item" id="sendToVmixSettings" href="javascript:void(0)" data-toggle="modal" data-target="#vmixModal" onclick="ga('send', 'event', 'settings', 'editVmixStart')">Configure</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#languageModal" onclick="ga('send', 'event', 'settings', 'editLanguageStart')"><i class="fa fa-language mr-1" aria-hidden="true"></i> Language</a>
                <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#wordReplacementModal" onclick="ga('send', 'event', 'settings', 'editWordReplacementsStart')"><i class="fa fa-refresh mr-1" aria-hidden="true"></i> Word Replacements</a>
                <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#appearanceModal" onclick="ga('send', 'event', 'settings', 'editAppearanceStart')"><i class="fa fa-paint-brush mr-1" aria-hidden="true"></i> Appearance</a>
                <router-link to="/captioner/settings" class="dropdown-item"><i class="fa fa-cog mr-1" aria-hidden="true"></i> Settings</router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
  @import 'scss/app.scss';
</style>

<style lang="css">
  @import '../node_modules/font-awesome/css/font-awesome.css';
</style>
