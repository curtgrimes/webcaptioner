import Vue from 'vue'
import CircularJson from 'circular-json'

export default {
  SET_SETTINGS_PAGE_TITLE: (state, { settingsPageTitle }) => {
    state.settingsPageTitle = settingsPageTitle;
  },
  SET_TEXT_COLOR: (state, { textColor }) => {
    state.settings.appearance.text.textColor = textColor
  },
  SET_TEXT_COLOR_INTERIM: (state, { textColorInterim }) => {
    state.settings.appearance.text.textColorInterim = textColorInterim
  },
  SET_FONT_FAMILY: (state, { fontFamily }) => {
    state.settings.appearance.text.fontFamily = fontFamily
  },
  SET_TEXT_SIZE: (state, { textSize }) => {
    state.settings.appearance.text.textSize = textSize
  },
  SET_LINE_HEIGHT: (state, { lineHeight }) => {
    state.settings.appearance.text.lineHeight = lineHeight
  },
  SET_LETTER_SPACING: (state, { letterSpacing }) => {
    state.settings.appearance.text.letterSpacing = letterSpacing
  },
  SET_TEXT_TRANSFORM: (state, { textTransform }) => {
    state.settings.appearance.text.textTransform = textTransform
  },
  SET_SHADOW_COLOR: (state, { shadowColor }) => {
    state.settings.appearance.shadow.color = shadowColor
  },
  SET_SHADOW_OPACITY: (state, { shadowOpacity }) => {
    state.settings.appearance.shadow.opacity = shadowOpacity
  },
  SET_SHADOW_BLUR_RADIUS: (state, { shadowBlurRadius }) => {
    state.settings.appearance.shadow.blurRadius = shadowBlurRadius
  },
  SET_SHADOW_OFFSET_X: (state, { shadowOffsetX }) => {
    state.settings.appearance.shadow.offsetX = shadowOffsetX
  },
  SET_SHADOW_OFFSET_Y: (state, { shadowOffsetY }) => {
    state.settings.appearance.shadow.offsetY = shadowOffsetY
  },
  SET_BACKGROUND_COLOR: (state, { backgroundColor }) => {
    state.settings.appearance.background.color = backgroundColor
  },
  SET_ALIGNMENT_HORIZONTAL: (state, { alignmentHorizontal }) => {
    state.settings.appearance.text.alignment.horizontal = alignmentHorizontal
  },
  SET_ALIGNMENT_VERTICAL: (state, { alignmentVertical }) => {
    state.settings.appearance.text.alignment.vertical = alignmentVertical
  },
  SET_ALIGNMENT_PADDING: (state, { alignmentPadding }) => {
    state.settings.appearance.text.alignment.padding = alignmentPadding
  },
  TEXT_SIZE_INCREASE: (state) => {
    state.settings.appearance.text.textSize = parseFloat(state.settings.appearance.text.textSize) + 0.1;
  },
  TEXT_SIZE_DECREASE: (state) => {
    state.settings.appearance.text.textSize = parseFloat(state.settings.appearance.text.textSize) - 0.1;
  },


  SET_CONNECT_ID: (state, { connectId }) => {
    state.connectId = connectId;
  },
  SET_ROOM_LEADER_TOKEN: (state, { roomLeaderToken }) => {
    state.settings.roomLeaderToken = roomLeaderToken;
  },
  SET_REMOTE_DISPLAYS: (state, { remoteDisplays }) => {
    state.remoteDisplays = remoteDisplays;
  },
  SET_ROOM_MEMBERSHIP_ID: (state, { roomMembershipId }) => {
    state.settings.roomMembershipId = roomMembershipId;
    state.connectId = null;
  },
  SET_REMOTE_DISPLAY_CONNECTED_ID_NOT_FOUND_ERROR: (state, { on }) => {
    state.remoteDisplayConnectIdNotFoundError = on;
    state.remoteDisplayConnectIdFoundMessage = false;
  },
  SET_REMOTE_DISPLAY_CONNECTED_ID_FOUND_MESSAGE: (state, { on }) => {
    state.remoteDisplayConnectIdFoundMessage = on;
    state.remoteDisplayConnectIdNotFoundError = false;
  },


  SET_LAYOUT_LARGER: (state, { on }) => {
    state.settings.controls.layout.larger = Boolean(on);
  },

  ADD_WORD_REPLACEMENT (state, { wordReplacement }) {
    state.settings.wordReplacements.push(wordReplacement);
  },

  REMOVE_WORD_REPLACEMENT (state, { index }) {
      state.settings.wordReplacements.splice(index, 1);
  },

  UPDATE_WORD_REPLACEMENT (state, { wordReplacement, index }) {
      state.settings.wordReplacements[index] = wordReplacement;
  },
  

  SET_CENSOR: (state, { censor }) => {
    state.settings.censor.on = censor
  },
  SET_CENSOR_REPLACE_WITH: (state, { replaceWith }) => {
    state.settings.censor.replaceWith = replaceWith
  },


  SET_LOCALE_USER_DEFAULT: (state, { locale }) => {
    state.settings.locale.userDefault = locale
  },

  SET_LOCALE_FROM: (state, { locale }) => {
    state.settings.locale.from = locale
  },


  SET_CHROMECAST_CONNECTED: (state, { chromecastConnected }) => {
    state.receivers.chromecast.connected = chromecastConnected;
  },
  SET_CHROMECAST_CONNECTING: (state, { chromecastConnecting }) => {
    state.receivers.chromecast.connecting = chromecastConnecting;
  },
  SET_CHROMECAST_RECEIVER_NAME: (state, { receiverName }) => {
    state.receivers.chromecast.receiverName = receiverName;
  },

  SET_DETACHED_MODE_ON: (state) => {
    state.detached = true;
  },

  SET_DETACHED_MODE_OFF: (state) => {
    state.detached = false;
  },

  SET_LAST_WHATS_NEW_VERSION_SEEN: (state, { version }) => {
    state.settings.lastWhatsNewVersionSeen = version;
  },

  SET_INCOMPATIBLE_BROWSER_ON: (state) => {
    state.incompatibleBrowser = true;
  },

  SET_INCOMPATIBLE_BROWSER_MODAL_VISIBLE: (state) => {
    state.incompatibleBrowserModalVisible = true;
  },

  SET_INCOMPATIBLE_BROWSER_MODAL_INVISIBLE: (state) => {
    state.incompatibleBrowserModalVisible = false;
  },

  ADD_EXPERIMENT: (state, { experiment }) => {
    if (!state.settings.exp.includes(experiment)) {
      state.settings.exp.push(experiment);
    }
  },

  REMOVE_EXPERIMENT: (state, { experiment }) => {
    state.settings.exp = state.settings.exp.filter((e) => {
      return e != experiment;
    });
  },


  SOCKET_ONOPEN (state, event)  {
    state.socket.isConnected = true
  },
  SOCKET_ONCLOSE (state, event)  {
    state.socket.isConnected = false
  },
  SOCKET_ONERROR (state, event)  {
    // console.error(state, event)
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE (state, message)  {
    console.log('socket onmessage');
    console.log(message);
    // state.message = message
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.log('socket reconnect');
    // console.info(state, count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    console.log('socket reconnect error');
    // state.socket.reconnectError = true;
  },


  SET_SEND_TO_VMIX: (state, { on }) => {
    state.settings.integrations.vmix.on = on;
  },
  SET_VMIX_WEB_CONTROLLER_ADDRESS: (state, { webControllerAddress }) => {
    state.settings.integrations.vmix.webControllerAddress = webControllerAddress;
  },
  SET_VMIX_CHROME_EXTENSION_INSTALLED: (state, { installed }) => {
    state.integrations.vmix.chromeExtensionInstalled = Boolean(installed);
  },
  SET_VMIX_WEB_CONTROLLER_CONNECTED: (state, { connected }) => {
    state.integrations.vmix.webControllerConnected = Boolean(connected);
  },
  RESET_WEB_CONTROLLER_CONNECTED_STATUS: (state) => {
    state.integrations.vmix.webControllerConnected = null;
  },
  SET_VMIX_CACHED_INPUT_GUID: (state, { guid }) => {
    state.integrations.vmix.cachedInputGUID = guid;
  },
  SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE: (state, { on }) => {
    state.integrations.vmix.showNotFullySetUpMessage = on;
  },

  SET_WEBHOOKS_ON: (state, { onOrOff }) => {
    state.settings.integrations.webhooks.on = onOrOff;
  },
  SET_WEBHOOKS_URL: (state, { url }) => {
    state.settings.integrations.webhooks.url = url;
  },
  SET_WEBHOOKS_METHOD: (state, { method }) => {
    // Should be one of this set of options; otherwise set default
    let methodValidated = ['POST','PUT'].includes(method) ? method : 'POST';
    state.settings.integrations.webhooks.method = methodValidated;
  },
  SET_WEBHOOKS_THROTTLE_MS: (state, { throttleMs }) => {
    let throttleMsValidated = Number(throttleMs);
    if (Number.isNaN(throttleMsValidated)) {
      throttleMsValidated = 0;
    }
    if (throttleMsValidated > 60000) {
      throttleMsValidated = 60000;
    }

    state.settings.integrations.webhooks.throttleMs = throttleMsValidated;
  },
  APPEND_WEBHOOK_LOG: (state, { event }) => {
    state.integrations.webhooks.log.push(event);
  },

  SET_EVENT_LOG: (state, { eventLog }) => {
    state.eventLog.log = eventLog;
  },

  APPEND_EVENT_LOG: (state, { event }) => {
    if (Date.now() < state.eventLog.onUntilStopTime) {
      state.eventLog.log.push({
        time: Date.now(),
        event: CircularJson.stringify(event),
      });
    }
  },

  SET_EVENT_LOG_STOP_TIME: (state, { stopTime }) => {
    state.eventLog.onUntilStopTime = stopTime;
  },
  
}
