<template>
    <div class="bg-primary" style="height:100vh">
        <div style="z-index:5;position:absolute;left:0;right:0;top:0;bottom:0">
            <div class="text-container">
                <div class="display-3 w-75">
                    {{$t('receiver.splash.captionsWillBeginShortly')}}
                </div>
            </div>
            <div class="h-25 d-flex align-items-center " style="position:absolute;left:7vw;right:0;bottom:0">
                <div class="h2 logo-container">
                    <img src="/static/img/logo-wordmark-inverse.svg" class="d-inline-block" :alt="$t('app.webCaptioner')" />
                </div>
            </div>
        </div>
        <div class="h-25 bg-primary bg-zigzag bottom-zigzag-background" style="z-index:4;position:absolute;left:0;right:0;bottom:0"></div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
    .text-container {
        position:absolute;
        left:7vw;
        top:10vh;
        right:7vw;
    }
    .logo-container img {
        height:7vw;
        max-height:4rem;
        min-height:3rem;
    }


    @media (max-height:400px) {
        .bottom-zigzag-background {
            display:none;
        }
    }

    @media (max-height:290px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }

    /* Short and wide */
    @media (max-height:300px) and (min-width:800px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }

    /* Short and wide */
    @media (max-height:370px) and (min-width:1100px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }
</style>