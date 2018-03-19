/* global moment */

import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'

const faker = Meteor.isTest && require('faker') // eslint-disable-line global-require

const TestData = {

    fakeAuthor(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const Author = {}

        Author.firstName = parms.firstName || faker.name.firstName()
        Author.lastName = parms.lastName || faker.name.lastName()
        Author.birthDate = parms.firstName || faker.date.past()
        Author.deathDate = parms.firstName || faker.date.recent()
        Author.comments = parms.comments || 'fake comments'

        return Author
    },

    fakeQuote(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters
        }

        const Quote = {}

        Quote.title = parms.title || faker.name.title()
        Quote.author = parms.author || { label: faker.name.title(), value: Random.id() }
        Quote.projects = parms.projects || []
        Quote.categories = parms.categories || []
        Quote.body = parms.comments || 'fake body'

        return Quote
    }
}

module.exports = { TestData }