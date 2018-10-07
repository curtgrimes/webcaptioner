import escapeRegExp from 'lodash.escaperegexp'

export default class {
    constructor ({wordReplacements}) {
        this.wordReplacements = wordReplacements || [];

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

    getTranscript(recognitionResultEvent) {
        let transcriptInterim = '',
            transcriptFinal = '';

        const makeReplacements = (text) => {
            for (let i = 0; i < this.wordReplacements.length; i++) {
                text = text.replace(this.wordReplacements[i].fromRegex, this.wordReplacements[i].to);
            }
            return text;
        }
        
        for (var i = recognitionResultEvent.resultIndex; i < recognitionResultEvent.results.length; ++i) {
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
};
