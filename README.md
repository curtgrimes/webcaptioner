<p align="center">
  <img src="./app/static/og-logo.png" alt="Web Captioner" width="300">
<br>
</p>

<h3 align="center">Web Captioner</h3>

<p align="center">A former speech-to-text app by <a href="https://curtgrimes.com">Curt Grimes</a>.</p>

# Web Captioner

Web Captioner was a speech-to-text service using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) that existed at webcaptioner.com from 2017 until October 31, 2023.

## No longer maintained

**⚠️ This project is [no longer maintained](#development-history).** On October 31, 2023, I simultaneously sunset the project and released its source here. If you were a user of Web Captioner, your support over the years has been greatly appreciated!

I recommended exploring alternatives to Web Captioner which are better maintained and more fully featured, including built-in speech-to-text tools available on many of today's devices.

The release of this source code may lead to derivative versions of Web Captioner, over which I have no control, so use them at your own discretion.

## Features

- Provides a web interface for using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) for speech-to-text conversion. Focused on Google Chrome support only.
- Provides a unique link to captions to display on other devices or in other applications (like in streaming applications that can embed a webpage). Requires [Redis server](#redis-server).
- Integrates with vMix, YouTube, FAB Subtitler, Dropbox, Zoom, and OBS Studio. Some integrations are incomplete or broken.
- Send captions to Chromecast devices.
- Configure speech recognition language (but no translation between languages).
- Configure the appearance of captions displayed on a screen.
- Configure word replacements for frequently misunderstood words.
- Export and restore configuration settings.
- Keyboard shortcuts for starting/stopping captions.
- Heuristics for "undoing" censorship applied by Google Chrome's implementation of the Web Speech API.
- Convert the output from the Web Speech API into a SRT file (experimental).

## Running the project

The bulk of the Web Captioner project (which was previously available at webcaptioner.com/captioner) is a [Vue 2](https://v2.vuejs.org/) / [Nuxt (version 2)](https://v2.nuxt.com/) app located under the `./app` folder. There are [earlier iterations](#development-history) that do not use Nuxt.

**⚠️ Warning: This project has outdated dependencies.** The most active development this project had was in 2017 through 2020, so there are now many outdated dependencies. Make sure you understand the security implications of running this as-is. I do not provide support.

### Prerequisites

1. **Node 12.2.0** - This runs successfully with Node 12.2.0 (If you have [nvm](https://github.com/nvm-sh/nvm) you can run `nvm install 12.2.0`.) I have not verified compatibility with other Node versions, so it may work with other versions.
1. **Python 2** - To build some dependencies you will need Python 2 available in your environment. (If you are on a recent version of macOS that does not have Python 2 installed, here is [one way to install Python 2 on macOS](https://dev.to/jordicuevas/how-to-install-python2-in-a-macbook-m1-with-brew-bhi).)

### Local development server

To run the Nuxt.js development server:

1. Clone this repository
1. Make sure you meet the [prerequisites above](#prerequisites)
1. `cd ./app`
1. Run `npm i`
1. Copy the file `.env.sample` to `.env` and fill in any env as necessary. (You can run a good portion of the project without filling in any.)
1. Run `npm run dev`
1. Load the website **in Google Chrome** at the path printed to the console.
1. You will need to update Chrome to treat your dev server as a secure origin in order for Chrome to allow you to grant the page the microphone permission:
   1. Type **chrome://flags/#unsafely-treat-insecure-origin-as-secure** in the address bar
   1. Copy and paste the dev server origin (something that looks like http://192.168.1.200:8080) into the text box.
   1. Click "Enable" next to the text box.
   1. Save and relaunch the browser.

### Docker

For those that are interested, there is an older [Dockerfile](Dockerfile) (not used in more recent [iterations of Web Captioner](#development-history)) that could be used as a starting point for a more robust Dockerfile.

These commits at a much earlier point in the codebase where I was doing some Docker work might be helpful:

1. [cad70d18 - Dockerize app and add deployment to AWS](https://github.com/curtgrimes/webcaptioner/commit/cad70d18b5c93a15840c6397014dd1f999449604) (Dec 25, 2017)
1. [1ba6ceb4 - Add docker-compose file](https://github.com/curtgrimes/webcaptioner/commit/1ba6ceb4f2da357da1dbf3ca202f592676f8ee61) (Dec 26, 2017)

### Redis server

The ["share captions by link" feature](#share-captions-by-link-feature) requires a Redis server, but it could be reworked to not require it. If you have a Redis server to provide, update `REDIS_URL` in the `.env` file.

If you are not using this feature, you don't need the Redis server.

### Firebase

This project uses Firebase for user authentication ([Firebase Authentication](https://firebase.google.com/docs/auth/)) and data storage ([Cloud Firestore](https://firebase.google.com/docs/firestore/)). Firebase can be configured with the `FIREBASE_*` environment variables listed in [.env.sample](./app/.env.sample).

Firestore had a "users" collection, and each user record had these properties:

- `settings` - values related to a user's preferences. The user could edit these things through the Web Captioner UI.
- `privileges` - some toggles for experimental features that I would change manually through the Firebase console on a per-user basis.

See [firestore-collection-example.json](./firestore-collection-example.json) for an example of what a user record looked like.

## Contributing

This project is no longer maintained and is not accepting PRs.

You are welcome to [fork this project](https://github.com/curtgrimes/webcaptioner/fork) and use it according to the [MIT license](LICENSE.md).

## Development History

This project is no longer maintained and was open sourced on October 31, 2023.

I have chosen to provide the [full commit history](https://github.com/curtgrimes/webcaptioner/commits/) for those that are interested in seeing the course of Web Captioner's development over the years. Changes related to the static site part of the repo have been removed for simplicity.

Some high level changes that stand out to me when I read through the commit history:

1. [eee704fa](https://github.com/curtgrimes/webcaptioner/commit/eee704faf55b4a62c38776aba071c7ed5efa66b9) (Mar 18, 2017) - The first commit, which used [Google's Web Speech API Demonstration](https://www.google.com/chrome/demos/speech.html) page as a starting point.
1. [2f96e233](https://github.com/curtgrimes/webcaptioner/commit/2f96e233b3a701fda159d14b0c88bd83c8b2c2c4) (Jun 21, 2017) - Starting to add Bootstrap and some other UI improvements.
1. [fc566bd9](https://github.com/curtgrimes/webcaptioner/commit/fc566bd964403c45648c1c84c7b67ce1dbc22c72) (Jul 2, 2017) - Starting to add a blog and other pages on the static site part of the codebase (the static site has been removed from this source code release for simplicity).
1. [cad70d18](https://github.com/curtgrimes/webcaptioner/commit/cad70d18b5c93a15840c6397014dd1f999449604) (Dec 25, 2017) - Dockerize the app and set up some auto deployment to AWS.
1. [f7ab9f88](https://github.com/curtgrimes/webcaptioner/commit/f7ab9f8882f2f1ad979fdfa9897b68510128f084) (Mar 24, 2018) - I began adding (and learning 😉) Vue.
1. [4e0ca506](https://github.com/curtgrimes/webcaptioner/commit/4e0ca5060f1ca52e43401970fa0593d5aad3677b) (Apr 9, 2018) - Added the ability for settings to be saved to local storage.
1. [d7cd5926](https://github.com/curtgrimes/webcaptioner/commit/d7cd59266e5b0f0a4c4ac6bac32c282effeca473) (Apr 10, 2018) - Began working on Chromecast integration (got it working at [bfcab4a1](https://github.com/curtgrimes/webcaptioner/commit/bfcab4a19bff15adae3bd01893ff8d64cabfb244)).
1. [7056ef46](https://github.com/curtgrimes/webcaptioner/commit/7056ef464fa7a39a9050683fb41f73b59a99055c) (May 6, 2018) - Starting vMix integration implementation.
1. [51419d1c](https://github.com/curtgrimes/webcaptioner/commit/51419d1ce2ea6ab2cef669f338b1e0bef4226cde) (Jun 23, 2018) - Add start of an experiments section.
1. [0f04ba61](https://github.com/curtgrimes/webcaptioner/commit/0f04ba61f2ef6e01310b7cdc0834ae20af52e413) (Jun 27, 2018) - Add ability to change fonts.
1. [06fc0e98](https://github.com/curtgrimes/webcaptioner/commit/06fc0e9859e3d46db0cc2da32481423561abe68c) (Aug 31, 2018) - Begin using [Nuxt](https://v2.nuxt.com/).
1. [fea294d6](https://github.com/curtgrimes/webcaptioner/commit/fea294d6a98d1a3b0239a816c3e74bd2dcb10f98) (Sep 1, 2018) - Start adding the ability to call a webhook with caption data.
1. [8e43c17a](https://github.com/curtgrimes/webcaptioner/commit/8e43c17a8bfafaf8ac28b36214ca73d77afa66f9) (Sep 2, 2018) - Add ability to export and restore settings.
1. [83cdb0c0](https://github.com/curtgrimes/webcaptioner/commit/83cdb0c08786fe7ff28ef8553542e63b9c5729e8) and [d8f226cb](https://github.com/curtgrimes/webcaptioner/commit/d8f226cbc0541df420ebeeb684b3b1afea5b2f2c) (Sep 11, 2018) - Add the start of a typing mode which was never completely finished.
1. [fe756717](https://github.com/curtgrimes/webcaptioner/commit/fe7567172df783a838b07e996190bcc554621be0) (Sep 12, 2018) - Begin some work to make the Web Captioner interface support languages other than English.
1. [00b5b2e8](https://github.com/curtgrimes/webcaptioner/commit/00b5b2e84615a91c72c2f0d492b0b39af6c550dc) (Oct 1, 2018) - Initial work supporting the "share captions" feature/experiment.
1. [59855af0](https://github.com/curtgrimes/webcaptioner/commit/59855af09702e14c91158ad4664f2da0be0506bf) (Oct 29, 2018) - Add Dropbox integration.
1. [28ba1a76](https://github.com/curtgrimes/webcaptioner/commit/28ba1a7660ffa626321f0d87c5240d47407b7e89) (Nov 23, 2018) - Add a heuristic for attempting to "undo" censorship applied by Chrome's implementation of the Web Speech API.
1. [28db2c81](https://github.com/curtgrimes/webcaptioner/commit/28db2c81963485c9ef5077468899493dfaf176e8) (Apr 26, 2019) - Start to add Firebase for signing in and saving user settings.
1. [b6728eb9](https://github.com/curtgrimes/webcaptioner/commit/b6728eb995a5d8695f5977f6bf6036723065fc1e) (Apr 30, 2019) - Add ability to have vanity links in the "share captions" feature/experiment.
1. [ac6259eb](https://github.com/curtgrimes/webcaptioner/commit/ac6259eb059a39e016f3329f2be98e90e6186375) (Oct 26, 2019) - Add the start of some work for converting the output from the web speech API into a SRT file. Further improved in [1ceaed2c](https://github.com/curtgrimes/webcaptioner/commit/1ceaed2cc28590af6cfa021b2ad50af23fa87d6f) and [08b40b10](https://github.com/curtgrimes/webcaptioner/commit/08b40b10e9b6f177f1a5c5c563394b29da763267).
1. [cb69766b](https://github.com/curtgrimes/webcaptioner/commit/cb69766bfb1b1214834e9ff1c5a060edf2c0a041) (Jun 14, 2020) - Add start of Zoom integration.
1. [00844325](https://github.com/curtgrimes/webcaptioner/commit/008443258605ed47510f90a183956a31e34557bc) (Jun 23, 2020) - Add experiment where it speaks back what is captioned.
1. [703dd15a](https://github.com/curtgrimes/webcaptioner/commit/703dd15a403c59148c6fd1b0a5046f0ab4ba9496) (Sep 3, 2020) - Start of the work for the "channels" feature to support different integrations.
1. [b2bbc2a4](https://github.com/curtgrimes/webcaptioner/commit/b2bbc2a455d6575179827e6c2d08d30ed883c453) (Sep 3, 2020) - Start of YouTube integration.
1. [9a477bca](https://github.com/curtgrimes/webcaptioner/commit/9a477bca62a1c78c099ecc3059276f16e0a0a1c0) (Sep 7, 2020) - Start of OBS integration.
1. [90e43765](https://github.com/curtgrimes/webcaptioner/commit/90e43765cbfead79fe886adabd73099d85e5516f) (Sep 8, 2020) - Start of FAB Subtitler integration.
1. [fae5f2e4](https://github.com/curtgrimes/webcaptioner/commit/fae5f2e4e00c7d05982ee6f5d0c98217aff673f0) (Jun 3, 2021) - Add ability to scroll up during live transcription and without being snapped back to the bottom.

## Copyright and License

Code and documentation copyright 2017-present by Curt Grimes. Code released under the [MIT License](LICENSE.md).
