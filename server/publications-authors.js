import { Meteor } from 'meteor/meteor'
import { Kwote, Authors } from '../lib/kwote'

Authors._ensureIndex('createdBy', 1)
Authors._ensureIndex('lastName', 1)
Authors._ensureIndex('firstName', 1)


Meteor.publish('myAuthors', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    let searchVal

    if (!search) {
        searchVal = ''
    } else {
        searchVal = search
    }

    return Authors.find(
        {
            createdBy: Meteor.userId(),
            $or: [
                { lastName: { $regex: searchVal, $options: 'i' } },
                { firstName: { $regex: searchVal, $options: 'i' } }
            ]
        },
        {
            sort: { lastName: 1 }
        }
    )
})

Meteor.publish('singleAuthor', function (id) {
    if (!Meteor.userId()) {
        return null
    }

    return Authors.find({
        _id: id,
        createdBy: Meteor.userId()
    })
})
