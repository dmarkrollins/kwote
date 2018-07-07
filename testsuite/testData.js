/* global moment */
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'

const TestData = {

    async fakeAuthor(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const faker = await import('faker')

        const Author = {}

        Author.firstName = parms.firstName || faker.name.firstName()
        Author.lastName = parms.lastName || faker.name.lastName()
        Author.birthDate = parms.firstName || faker.date.past()
        Author.deathDate = parms.firstName || faker.date.recent()
        Author.comments = parms.comments || 'fake comments'

        return Author
    },

    async fakeQuote(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const Quote = {}

        const faker = await import('faker')

        Quote.title = parms.title || faker.name.title()
        Quote.author = parms.author || { label: faker.name.title(), value: Random.id() }
        Quote.projects = parms.projects || []
        Quote.categories = parms.categories || []
        Quote.body = parms.body || 'fake body'

        return Quote
    },

    async fakeQuotesList(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const faker = await import('faker')

        const quotes = []

        const count = parms.count || 3

        for (let i = 0; i < count; i += 1) {
            const Quote = {}

            Quote.title = parms.title || faker.name.title()
            Quote.author = parms.author || { label: faker.name.title(), value: Random.id() }
            Quote.projects = parms.projects || []
            Quote.categories = parms.categories || []
            Quote.body = parms.body || 'fake body'
            quotes.push(Quote)
        }

        return quotes
    },

    fakeError(message) {
        const err = {}

        err.error = 'error-occurred'
        err.reason = message || 'fake reason'
        err.details = 'fake details'

        return err
    },

    async fakeCategory(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const faker = await import('faker')

        const doc = {}

        doc.title = parms.title || faker.name.title()
        doc.createdBy = parms.createdBy || Random.id()

        return doc
    },

    fakeCategoriesArray(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const doc = []

        const count = parms.count || 4

        for (let i = 0; i < count; i += 1) {
            doc.push({
                label: `Category_${i}`,
                value: 'placeholder'
            })
        }

        return doc
    },

    fakeProjectsArray(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const doc = []

        const count = parms.count || 4

        for (let i = 0; i < count; i += 1) {
            doc.push({
                label: `Project_${i}`,
                value: 'placeholder'
            })
        }

        return doc
    },

    async fakeProject(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const faker = await import('faker')

        const doc = {}

        doc.title = parms.title || faker.name.title()
        doc.createdBy = parms.createdBy || Random.id()

        return doc
    }
}

module.exports = { TestData }
