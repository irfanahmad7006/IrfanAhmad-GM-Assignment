/// <reference types="Cypress"/>
const configData = require('../fixtures/BaseConfigfile.json')

describe('Interaction Test case', function (){
    beforeEach(function(){
        cy.on("uncaught:exception", () => false)
        cy.visit(configData.baseURL)
        cy.visit(configData.baseURL + 'interaction')
    })

    it('TC06 - Verify user can drag and drop', function () {
        // const dataTransfer = new DataTransfer()
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'interaction')
        cy.get('div[class="element-list collapse show"] #item-3').click()

        cy.get('#droppableExample-tabpane-simple > div > div:nth-child(2)').should('have.text', 'Drop here')

        cy.get('#draggable').drag('#droppableExample-tabpane-simple > div > div#droppable')

        cy.get('#droppableExample-tabpane-simple > div > div:nth-child(2)').should('have.text', 'Dropped!')
        // cy.get('#draggable').trigger('dragstart',{
        //     dataTransfer
        // })
        // cy.get('#droppableExample-tabpane-simple > div > div#droppable').trigger('drop',{
        //     dataTransfer
        // })
    })
})