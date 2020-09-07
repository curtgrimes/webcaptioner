<template>
  <div class="settings-event-log-view">
    <!-- <p>
      <i18n path="settings.eventLog.instructions.i0" tag="span">
        <a
          place="sendItToMeOnFacebook"
          href="https://m.me/webcaptioner"
        >{{$t('settings.eventLog.instructions.sendItToMeOnFacebook')}}</a>
      </i18n>
    </p> -->
    <p>
      {{ $t('settings.eventLog.instructions.i1', { loggingDurationMinutes }) }}
    </p>
    <div class="card bg-white mb-3">
      <div class="card-header px-3">
        <div class="row">
          <div class="col-lg-4">
            <b-button
              size="sm"
              v-if="!copyLogMode"
              variant="secondary"
              class="mr-2"
              @click="copyLogMode = true"
              >{{ $t('settings.eventLog.copyLog') }}</b-button
            >
            <b-button
              size="sm"
              v-if="copyLogMode"
              variant="outline-secondary"
              class="mr-2"
              @click="copyLogMode = false"
              >{{ $t('common.done') }}</b-button
            >
            <b-button
              class="d-lg-none"
              size="sm"
              v-if="tickInterval"
              variant="danger"
              @click="stopLogging()"
              >{{ $t('settings.eventLog.stopLogging') }}</b-button
            >
            <b-button
              class="d-lg-none"
              size="sm"
              v-if="!tickInterval"
              variant="default"
              @click="initEventLog()"
              >{{ $t('settings.eventLog.restartLogging') }}</b-button
            >
          </div>
          <div class="col-lg-8 small text-lg-right">
            <span class="pt-2 pr-2 d-inline-block">
              <span v-if="tickInterval">{{
                $t('settings.eventLog.loggingTurnsOffIn', {
                  timeRemainingMinutes,
                  timeRemainingSeconds,
                })
              }}</span>
              <span v-else>{{ $t('settings.eventLog.loggingOff') }}</span>
            </span>
            <b-button
              class="d-none d-lg-inline-block"
              size="sm"
              v-if="tickInterval"
              variant="danger"
              @click="stopLogging()"
              >{{ $t('settings.eventLog.stopLogging') }}</b-button
            >
            <b-button
              class="d-none d-lg-inline-block"
              size="sm"
              v-if="!tickInterval"
              variant="default"
              @click="initEventLog()"
              >{{ $t('settings.eventLog.restartLogging') }}</b-button
            >
          </div>
        </div>
      </div>
      <div v-show="copyLogMode">
        <textarea
          class="form-control text-monospace"
          v-model="eventLogString"
          style="height:40vh;overflow-y:auto;resize:none;font-size:50%;"
          readonly="readonly"
          ref="copyLogTextarea"
          @mousedown="focusAndSelectCopyTextarea()"
          @blur="copyLogMode = false"
        ></textarea>
      </div>
      <div
        v-show="!copyLogMode"
        class="list-group list-group-flush small"
        style="max-height:40vh;overflow-y:auto;"
        ref="eventLogWrap"
        @wheel="autoscroll = false"
      >
        <li
          v-if="notShowingCount > 0"
          class="list-group-item list-group-item-light py-3 text-muted text-center"
        >
          {{ $t('settings.eventLog.eventsHidden', { notShowingCount }) }}
        </li>
        <li
          class="list-group-item list-group-item-light p-2 text-monospace"
          v-for="(eventLogItem, index) in eventLogLimited"
          :key="index"
        >
          <div class="row m-0">
            <div class="col-sm-2">{{ formatLogTime(eventLogItem.time) }}</div>
            <div class="col-sm-9" style="word-break:break-all">
              {{ eventLogItem.event }}
            </div>
          </div>
        </li>
      </div>
      <div class="card-footer text-muted small">
        <div class="row">
          <div class="col-6">
            {{
              $tc('settings.eventLog.events', eventLog.length, {
                count: eventLog.length,
              })
            }}
          </div>
          <div class="col-6 text-right">
            <label class="mb-0">
              <input
                type="checkbox"
                v-model="autoscroll"
                style="position:relative;top:-1px;"
                class="mr-1"
              />
              {{ $t('settings.eventLog.autoScroll') }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  components: {
    BButton,
  },
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.eventLog.eventLog',
  },
  data: function() {
    return {
      autoscroll: true,
      loggingDurationMinutes: 15,
      timeRemainingMinutes: 0,
      timeRemainingSeconds: 0,
      tickInterval: null,
      copyLogMode: false,
    };
  },
  mounted: function() {
    if (!this.eventLogStopTime && this.eventLog.length <= 0) {
      this.initEventLog();
    } else {
      this.scrollLogToBottom();
      this.startTimer();
    }
  },
  destroyed: function() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  },
  watch: {
    eventLog: function() {
      this.scrollLogToBottom();
    },
    autoscroll: function() {
      if (this.autoscroll) {
        this.scrollLogToBottom();
      }
    },
    copyLogMode: function() {
      if (this.copyLogMode) {
        this.focusAndSelectCopyTextarea();
      }
    },
  },
  methods: {
    initEventLog: function() {
      // Must set up timer first before appending to log -- log mutation won't append
      // if timer isn't ending in future.
      this.eventLogStopTime =
        Date.now() + 1000 * 60 * this.loggingDurationMinutes;
      this.startTimer();

      this.eventLog = [];
      this.appendToEventLog({
        state: JSON.parse(JSON.stringify(this.$store.state)),
      });
      this.appendToEventLog({ system: navigator.userAgent });
    },
    startTimer: function() {
      let logTick = () => {
        let now = Date.now();
        if (now < this.eventLogStopTime) {
          let minutesDecimal = (this.eventLogStopTime - Date.now()) / 1000 / 60;
          this.timeRemainingMinutes = (
            Math.floor(minutesDecimal) + ''
          ).padStart(2, '0');
          this.timeRemainingSeconds = (
            Math.floor((minutesDecimal - this.timeRemainingMinutes) * 60) + ''
          ).padStart(2, '0');
        } else {
          this.stopLogging();
        }
      };

      if (Date.now() < this.eventLogStopTime) {
        logTick();
        this.tickInterval = setInterval(logTick, 100);
      }
    },
    scrollLogToBottom: function() {
      if (this.$refs.eventLogWrap && this.autoscroll) {
        this.$nextTick(() => {
          this.$refs.eventLogWrap.scrollTop = this.$refs.eventLogWrap.scrollHeight;
        });
      }
    },
    focusAndSelectCopyTextarea: function() {
      if (this.$refs.copyLogTextarea) {
        this.$nextTick(() => {
          this.$refs.copyLogTextarea.focus();
          this.$refs.copyLogTextarea.select();
        });
      }
    },
    formatLogTime: function(ms) {
      return new Date(ms).toISOString().substr(11, 8);
    },
    appendToEventLog: function(event) {
      this.$store.commit('APPEND_EVENT_LOG', { event });
    },
    stopLogging: function() {
      this.eventLogStopTime = null;
      this.timeRemainingMinutes = this.timeRemainingSeconds = '00';
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    },
  },
  computed: {
    notShowingCount: function() {
      return this.eventLog.length - this.eventLogLimited.length;
    },
    eventLogLimited: function() {
      return this.$store.state.eventLog.log
        ? this.$store.state.eventLog.log.slice(-100)
        : [];
    },
    eventLog: {
      get: function() {
        return this.$store.state.eventLog.log;
      },
      set: function(eventLog) {
        this.$store.commit('SET_EVENT_LOG', { eventLog });
      },
    },
    eventLogString: function() {
      return JSON.stringify(this.eventLog);
    },
    eventLogStopTime: {
      get: function() {
        return this.$store.state.eventLog.onUntilStopTime;
      },
      set: function(stopTime) {
        this.$store.commit('SET_EVENT_LOG_STOP_TIME', { stopTime });
      },
    },
  },
};
</script>
