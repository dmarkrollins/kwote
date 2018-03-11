import { Meteor } from 'meteor/meteor'
import { Kwote, Authors } from '../lib/kwote'

Authors._ensureIndex('createdBy', 1)
Authors._ensureIndex('lastName', 1)

Meteor.publish('myAuthors', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    return Authors.find(
        {
            createdBy: Meteor.userId()
        },
        {
            sort: { lastName: 1 }
        }
    )
})
