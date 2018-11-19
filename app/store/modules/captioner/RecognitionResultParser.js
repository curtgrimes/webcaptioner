import escapeRegExp from 'lodash.escaperegexp'

export default class {
    constructor ({wordReplacements}) {
        this.wordReplacements = wordReplacements || [];
        this.stabilizeInterval = null;
        this.transcriptInterim = '';
        this.transcriptFinal = '';

        // Generate Regex for each replacement
        this.wordReplacements = this.wordReplacements.map((replacement) => {
            let stringsToCensor = (replacement.from || '').split(',');
            stringsToCensor = stringsToCensor.map((stringToCensor) => {
                return escapeRegExp(stringToCensor);
            });
            
            replacement.fromRegex = new RegExp('\\b(' + stringsToCensor.join('|') + ')\\b', 'gi');
            return replacement;
        });
    }

    getTranscript(recognitionResultEvent, onResult) {
        this.transcriptInterim = '';
        this.transcriptFinal = '';

        const makeReplacements = (text) => {
            for (let i = 0; i < this.wordReplacements.length; i++) {
                // $1 and $3 are the leading and trailing whitespace, if any
                text = text.replace(this.wordReplacements[i].fromRegex, '$1' + this.wordReplacements[i].to + '$3');
            }
            return text;
        }
        
        for (let i = recognitionResultEvent.resultIndex; i < recognitionResultEvent.results.length; ++i) {
            if (recognitionResultEvent.results[i].isFinal) {
                this.transcriptFinal += recognitionResultEvent.results[i][0].transcript;
            } else {
                this.transcriptInterim += recognitionResultEvent.results[i][0].transcript;
            }
        }

        this.transcriptInterim =  this.transcriptInterim ? makeReplacements(this.transcriptInterim) : null;
        this.transcriptFinal =  this.transcriptFinal ? makeReplacements(this.transcriptFinal) : null;

        console.log('------>' + this.transcriptInterim);

        let getStableTranscript = (assumeAllStable) => {
            let transcriptStable = this.interimTranscriptArray
                .slice(
                    this.firstUnsentWordIndex,
                    assumeAllStable
                        ? this.interimTranscriptArray.length
                        : this.interimFirstUnstableWordIndex
                )
                .map((interimObject) => {
                    return interimObject.word;
                })
                .join(' ');
            
            console.log('<------' + transcriptStable);
            
            this.firstUnsentWordIndex = this.interimFirstUnstableWordIndex;

            return transcriptStable;
        };

        let parseTranscriptIntoArrayToBeCursoredThrough = (transcript) => {
            this.transcriptSplitByWord = transcript.split(' ');

            let firstSeen = Date.now();

            for (let i = 0, length = this.transcriptSplitByWord.length; i < length; i++) {
                let word = this.transcriptSplitByWord[i];
                if (
                    typeof this.interimTranscriptArray[i] === 'undefined' // nothing exists at this index yet in our stabilized array
                    || ( // or a word was previously set and it doesn't match this new incoming word
                        this.interimTranscriptArray[i].word
                        && this.interimTranscriptArray[i].word !== word
                    )
                ) {
                    // Set the word in our stabilized array
                    this.interimTranscriptArray[i] = {
                        word,
                        firstSeen,
                    }
                }
            }
        };

        if (this.transcriptInterim && !this.stabilizeInterval) {
            this.interimTranscriptArray = [];
            this.interimFirstUnstableWordIndex = 0;
            this.firstUnsentWordIndex = 0;
            this.stabilizedThresholdMs = 1500; // word must be unchaged for this many MS before being considered stable

            console.log('init new interval');
            this.stabilizeInterval = setInterval(() => {
                console.log('interval');

                parseTranscriptIntoArrayToBeCursoredThrough(this.transcriptInterim || this.transcriptFinal);

                // Go through the array and put the cursor up to the last word that's stabilized
                let now = Date.now();
                for (let i = this.firstUnsentWordIndex, length = this.interimTranscriptArray.length; i < length; i++) {
                    if (now < (this.interimTranscriptArray[i].firstSeen + this.stabilizedThresholdMs)) {
                        // word i is the first unstable word
                        this.interimFirstUnstableWordIndex = i;
                        break;
                    }

                    if (i === length - 1) {
                        // We reached the end of the array and it's all stable
                        this.interimFirstUnstableWordIndex = length;
                    }
                }
                
                if (this.interimFirstUnstableWordIndex > this.firstUnsentWordIndex) {
                    onResult({
                        transcriptFinal: getStableTranscript()
                    });
                }
            }, 100);
        }

        if (this.transcriptFinal) {
            console.log('FINAL');
            console.log(this.transcriptFinal);
            parseTranscriptIntoArrayToBeCursoredThrough(this.transcriptFinal);
            onResult({
                transcriptFinal: getStableTranscript({assumeAllStable: true})
            });
            this.interimFirstUnstableWordIndex = 0;
            this.firstUnsentWordIndex = 0;
            this.stop();
        }
        
        // Old way
        // onResult({
        //     transcriptInterim: this.transcriptInterim,
        //     transcriptFinal: this.transcriptFinal,
        // });
    }

    stop() {
        console.log('stop');
        // clearInterval(this.stabilizeInterval);
        // this.stabilizeInterval = null;
        // this.interimFirstUnstableWordIndex = 0;
        // this.firstUnsentWordIndex = 0;
    }

    setWordReplacements ({wordReplacements}) {
        // Generate Regex for each replacement
        this.wordReplacements = (wordReplacements || []).map((replacement) => {
            let stringsToCensor = (replacement.from || '').split(',');
            stringsToCensor = stringsToCensor.map((stringToCensor) => {
                return escapeRegExp(stringToCensor);
            });
            
            replacement.fromRegex = new RegExp('(^|\\b|\\s)(' + stringsToCensor.join('|') + ')(\\b|\\s|$)', 'gi');
            return replacement;
        });
    }
};
