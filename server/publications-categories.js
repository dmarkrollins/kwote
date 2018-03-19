import { Meteor } from 'meteor/meteor'
import { Kwote, Categories } from '../lib/kwote'
// import { Constants } from '../lib/constants'

Categories._ensureIndex('createdBy', 1)
Categories._ensureIndex('title', 1)

Meteor.publish('myCategories', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    let searchVal

    if (!search) {
        searchVal = ''
    } else {
        searchVal = search
    }

    return Categories.find(
        {
            createdBy: Meteor.userId(),
            title: { $regex: searchVal, $options: 'i' }
        },
        {
            sort: { title: 1 }
        }
    )
})
