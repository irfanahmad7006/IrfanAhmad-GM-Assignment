/// <reference types="Cypress"/>

const configData = require('../fixtures/BaseConfigfile.json')


describe("Create User Account, add a list of books and remove one book (Happy Path)", () => {
    var randomUserName = ""
    var userID = ""
    var token = ""
    var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for (var i = 0; i < 10; i++) {
        randomUserName += pattern.charAt(Math.floor(Math.random() * pattern.length))
    }

    it('Create the user and store the userID in the runtime', () => {
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.userEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(201)
            expect(res.body.username).to.eq(randomUserName)
            userID = res.body.userID;
            cy.log("User id is: " + userID)
        })
    })

    it('Generate token for the newly created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.generateTokenEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            cy.log(JSON.stringify(res.body.token))
            token = res.body.token;
            expect(res.status).to.eq(200)
        })
    })


    it('Authorize the newly created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.authorizedUserEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body).to.eq(true)
        })
    })

    it('Adding a list of book for the created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.booksEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: {

                "userId": userID,
                "collectionOfIsbns": [
                    {
                        "isbn": "9781449325862",
                        "title": "Git Pocket Guide",
                        "subTitle": "A Working Introduction",
                        "author": "Richard E. Silverman",
                        "publish_date": "2020-06-04T08:48:39.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 234,
                        "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
                        "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
                    },
                    {
                        "isbn": "9781449331818",
                        "title": "Learning JavaScript Design Patterns",
                        "subTitle": "A JavaScript and jQuery Developer's Guide",
                        "author": "Addy Osmani",
                        "publish_date": "2020-06-04T09:11:40.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 254,
                        "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-da",
                        "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
                    },
                    {
                        "isbn": "9781449337711",
                        "title": "Designing Evolvable Web APIs with ASP.NET",
                        "subTitle": "Harnessing the Power of the Web",
                        "author": "Glenn Block et al.",
                        "publish_date": "2020-06-04T09:12:43.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 238,
                        "description": "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft",
                        "website": "http://chimera.labs.oreilly.com/books/1234000001708/index.html"
                    }
                ]
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
        })
    })


    it('Deleting a book', () => {
        cy.log(userID)
        cy.request({
            method: 'DELETE',
            url: configData.baseURL + configData.bookEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: {
                "userId": userID,
                "isbn": "9781449337711"
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(204)
        })

    })

    it('Verifying the book has been deteled', () => {
        cy.log(userID)
        cy.request({
            method: 'GET',
            url: configData.baseURL + configData.userEndpoint + '/' + userID,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: {
                "userId": userID,
                "isbn": "9781449337711"
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            for (var i = 0; i < res.body.books.length; i++) {
                cy.log(JSON.stringify(res.body.books[i].isbn));
                expect(res.body.books[i].isbn).to.not.eq(9781449337711)
            }
        })
    })
})


describe("Create User Account, add a list of books and remove one book (Negative Path:Intentionally using wrong token for deleting a book)", () => {

    var randomUserName = ""
    var userID = ""
    var token = ""
    var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for (var i = 0; i < 10; i++) {
        randomUserName += pattern.charAt(Math.floor(Math.random() * pattern.length))
    }

    it('Create the user and store the userID in the runtime', () => {
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.userEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(201)
            expect(res.body.username).to.eq(randomUserName)
            userID = res.body.userID;
            cy.log("User id is: " + userID)
        })
    })

    it('Generate token for the newly created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.generateTokenEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            cy.log(JSON.stringify(res.body.token))
            token = res.body.token;
            expect(res.status).to.eq(200)
        })
    })


    it('Authorize the newly created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.authorizedUserEndpoint,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userName": randomUserName,
                "password": configData.password
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body).to.eq(true)
        })
    })

    it('Adding a list of book for the created user', () => {
        cy.log(userID)
        cy.request({
            method: 'POST',
            url: configData.baseURL + configData.booksEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: {

                "userId": userID,
                "collectionOfIsbns": [
                    {
                        "isbn": "9781449325862",
                        "title": "Git Pocket Guide",
                        "subTitle": "A Working Introduction",
                        "author": "Richard E. Silverman",
                        "publish_date": "2020-06-04T08:48:39.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 234,
                        "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
                        "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
                    },
                    {
                        "isbn": "9781449331818",
                        "title": "Learning JavaScript Design Patterns",
                        "subTitle": "A JavaScript and jQuery Developer's Guide",
                        "author": "Addy Osmani",
                        "publish_date": "2020-06-04T09:11:40.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 254,
                        "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-da",
                        "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
                    },
                    {
                        "isbn": "9781449337711",
                        "title": "Designing Evolvable Web APIs with ASP.NET",
                        "subTitle": "Harnessing the Power of the Web",
                        "author": "Glenn Block et al.",
                        "publish_date": "2020-06-04T09:12:43.000Z",
                        "publisher": "O'Reilly Media",
                        "pages": 238,
                        "description": "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft",
                        "website": "http://chimera.labs.oreilly.com/books/1234000001708/index.html"
                    }
                ]
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
        })
    })


    it('Deleting a book', () => {
        cy.log(userID)
        cy.request({
            method: 'DELETE',
            url: configData.baseURL + configData.bookEndpoint,
            headers: {
                'Content-Type': 'application/json',
                //adding a worng authorization to fail the test
                'authorization': 'Bearer ' + pattern
            },
            body: {
                "userId": userID,
                "isbn": "9781449337711"
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(204)
        })

    })

    it('Verifying the book has been deteled', () => {
        cy.log(userID)
        cy.request({
            method: 'GET',
            url: configData.baseURL + configData.userEndpoint + '/' + userID,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: {
                "userId": userID,
                "isbn": "9781449337711"
            }
        }).then((res) => {
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            for (var i = 0; i < res.body.books.length; i++) {
                cy.log(JSON.stringify(res.body.books[i].isbn));
                expect(res.body.books[i].isbn).to.not.eq(9781449337711)
            }
        })
    })
})