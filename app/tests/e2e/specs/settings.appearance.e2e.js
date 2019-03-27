import { getStore } from '../support/utils'

describe('Appearance Settings Page', () => {
    it('changes the transcript text color', () => {
        cy.visit('/captioner/settings/appearance');

        cy.contains('label', 'Text Color').find('input').then($el => {
            $el[0].value = '#00ff00';
            $el[0].dispatchEvent(new Event('input'));
        });
        
        getStore().then((store) => {
            // Change route
            store.$router.push('/captioner');
            cy.get('.transcript').should('have.css', 'color', 'rgb(0, 255, 0)');
        });
    });

    it('changes the transcript interim text color', () => {
        cy.visit('/captioner/settings/appearance');

        cy.contains('label', 'Interim Text Color').find('input').then($el => {
            $el[0].value = '#00ffff';
            $el[0].dispatchEvent(new Event('input'));
        });
        
        getStore().then((store) => {
            // Change route
            store.$router.push('/captioner');
            store.state.captioner.transcript.interim = 'Interim';

            cy.get('[data-test="transcriptInterim"]').should('have.css', 'color', 'rgb(0, 255, 255)');
        });
    });

    it('changes the transcript text size', () => {
        cy.visit('/captioner/settings/appearance');
        cy.contains('label', 'Text Size').find('input').clear().type('12.2');

        getStore().then((store) => {
            // Change route
            store.$router.push('/captioner');
            
            // Convert em to px; assume base of 16px
            cy.get('.transcript').should('have.css', 'font-size', (12.2 * 16) + 'px');
        });
    });

    it('changes the transcript line height', () => {
        cy.visit('/captioner/settings/appearance');
        cy.contains('label', 'Line Height').find('input').clear().type('5.1');

        getStore().then((store) => {
            // Change route
            store.$router.push('/captioner');
            
            // Convert em to px
            cy.get('.transcript').should('have.css', 'line-height', (5.1 * 64) + 'px');
        });
    });

    it('changes the transcript letter spacing', () => {
        cy.visit('/captioner/settings/appearance');
        cy.contains('label', 'Letter Spacing').find('input').clear().type('3.5');

        getStore().then((store) => {
            // Change route
            store.$router.push('/captioner');
            
            // Convert em to px
            cy.get('.transcript').should('have.css', 'letter-spacing', (3.5 * 64) + 'px');
        });
    });
});

