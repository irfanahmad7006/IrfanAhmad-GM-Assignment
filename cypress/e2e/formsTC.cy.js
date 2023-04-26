/// <reference types="Cypress"/>
const configData = require('../fixtures/BaseConfigfile.json')
const testData = require('../fixtures/TestData.json')
const formTestData = require('../fixtures/formTestData.json')

describe('Form Test cases', function () {

    beforeEach(function(){
        cy.on("uncaught:exception", () => false)
        cy.visit(configData.baseURL)
        cy.visit(configData.baseURL + 'forms')
    })


    it('TC03 - Verify user can submit the form', function () {
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'forms')
        cy.get('div[class="element-list collapse show"] #item-0').click()
        cy.get('#firstName').clear().type(formTestData.firstName)
        cy.get('#lastName').clear().type(formTestData.lastName)
        cy.get('#userEmail').clear().type(formTestData.email)
        cy.get('#genterWrapper').contains(formTestData.gender).click()
        cy.get('#userNumber').clear().type(formTestData.mobile)
        cy.get('#dateOfBirthInput').click()

        cy.get('.react-datepicker__month-select').select('January');
        cy.get('.react-datepicker__year-select').select('1990')
        cy.get('div.react-datepicker__month').contains('15').click();

        cy.get('#subjectsContainer').click().type(formTestData.subject)

        cy.get('#hobbiesWrapper').contains(formTestData.hobbies).click()

        cy.get('#uploadPicture').attachFile('samplePic.jpg')

        cy.get('#currentAddress').clear().type(formTestData.currentAddress)


        cy.get('#state').click().type(formTestData.city+'{enter}')
        cy.get('#city').click().type(formTestData.state+'{enter}')

        cy.get('#subjectsContainer').click().type(formTestData.subject+'{enter}')

        // cy.get('#submit', {timeout:9000000}).click()

        cy.get('div#example-modal-sizes-title-lg').should('have.text','Thanks for submitting the form')

        cy.get('tbody tr:nth-child(1) > td:nth-child(2)').should('have.text',formTestData.firstName+' '+formTestData.lastName)
        cy.get('tbody tr:nth-child(2) > td:nth-child(2)').should('have.text',formTestData.email)
        cy.get('tbody tr:nth-child(3) > td:nth-child(2)').should('have.text',formTestData.gender)
        cy.get('tbody tr:nth-child(4) > td:nth-child(2)').should('have.text',formTestData.mobile)
        cy.get('tbody tr:nth-child(5) > td:nth-child(2)').should('have.text','15 January,1990')
        cy.get('tbody tr:nth-child(6) > td:nth-child(2)').should('have.text',formTestData.subject)
        cy.get('tbody tr:nth-child(7) > td:nth-child(2)').should('have.text',formTestData.hobbies)
        cy.get('tbody tr:nth-child(8) > td:nth-child(2)').should('have.text','samplePic.jpg')
        cy.get('tbody tr:nth-child(9) > td:nth-child(2)').should('have.text',formTestData.currentAddress)
        cy.get('tbody tr:nth-child(10) > td:nth-child(2)').should('have.text',formTestData.city+' '+formTestData.state)

    })


})