export default {
    common: {
        ok: 'Ok',
        cancel: 'Cancel',
        clear: 'Clear',
        search: 'Search...',
        close: 'Close',
        add: 'Add',
        remove: 'Remove',
        off: 'Off',
        on: 'On',
        update: 'Update', // verb, like on an "Update" button
        setup: 'Setup', // noun, as in "Viewing a Setup screen"
        showSetup: 'Show Setup',
        hideSetup: 'Hide Setup',
        loading: 'Loading',
        install: 'Install',
        next: 'Next',
        done: 'Done',
    },
    app: {
        webCaptioner: 'Web Captioner',
        description: 'Real-time captioning for your event, speech, classroom lecture, or church service.',
    },
    captioner: {
        volumeMeter: {
            tooLoud: 'Too loud',
            tooQuiet: 'Too quiet',
        },
        clearTranscript: {
            title: 'Clear transcript?',
            ok: 'Clear Transcript',
        },
        saveToFile: {
            title: 'Save to File',
            description: 'Save your current transcript to a file.',
            transcriptEmptyMessage: 'Psst... you know you don\'t have anything to save yet, right?',
            textFile: 'Text File',
            text: 'Text', // short for "Text File"
            wordDocument: 'Word Document', // Microsoft Word
            word: 'Word', // short for "Word Document"
        }
    },
    navbar: {
        captioner: {
            startCaptioning: 'Start Captioning',
            stopCaptioning: 'Stop Captioning',
            listeningToMicrophone: 'Listening to "{microphoneName}"',
            listening: 'Listening',
        },
        menu: {
            about: '@:settings.about.about',
            blog: 'Blog',
            helpCenter: 'Help Center',
            community: 'Community',
            donate: 'Donate',
            feedback: 'Feedback',
            newWindow: 'New Window',
            newWindowDescription: '@:settings.controls.showNewWindow',
            saveToFile: '@:captioner.saveToFile.title',
            settings: 'Settings',
        },
        vmixNotConnected: 'vMix Not Connected',
    },
    settings: {
        settings: 'Settings',
        general: 'General',
        integrations: 'Integrations',
        other: 'Other', // as in an "Other" category of settings
        about: {
            about: 'About',
            learnMore: 'Learn More',
            whatsNew: "What's New",
        },
        eventLog: {
            eventLog: 'Event Log',
            instructions: {
                0:'Reproduce the issue you were having, and then copy this log and {sendItToMeOnFacebook}. The log includes the content of your current transcription, if any. You can leave this page and continue to use Web Captioner like normal.',
                1:'For performance reasons, logging will automatically shut off after {loggingDurationMinutes} minutes. You can still copy the log after it shuts off as long as you don\'t reload the page.',
                sendItToMeOnFacebook: 'send it to me on Facebook',
            },
            copyLog: 'Copy Log',
            stopLogging: 'Stop Logging',
            restartLogging: 'Restart Logging',
            loggingTurnsOffIn: 'Logging turns off in {timeRemainingMinutes}:{timeRemainingSeconds}',
            loggingOff: 'Logging Off', // Short for "Logging is currently off"
            eventsHidden: '{notShowingCount} events are hidden, but they\'ll be included when you copy the log.',
            autoScroll: 'Auto scroll',
            events: 'No events | 1 event | {count} events',
        },
        experiments: {
            experiments: 'Experiments',
            description: 'Be sure to help out and give me feedback about experiments! Email me at {email} or {messageMeOnFacebook}.',
            messageMeOnFacebook: 'message me on Facebook',
            addExperimentConfirmation: 'Do you want to add the "{experimentName}" experiment?',
            addExperiment: 'Add Experiment',
            experimentName: 'Experiment Name',
            alreadyAdded: 'You\'ve already added the "{alreadyAddedExperimentName}" experiment.',
            addedExperiments: 'Added Experiments',
        },
        appearance: {
            appearance: 'Appearance',
            preview: 'Preview',

            text: 'Text',
            textColor: 'Text Color',
            textColorInterim: 'Interim Text Color',
            useRegularTextColor: 'Use Regular Text Color',
            interimTextColorDescription: 'During captioning, words that have just been recognized may change slightly while Web Captioner determines the context of the current phrase. Those words will be this color.',
            fontFamily: 'Font Family',
            textSize: 'Text Size',
            lineHeight: 'Line Height',
            letterSpacing: 'Letter Spacing',
            capitalization: 'Capitalization',
            uppercase: 'UPPERCASE', // This should literally be UPPECASE when possible
            firstLetterOfEachWord: 'First Letter Of Each Word', // The first letter of each word should be capitalized in this text when possible
            properNouns: 'Proper nouns and the start of sentences',
            properNounsDescription: 'Separate sentences are detected only when a puncuation mark like "period" or "question mark" is literally said.',

            alignment: 'Alignment',
            horizontalAlignment: 'Horizontal Alignment',
            verticalAlignment: 'Vertical Alignment',
            full: 'Full',
            left: 'Left',
            middle: 'Middle',
            right: 'Right',
            top: 'Top',
            bottom: 'Bottom',
            lowerThird: 'Lower Third',
            padding: 'Padding',

            background: 'Background',
            backgroundColor: 'Background Color',
            
            textShadow: 'Text Shadow',
            shadowColor: 'Shadow Color',
            opacity: 'Opacity',
            blur: 'Blur',
            xPosition: 'X Position',
            yPosition: 'Y Position',
        },
        censor: {
            censor: 'Censor',
            censorProfaneLanguage: 'Censor profane language.',
            usEnglishOnly: '(Currently available for US English only.)',
            censorProfaneLanguageDescription: {
                // Do not change {seeThisList} or {useWordReplacement} tokens. Those refer to the text on the following two lines.
                text: "What's considered profane? {seeThisList} (note: profanity ahead!) If you need to censor additional words not included in this list, {useWordReplacements}.",
                seeThisList: 'See this list', // Will link to https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words
                useWordReplacements: 'use word replacements', // will link to Word Replacements settings page
            },
            replaceCensoredWordsWith: 'Replace censored words with:',
            nothing: 'Nothing — just omit them.',
            asterisks: 'Asterisks',
        },
        controls: {
            controls: 'Controls',
            screenLayout: 'Screen Layout',
            default: 'Default',
            defaultDescription: 'Regular-sized controls',
            larger: 'Larger',
            largerDescription: 'Larger controls and additional buttons for one-click saving and clearing the transcript',

            keyboardShortcuts: 'Keyboard Shortcuts',
            then: 'then', // Used in explaining a sequence of key presses to execute a keyboard shortcut. Example: "w then c"
            ctrl: 'Ctrl', // Name for "Ctrl" key on keyboard
            shift: 'Shift', // Name for "Shift" key on keyboard
            toggleCaptioning: 'Toggle captioning on/off',
            toggleFullscreen: 'Toggle fullscreen mode on/off',
            showNewWindow: 'Show captions in a new window',
            openSettings: 'Open Settings',
            increaseTextSize: 'Increase text size',
            decreaseTextSize: 'Decrease text size',
            openSave: 'Open "Save as File" dialog',
            clearTranscript: 'Clear transcript',
            listKeyboardShortcuts: 'List keyboard shortcuts',
        },
        language: {
            language: 'Language',
            description: {
                text: 'Web Captioner will recognize speech in this language. Learn more about {supportedLanguagesAndDialects}.', // do not change {supportedLanguagesAndDialects}
                supportedLanguagesAndDialects: 'supported languages and dialects', // will link to https://webcaptioner.com/help/general/supported-languages/
            },
            selectALanguage: 'Select a Language',

        },
        remoteDisplays: {
            remoteDisplays: 'Remote Displays',
        },
        wordReplacements: {
            wordReplacements: 'Word Replacements',
            description: 'Replace or hide specific words or phrases during captioning.',
            wordOrPhraseToReplace: 'Word or Phrase to Replace',
            wordOrPhraseToReplaceSentenceCase: 'Word or phrase to replace',
            wordOrPhraseToReplaceDescription: 'Separate multiple words or phrases with commas. Not case sensitive.',
            replaceWith: 'Replace With',
            replaceWithSentenceCase: 'Replace with',
            addAnother: 'Add Another',
        },
        vmix: {
            vmix: 'vMix', // Product name; should probably remain 'vMix'
            description: {
                text: "{vMix} is a popular software video mixer and switcher. You can send text directly to vMix and display it in a title input. You can then use vMix's font and color controls to style captioned text. {visitTheHelpCenter} to learn more.",
                // {vMix} links to https://vmix.com/
                // {visitTheHelpCenter} links to https://webcaptioner.com/vmix
                visitTheHelpCenter: 'Visit the Help Center',
            },
            connectedToVmix: 'Connected to vMix!',
            connected: 'Connected',

            captionsWillAppear: '{startCaptioning} and your captions will now appear in vMix.',
            startCaptioning: 'Start captioning',

            connectToVmix: 'Connect to vMix',
            sendTestMessage: 'Send Test Message',
            sent: 'Sent!',

            step1: 'Step 1',
            step2: 'Step 2',
            step3: 'Step 3',
            completeStep1First: 'Complete step 1 first',
            completeStep2First: 'Complete step 2 first',
            completeSteps1And2First: 'Complete steps 1 and 2 first',

            installChromeExtension: 'Install Chrome Extension',
            installChromeExtensionDescription: 'The Web Captioner Connector extension for Google Chrome lets Web Captioner connect to vMix.',
            addToChrome: 'Add to Chrome',
            extensionInstalled: 'Extension Installed',
            extensionNotInstalled: 'Extension not installed.',

            // This refers to the "Web Controller" feature in the vMix software: https://www.vmix.com/knowledgebase/article.aspx/81/vmix-web-controller
            // This should probably remain "vMix Web Controller" in all languages unless vMix themselves have translated their software and have a translation for it (I did not find one)
            vmixWebController: 'vMix Web Controller',
            webControllerAddress: 'vMix Web Controller Address',
            webController: 'Web Controller',
            enableVmixWebController: 'Enable the vMix Web Controller',
            enableVmixWebControllerInstructions: 'In vMix, go to {settingMenu}. Check the box to enable the {webController}. Specify a port number or accept the default.',
            enableVmixWebControllerSettingMenu: 'Settings > Web Controller',
            provideAddress: 'Provide the address that appears in vMix:',
            example: 'Example:',
            cannotConnect: 'Cannot connect to vMix at "{webControllerAddress}". Make sure Web Controller is enabled in vMix and that you\'ve copied over the website address correctly. It should look something like this: http://192.168.1.1:8080',

            import: 'Import',
            importTitleTemplate: 'Import Title Template',
            webCaptionerTitleTemplate: 'Web Captioner Title Template',
            importTitleTemplateLonger: 'Import the Web Captioner Title Template into vMix',
            webCaptionerVmixTitleTemplate: 'Web Captioner vMix',
            importTitleTemplateInstructions: {
                0: 'Download the {webCaptionerTitleTemplate} for vMix.',
                1: 'In vMix, go to {addInputSetting}.',
                2: 'In the {inputSelect} window, click {browse} in the upper right and open the Web Captioner title template you downloaded.',
                3: 'The title will appear in the {recent} tab. Double-click it.',
                4: 'In the Title Editor that appears, optionally customize font and text size. Close it when you are finished.',
            },
            cantFindTemplate: "Web Captioner can connect to vMix, but it can't find the Web Captioner title template in an input.",
            testAndFinishSetup: 'Test and Finish Setup',
        },
        webhooks: {
            webhooks: 'Webhooks',
        },
        exportRestore: {
            exportRestoreSettings: 'Export/Restore Settings',
            
            restore: 'Restore',
            restoreDescription: 'Restore settings (appearance, censor settings, word replacements, vMix settings, etc.) from a settings file you previously exported.',
            restoreSettingsQuestion: 'Restore settings from this file?',
            somethingWrongWithFile: "It looks like something's wrong with that file.",
            restoredSettings: 'Settings Restored',

            reset: 'Reset',
            resetDescription: 'Reset all of your settings.',
            resetSettingsQuestion: 'Reset all your settings?',
            settingsWillBeLost: 'All of your current settings will be lost.',
            settingsReset: 'Settings Reset', // Short for "Your settings were reset"

            export: 'Export',
            exportDescription: 'Your settings will be saved locally as a JSON file.',
        },
    }
}