import { getStore } from '../support/utils'

describe('Appearance Settings Page', () => {
    it('has a font size setting', () => {
        cy.visit('/captioner/settings/appearance');

        cy.contains('label', 'Text Size').find('input').should('exist');
    });

    it('changes the font size in the store', () => {
        cy.visit('/captioner/settings/appearance');

        cy.contains('label', 'Text Size').find('input').clear().type('12.2');
    });

    it('transcript uses the font size in the store', () => {

        getStore().then((store) => {
            store.state.settings.appearance.text.textSize = 22.5;
            

            cy.wait('1000');
            expect(document.querySelector('.transcript').style.fontSize).to.equal('22.5em');                
            


        });
    });
});

