import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Kwote, Quotes, Projects, Categories, Authors } from '../lib/kwote'

Quotes._ensureIndex('createdBy', 1)
Quotes._ensureIndex('title', 1)

Meteor.publish('myQuotes', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    const dl = search.limit || Kwote.defaultLimit

    const projectIds = _.pluck(Projects.find(
        {
            createdBy: Meteor.userId(),
            title: { $regex: search.title, $options: 'i' }
        },
        {
            fields: { _id: 1 }
        }
    ).fetch(), '_id')

    const categoryIds = _.pluck(Categories.find(
        {
            createdBy: Meteor.userId(),
            title: { $regex: search.title, $options: 'i' }
        },
        {
            fields: { _id: 1 }
        }
    ).fetch(), '_id')

    const authorIds = _.pluck(Authors.find(
        {
            createdBy: Meteor.userId(),
            lastName: { $regex: search.title, $options: 'i' }
        },
        {
            fields: { _id: 1 }
        }
    ).fetch(), '_id')

    return Quotes.find(
        {
            createdBy: Meteor.userId(),
            $or: [
                { title: { $regex: search.title, $options: 'i' } },
                { author: { $in: authorIds } },
                { categories: { $in: categoryIds } },
                { projects: { $in: projectIds } }
            ]
        },
        {
            sort: { title: 1 },
            limit: dl
        }
    )
})

Meteor.publish('singleQuote', function (id) {
    if (!Meteor.userId()) {
        return null
    }
})
