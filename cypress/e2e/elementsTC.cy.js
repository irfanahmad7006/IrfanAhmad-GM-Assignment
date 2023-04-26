/// <reference types="Cypress"/>

const configData = require('../fixtures/BaseConfigfile.json')
const testData = require('../fixtures/TestData.json')

describe('TC01-Scenario A- Verify user can enter new data into the table', () => {


    beforeEach(function(){
        cy.on("uncaught:exception", () => false)
        cy.visit(configData.baseURL)
        cy.visit(configData.baseURL + 'elements')
    })

    it('Open the application', () => {
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'elements')
        cy.get('div[class="element-list collapse show"] #item-3 >span').click();
        cy.get('#addNewRecordButton').click()
        cy.get('#firstName').type(testData.firstName)
        cy.get('#lastName').type(testData.lastName)
        cy.get('#userEmail').type(testData.email)
        cy.get('#age').type(testData.age)
        cy.get('#salary').type(testData.salary)
        cy.get('#department').type(testData.department)
        cy.get('#submit', { timeout: 12000 }).click()

        cy.get('div.rt-tbody > div > div.rt-tr').each(($row, index, $rows) => {
            cy.wrap($row).within(function () {
                cy.get('.rt-td').each(function ($celldata, ind, $columns) {
                    cy.log($celldata.text())
                })
            })
        })

        cy.get('div.rt-tbody > div > div.rt-tr').contains(testData.firstName).parent().within(function () {
            cy.get('.rt-td').eq(1).then(function (lname) {
                cy.log(lname.text())
                expect(lname.text()).to.eq(testData.lastName)
            })
            cy.get('.rt-td').eq(2).then(function (age) {
                cy.log(age.text())
                expect(age.text()).to.eq(testData.age)
            })
            cy.get('.rt-td').eq(3).then(function (em) {
                cy.log(em.text())
                expect(em.text()).to.eq(testData.email)
            })
            cy.get('.rt-td').eq(4).then(function (sal) {
                cy.log(sal.text())
                expect(sal.text()).to.eq(testData.salary)
            })
            cy.get('.rt-td').eq(5).then(function (dep) {
                cy.log(dep.text())
                expect(dep.text()).to.eq(testData.department)
            })
        })

    })

    it('TC01-Scenarios B- Verify user can edit the row in a table', () => {
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'elements')
        cy.get('div[class="element-list collapse show"] #item-3 >span').click();

        cy.get('div.rt-tbody > div > div.rt-tr').contains('Alden').parent().within(function () {

            cy.get('.rt-td').eq(6).children().within(function () {
                cy.get('[title="Edit"]').click()
            })
        })

        cy.get('#firstName').clear().type("Germidica")
        cy.get('#lastName').clear().type("BV")

        cy.get('#submit', { timeout: 12000 }).click()

        cy.get('div.rt-tbody > div > div.rt-tr').contains("Germidica").parent().within(function () {

            cy.get('.rt-td').eq(0).then(function (fname) {
                cy.log(fname.text())
                expect(fname.text()).to.eq("Germidica")
            })

            cy.get('.rt-td').eq(1).then(function (lname) {
                cy.log(lname.text())
                expect(lname.text()).to.eq("BV")
            })
        })        

    })

    it("TC02 - Verify broken image", function () {
        // cy.on("uncaught:exception", () => false)
        // cy.visit(configData.baseURL)
        // cy.visit(configData.baseURL + 'elements')
        cy.get('div[class="element-list collapse show"] #item-6 >span').click();
        cy.get('#app > div > div > div.row > div.col-12.mt-4.col-md-6 > div:nth-child(2) > img:nth-child(6)')
        .should("be.visible").should(([img]) =>{
            //assuming that the said broken image would of 500*500 heigth and width
            expect(img.naturalWidth).to.equal(500)
            expect(img.naturalHeight).to.equal(500)

        })
    })


})
