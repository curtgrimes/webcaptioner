import escapeRegExp from 'lodash.escaperegexp'

export default class {
    constructor ({wordReplacements}) {
        this.wordReplacements = wordReplacements || [];
    }

    getTranscript(recognitionResultEvent) {
        let transcriptInterim = '',
            transcriptFinal = '';

        let self = this;
        const makeReplacements = function(text) {
            for (let i = 0; i < self.wordReplacements.length; i++) {
                let fromStrings = self.wordReplacements[i].from.split(',');
                for (let j = 0; j < fromStrings.length; j++) {
                    text = text.replace(new RegExp(escapeRegExp(fromStrings[j]), 'gi'), self.wordReplacements[i].to);
                }
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
