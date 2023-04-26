/// <reference types="Cypress"/>
const configData = require('../fixtures/BaseConfigfile.json')

describe('Widgets Test cases', function () {

    beforeEach(function(){
        cy.on("uncaught:exception", () => false)
        cy.visit(configData.baseURL)
        cy.visit(configData.baseURL + 'widgets')
    })

    it('TC04 - Verify the progress bar', function () {
        
        cy.get('div[class="element-list collapse show"] #item-4').click()
        cy.get('#startStopButton').click()
        cy.get('#startStopButton').should('have.text', 'Stop')
        cy.get('#resetButton', { timeout: 15000 }).should('have.text', 'Reset')
    })


    it('TC05 - Verify the tooltips', function () {
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'widgets')
        cy.get('div[class="element-list collapse show"] #item-6').click()
        cy.get('#toolTipButton').trigger('mouseover')
        cy.get('.tooltip-inner').should('have.text', 'You hovered over the Button')
    })

    


})