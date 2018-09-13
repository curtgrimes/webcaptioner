<template>
  <div class="settings-about-view" v-once>
    <div class="card bg-primary">
      <div class="card-body">
        <div class="row">
          <div class="col-3 col-sm-4 col-md-3 mb-3 mb-sm-0">
            <img src="/static/img/logo-inverse.svg" class="img-responsive" />
          </div>
          <div class="col-sm-8 col-md-9">
            <div class="d-flex align-items-center h-100">
              <div>
                <h3>{{$t('app.webCaptioner')}}</h3>
                <p class="lead mb-2">{{$t('app.description')}}</p>
                <p class="mb-0 small"><a href="/">{{$t('settings.about.learnMore')}}</a> &middot; <a href="/help">{{$t('navbar.menu.helpCenter')}}</a><span class="d-none d-md-inline"> &middot; </span><br class="d-md-none"/> <a href="/blog">{{$t('navbar.menu.blog')}}</a> &middot; <a href="/donate">{{$t('navbar.menu.donate')}}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-4" />
    
    <h2>{{$t('settings.about.whatsNew')}}</h2>
    <whats-new/>

  </div>
</template>

<script>
import whatsNew from '~/components/WhatsNew.vue'

export default {
  name: 'settings-about-view',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitleKey: 'settings.about.about',
  },
  components: {
    whatsNew,
  },
}
</script>
