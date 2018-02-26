import { Meteor } from 'meteor/meteor'
import { Kwote, Quotes } from '../lib/kwote'
// import { Constants } from '../lib/constants'

Quotes._ensureIndex('createdBy', 1)
Quotes._ensureIndex('title', 1)

Meteor.publish('myQuotes', function (search, limit) {
    if (!Meteor.userId()) {
        return null
    }

    const dl = limit || Kwote.defaultLimit;

    return Quotes.find(
        {
            createdBy: Meteor.userId()
        },
        {
            sort: { title: 1 }
        },
        {
            limit: dl
        }
    )
})
