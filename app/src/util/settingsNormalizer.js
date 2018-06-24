import changelog from '../data/changelog.js'
import compareVersions from 'semver-compare'

function getCurrentVersionNumber() {
    let sortedChangelog = changelog.sort(function (changelogEntryA, changelogEntryB) {
        return compareVersions(changelogEntryA.version, changelogEntryB.version);
    });
    return sortedChangelog[0].version;
}

export function normalizeSettings({ localStorageData, fromVersionNumber }) {
    const currentVersionNumber = getCurrentVersionNumber();

    if (compareVersions(fromVersionNumber, currentVersionNumber) === -1) { // Pre-2.0.0
        console.log('converting settings');
        // Pre-2.0.0 sample
        // {"appearance":{"text-typeface":"Concert One","text-color":"#ccf9ff","text-color-interim-choice":"same-as-text-color","text-color-interim":"#fffeaf","text-size":"3.2","line-height":"3.8","letter-spacing":"0","capitalization":"capitalize","text-shadow-color":"#1800ff","text-shadow-opacity":"100","text-shadow-x-position":"0.25","text-shadow-y-position":"0.25","text-shadow-blur":"0","background-color":"#0004a9","chroma-key-color":"#00ff00","text-background-transparent":false,"horizontal-alignment":"full","vertical-alignment":"full","padding":"1.25"},"version":"1","vmix":{"on":true,"address":"http://192.168.88.58:8088"},"wordReplacements":[{"find":"a","replacement":"b"},{"find":"c","replacement":"d"}],"censorProfanity":false}
        return {
            appearance: {
                text: {
                    textColor: localStorageData.appearance['text-color'],
                    textColorInterim:  localStorageData.appearance['text-color-interim'],
                    fontFamily: localStorageData.appearance['text-typeface'],
                    textSize: localStorageData.appearance['text-size'],
                    lineHeight: localStorageData.appearance['line-height'],
                    letterSpacing:  localStorageData.appearance['letter-spacing'],
                    textTransform:  localStorageData.appearance['capitalization'],
                    alignment: {
                        horizontal: localStorageData.appearance['horizontal-alignment'],
                        vertical: localStorageData.appearance['vertical-alignment'],
                        padding: localStorageData.appearance['padding'],
                    }
                },
                shadow: {
                    color: localStorageData.appearance['text-shadow-color'],
                    opacity: localStorageData.appearance['text-shadow-opacity'],
                    blurRadius: localStorageData.appearance['text-shadow-blue'],
                    offsetX: localStorageData.appearance['text-shadow-x-position'],
                    offsetY: localStorageData.appearance['text-shadow-y-position'],
                },
                background: {
                    color: localStorageData.appearance['background-color'],
                    // chroma-key-color and text-background-transparent are eliminated in 2.0.0
                },
            },
            wordReplacements: localStorageData.wordReplacements.map((replacement) => {
                return {
                    from: replacement.find,
                    to: replacement.replacement,
                };
            }),
            censor: {
                on: localStorageData.censorProfanity === false ? false : true,
            },
            // locale is omitted because it appears that it wasn't
            // being saved correctly in 1.0
            integrations: {
                vmix: {
                    on: localStorageData.vmix.on,
                    webControllerAddress: localStorageData.vmix.address,
                },
            },
        };
    }
    else {
        // Settings are already at the current version
        return localStorageData.settings;

        // 2.0.0 sample
        // {"settings":{"roomMembershipId":null,"roomLeaderToken":"125a1fba-f375-4692-aca2-1da35fc00e93","controls":{"layout":{"larger":false}},"appearance":{"text":{"textColor":"#ffffff","textColorInterim":"#ffffff","fontFamily":"Cousine","textSize":"4","lineHeight":"1.2","letterSpacing":"0","textTransform":"uppercase","alignment":{"horizontal":"full","vertical":"full","padding":"0.25"}},"shadow":{"color":"#000000","opacity":"100","blurRadius":"0","offsetX":"0.25","offsetY":"0.25"},"background":{"color":"#000000"}},"wordReplacements":[],"censor":{"on":true,"replaceWith":"nothing"},"locale":{"from":"en-US","userDefault":"en-US"},"integrations":{"vmix":{"on":false,"webControllerAddress":""}},"exp":[]},"version":"2.0.0"}
    }
};