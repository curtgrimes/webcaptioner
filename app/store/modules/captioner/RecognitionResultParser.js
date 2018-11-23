import escapeRegExp from 'lodash.escaperegexp'

export default class {
    constructor () {
        this.wordReplacements = [];
    }

    getTranscript(recognitionResultEvent) {
        let transcriptInterim = '',
            transcriptFinal = '';

        const makeReplacements = (text) => {
            for (let i = 0; i < this.wordReplacements.length; i++) {
                // $1 and $3 are the leading and trailing whitespace, if any
                text = text.replace(this.wordReplacements[i].fromRegex, '$1' + this.wordReplacements[i].to + '$3');
            }
            return text;
        }
        
        for (let i = recognitionResultEvent.resultIndex; i < recognitionResultEvent.results.length; ++i) {
            if (recognitionResultEvent.results[i].isFinal) {
                transcriptFinal += recognitionResultEvent.results[i][0].transcript;
            } else {
                transcriptInterim += recognitionResultEvent.results[i][0].transcript;
            }
        }

        return {
            transcriptInterim: transcriptInterim ? makeReplacements(transcriptInterim) : null,
            transcriptFinal: transcriptFinal ? makeReplacements(transcriptFinal) : null,
        }
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
